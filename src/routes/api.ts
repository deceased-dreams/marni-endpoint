import { writeFileSync } from 'fs';
import * as bodyParser from 'body-parser';
import { Request, Response, Express } from "express";
import { age as calcAge, htmlDate } from "../util";
import { Sex } from "../entity/Sex";
import { StatusGizi } from "../entity/StatusGizi";
import { DataBalita } from "../entity/DataBalita";
import { lookupCategory, fuzz, Row, BB_TB_MAP, INF } from "../fuzzy";
import * as moment from 'moment';
import { Kriteria } from 'marni/entity/Kriteria';
import { SubKriteria } from 'marni/entity/SubKriteria';

const carbone = require('carbone');
const ID_LENGTH = 5;
const TEMPLATE_PATH = './templates/reports';
const OUTPUT_PATH = './generated/reports';
const TEMPLATE_FILE_PATH = `${TEMPLATE_PATH}/ranks.docx`;
const TEMPLATE_2_FILE_PATH = `${TEMPLATE_PATH}/ranks-perangkingan.docx`;

function monthDiff(d1, d2) {
  var months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth() + 1;
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
}

export default (app: Express) => {

  app.get("/api/user/:id", async (req, resp) => {
    const user = await req.db.repoUser.findOne(req.params.id);
    resp.json(user);
  });

  app.get("/api/alternatif/:id", async (req, resp) => {
    const item = await req.db.repoBalita.findOneOrFail(req.params.id);
    resp.send(item);
  });

  app.delete("/api/alternatif/:id", async (req, resp) => {
    await req.db.repoBalita.delete(req.params.id);
    resp.send('OK');
  });

  app.put("/api/alternatif/:id", bodyParser.json(), async (req, resp) => {
    const item = await req.db.repoBalita.findOneOrFail(req.params.id);
    item.nama = req.body.nama;
    item.tinggiBadan = parseFloat(req.body.tinggiBadan);
    item.beratBadan = parseFloat(req.body.beratBadan);
    item.tanggalLahir = new Date(req.body.tanggalLahir);
    item.sex = Sex[req.body.sex] as Sex;

    await req.db.repoBalita.save(item);
    resp.send('OK');
  });

  app.get("/api/alternatif", async (req, resp) => {
    const items = await req.db.repoBalita.find();
    const withAge = items.map(it => {
      const age = calcAge(it.tanggalLahir);
      return {
        ...it,
        age
      }
    })
    resp.send(withAge);
  });

  app.post("/api/alternatif", bodyParser.json(), async (req, resp) => {
    const payload = {
      nama: req.body.nama as string,
      tanggalLahir: req.body.tanggalLahir,
      beratBadan: parseFloat(req.body.beratBadan),
      tinggiBadan: parseFloat(req.body.tinggiBadan),
      sex: Sex[req.body.sex] as Sex
    };

    let data = req.db.repoBalita.create(payload);
    data = await req.db.repoBalita.save(data);
    resp.send('OK');
  });

  app.get("/api/rank", async (req, resp) => {

    const items = await req.db.repoBalita.find();
    const withAge = items.map(it => ({
      ...it,
      age: calcAge(it.tanggalLahir)
    }));

    const rows: Row[] = withAge.map(it => {
      return [
        it.age,
        it.beratBadan,
        it.tinggiBadan,
        it.sex === Sex.LAKI_LAKI ? 0 : 1
      ];
    });

    const priors = [3, 4, 4, 3];

    const result = fuzz(rows, priors);
    const withVs = withAge.map((it, idx) => {
      return {
        ...it,
        v: result[idx].v,
        fuzz: result[idx].fuzz,
        norm: result[idx].norm
      }
    });

    const sorted = withVs.sort((a, b) => b.v - a.v);

    resp.send(sorted);
  });

  app.get('/api/report/alternatif', async (req, resp) => {
    const fileResultName = 'report-alternatif.docx';
    const items = await req.db.repoBalita.find();

    const withAge = items.map(it => {
      const age = calcAge(it.tanggalLahir);
      return {
        ...it,
        age,
        sex: it.sex == 'PEREMPUAN' ? 'Perempuan' : 'Laki - Laki'
      }
    });

    const dataToPrint = {
      items: withAge,
      waktu: moment().format("dddd, MMMM Do YYYY, h:mm:ss a"),
      total: withAge.length
    };

    const prom = new Promise<string>((resolve, reject) => {
      carbone.render(TEMPLATE_FILE_PATH, dataToPrint, function (err, result) {
        if (err) {
          console.log(err);
          reject(err);
        }
        // write the result
        writeFileSync(fileResultName, result);
        resolve(fileResultName);
      });
    });

    prom
      .then(fileResultName => {
        resp.download(fileResultName);
      })
      .catch(err => {
        resp.status(500).end();
      });
  });

  app.get('/api/report/perangkingan', async (req, resp) => {
    const fileResultName = 'ranks.docx';
    const items = await req.db.repoBalita.find();
    const withAge = items.map(it => ({
      ...it,
      age: calcAge(it.tanggalLahir)
    }));
    console.log(items);

    let bb_result = await Promise.all(withAge.map(async (it: any) => {
      const age_in_month = it.age * 12;
      const sex = it.sex;
      const bb = it.beratBadan;
      const row = await req.db.repoBB.findOne({
        where: {
          sex,
          umur: age_in_month
        },
        order: {
          umur: 'ASC'
        }
      });
      return row.statusGizi(bb);
    }));

    const rows: Row[] = withAge.map(it => {
      return [
        it.age,
        it.beratBadan,
        it.tinggiBadan,
        it.sex === Sex.LAKI_LAKI ? 0 : 1
      ];
    });

    const priors = [3, 4, 4, 3];

    const result = fuzz(rows, priors);
    const withVs = withAge.map((it, idx) => {
      return {
        ...it,
        sex: it.sex == 'PEREMPUAN' ? 'Perempuan' : 'Laki - Laki',
        v: result[idx].v.toFixed(3),
        bb: 'gizi ' + bb_result[idx].toLowerCase(),
        vFormatted: ((v) => {
          if (v < 0.6) return 'Gizi Buruk';
          if (v > 0.6 && v < 0.699) return 'Gizi Kurang';
          if (v > 0.7 && v < 0.799) return 'Gizi Sedang';
          if (v > 0.8) return 'Gizi Baik';
        })(result[idx].v)
      }
    });
    const dataToPrint = {
      items: withVs,
      // Current timestamp
      waktu: moment().format("dddd, MMMM Do YYYY, h:mm:ss a"),
      total: withVs.length
    };
    const prom = new Promise<string>((resolve, reject) => {
      carbone.render(TEMPLATE_2_FILE_PATH, dataToPrint, function (err, result) {
        if (err) {
          console.log(err);
          reject(err);
        }
        // write the result
        writeFileSync(fileResultName, result);
        resolve(fileResultName);
      });
    });

    prom
      .then(fileResultName => {
        resp.download(fileResultName);
      })
      .catch(err => {
        resp.status(500).end();
      });
  });

  app.get("/api/bb_lookup", async (req, resp) => {
    const { age_in_month, sex, ...rest } = req.query;
    const bb = parseFloat(rest.bb);
    const row = await req.db.repoBB.findOne({
      where: {
        sex,
        umur: age_in_month
      },
      order: {
        umur: 'ASC'
      }
    });
    console.log(req.query);
    console.log(row);
    let result: StatusGizi = row.statusGizi(bb);
    resp.send(result);
  });

  app.post("/api/bb_lookup", bodyParser.json(), async (req, resp) => {
    const data = req.body;
    console.log("req.body = ", req.body);
    const result = await Promise.all(data.map(async (it: any) => {
      const { age_in_month, sex, ...rest } = it;
      const bb = parseFloat(rest.bb);
      const row = await req.db.repoBB.findOne({
        where: {
          sex,
          umur: age_in_month
        },
        order: {
          umur: 'ASC'
        }
      });
      return row.statusGizi(bb);
    }));
    resp.send(result);
  });

  app.post("/api/kriteria", bodyParser.json(), async (req, resp) => {
    const kriterias = req.db.conn.getRepository<Kriteria>(Kriteria);
    let kriteria = kriterias.create(req.body as Partial<Kriteria>);
    await kriterias.save(kriteria);
    resp.send(kriteria);
  });

  app.delete('/api/kriteria/:id', async (req, res) => {
    const kriterias = req.db.conn.getRepository<Kriteria>(Kriteria);
    await kriterias.delete(req.params.id);
    res.send('ok');
  });

  app.get('/api/kriteria', async (req, resp) => {
    const kriterias = req.db.conn.getRepository<Kriteria>(Kriteria);
    const items = await kriterias.find();
    resp.send(items);
  });

  app.get('/api/kriteria/:id', async (req, resp) => {
    const kriterias = req.db.conn.getRepository<Kriteria>(Kriteria);
    const item = await kriterias.findOne(req.params.id);
    resp.send(item);
  });

  app.post('/api/kriteria/:id/subs', bodyParser.json(), async (req, resp) => {
    const subs = req.db.conn.getRepository<SubKriteria>(SubKriteria);
    const idKriteria = req.params.id;
    let sub = subs.create({ ...req.body, idKriteria } as Partial<SubKriteria>);
    await subs.save(sub);
    resp.send(sub);
  });

  app.get('/api/kriteria/:id/subs', async (req, resp) => {
    const subs = req.db.conn.getRepository<SubKriteria>(SubKriteria);
    const items = await subs.find({
      idKriteria: parseInt(req.params.id)
    })
    resp.send(items);
  });

  app.delete('/api/subs/:id', async (req, resp) => {
    const subs = req.db.conn.getRepository<SubKriteria>(SubKriteria);
    await subs.delete(parseInt(req.params.id));
    resp.send('ok');
  });

  app.get('/api/sub-kriteria/:id', async (req, resp) => {
    const subs = req.db.conn.getRepository<SubKriteria>(SubKriteria);
    const sub = await subs.findOne(req.params.id);
    resp.send(sub);
  });

  app.put('/api/sub-kriteria/:id', bodyParser.json(), async (req, resp) => {
    const subs = req.db.conn.getRepository<SubKriteria>(SubKriteria);
    const { id, ...payload } = req.body;
    const sub = await subs.findOne(req.params.id);
    resp.send(sub);
  });

  app.get('/api/priors', async (req, resp) => {
    const priors = [
      { 
        idx: 3,
        c: 'Umur'
      }, 
      {
        c: 'Berat Badan',
        idx: 4
      }, 
      {
        idx: 4,
        c: 'Tinggi Badan'
      }, 
      {
        idx: 3,
        c: 'Jenis Kelamin'
      }];
    const weights = [
      [0, 0, 0.25],
      [0, 0.25, 0.5],
      [0.25, 0.5, 0.75],
      [0.5, 0.75, 1.0],
      [0.75, 1.0, 1.0]
    ];
    let result = priors
      .map(p => {
        return {
          c: p.c,
          w: weights[p.idx],
          defuzz: weights[p.idx].reduce((a, b) => a + b, 0) / 3.0
        }
      });
    const sumDefuzz = result
      .map(r => r.defuzz)
      .reduce((a, b) => a + b, 0);
    result = result.map(r => {
      return {
        ...r,
        norm: r.defuzz / sumDefuzz
      }
    })
    resp.send(result);
  });

  app.get('/api/who/bb_median/:type', async (req, resp) => {
    const type = req.params.type;
    const filter = {
      sex: type == 'men' ? 'LAKI_LAKI' : 'PEREMPUAN'
    };
    const items = await req.db.repoBB.find(filter as any);
    resp.send(items);
  });

  app.get('/api/who/bobot_sg', async (req, resp) => {
    console.log(req.query);
    const { query } = req;
    const { mode, umur } = query as any;
    const age = parseInt(umur);

    const start_row_idx = age * 5;
    let results = [] as any[];
    for (let i = 0; i < 5; i++) {
      const row = BB_TB_MAP[start_row_idx + i]
      // if it's bb 
      const result = mode == 'berat' 
        ? row.filter((v, idx) => idx >= 4)
        : row.filter((v, idx) => idx < 4);
      let label = null;
      if (mode == 'tinggi') {
        if (i == 0) { label = 'Sangat Pendek' }
        else if (i == 1) { label = 'Pendek' }
        else if (i == 2) { label = 'Normal' }
        else if (i == 3) { label = 'Tinggi' }
        else if (i == 4) { label = 'Sangat Tinggi' }
      } else {
        if (i == 0) { label = 'Sangat Ringan' }
        else if (i == 1) { label = 'Ringan' }
        else if (i == 2) { label = 'Normal' }
        else if (i == 3) { label = 'Berat' }
        else if (i == 4) { label = 'Sangat Berat' }
      }
      // 0, 1 = woman
      // 2, 3 = man
      const woman_low = result[0]
      const woman_upper = result[1] != INF ? result[1] : null
      const man_low = result[2]
      const man_upper = result[3] != INF ? result[3] : null
      const labeled = {
        label,
        woman_low,
        woman_upper,
        man_low,
        man_upper
      };
      results.push(labeled);
    }
    resp.send(results);
  });

}