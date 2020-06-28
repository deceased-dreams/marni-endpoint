import { writeFileSync }  from 'fs';
import * as bodyParser from 'body-parser';
import { Request, Response, Express } from "express";
import { age as calcAge, htmlDate } from "../util";
import { Sex } from "../entity/Sex";
import { StatusGizi } from "../entity/StatusGizi";
import { DataBalita } from "../entity/DataBalita";
import { lookupCategory, fuzz, Row } from "../fuzzy";
import * as moment from 'moment';

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
        v: result[idx]
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
      carbone.render(TEMPLATE_FILE_PATH, dataToPrint, function(err, result) {
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
        v: result[idx].toFixed(3),
        bb: 'gizi ' + bb_result[idx].toLowerCase(),
        vFormatted: ((v) => {
          if (v < 0.6) return 'Gizi Buruk';
          if (v > 0.6 && v < 0.699) return 'Gizi Kurang';
          if (v > 0.7 && v < 0.799) return 'Gizi Sedang';
          if (v > 0.8) return 'Gizi Baik';
        })(result[idx])
      }
    });
    const dataToPrint = {
      items: withVs,
      // Current timestamp
      waktu: moment().format("dddd, MMMM Do YYYY, h:mm:ss a"),
      total: withVs.length
    };
    const prom = new Promise<string>((resolve, reject) => {
      carbone.render(TEMPLATE_2_FILE_PATH, dataToPrint, function(err, result) {
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

}