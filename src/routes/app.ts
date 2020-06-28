import { createReadStream } from "fs";
import { Readable, ReadableOptions } from "stream";
import { Request, Response, Express } from "express";
import * as multer from "multer";
import * as csv from "csv-parser";
import * as moment from "moment";

import { age as calcAge, htmlDate } from "../util";
import { lookupCategory, fuzz, Row } from "../fuzzy";
import { DataBalita } from "../entity/DataBalita";
import { Sex } from "../entity/Sex";

export class MultiStream extends Readable {
  _object: any;
  constructor(object: any, options: ReadableOptions) {
    super(object instanceof Buffer || typeof object === "string" ? options : { objectMode: true });
    this._object = object;
  }
  _read = () => {
    this.push(this._object);
    this._object = null;
  };
}

export default (app: Express) => {

  // V1.
  app.get("/login", (req, resp) => {
    resp.render("landing/login");
  });

  app.post("/login", multer().none(), async (req, resp) => {
    const username = req.body.username;
    const password = req.body.password;
    const user = await req.db.repoUser.findOne({
      username,
      password
    });
    console.log(user);
    if (!user) {
      resp.redirect("/login");
    } else {
      req.session.userid = user.id;
      resp.redirect("/app");
    }
  });

  app.get("/app", async (req: Request, resp: Response) => {
    const repo = req.db.repoBalita;
    const items = await repo.find();
    const withAge = items.map(it => ({
      ...it,
      age: calcAge(it.tanggalLahir)
    }));

    const aggregate = {
      umur: {
        '1': 0,
        '2': 0,
        '3': 0,
        '4': 0,
        '5': 0
      },
      sex: {
        L: 0,
        P: 0
      },
      tb: {
        'sp': 0,
        'p': 0,
        'n': 0,
        't': 0,
        'st': 0
      },
      bb: {
        'sr': 0,
        'r': 0,
        'n': 0,
        'b': 0,
        'sb': 0
      }
    };

    withAge.forEach(it => {
      const umur = aggregate.umur[it.age];
      const sexKey = it.sex == Sex.LAKI_LAKI ? 'L' : 'P';
      const sex = aggregate.sex[sexKey];

      aggregate.umur[it.age] = umur + 1;
      aggregate.sex[sexKey] = sex + 1;
    });

    resp.render("app/index", {
      aggregate
    });
  });

  app.get("/app/data/list", async (req: Request, resp: Response) =>{
    const items = await req.db.repoBalita.find();
    const withAge = items.map(it => {
      const age = calcAge(it.tanggalLahir);
      return {
        ...it,
        age
      }
    })
    resp.render("app/data/list", {
      items: withAge
    });
  });

  app.get("/app/data/add", async (req: Request, resp: Response) => {
    resp.render("app/data/add");
  });

  app.post("/app/data/add", multer().none(), async (req: Request, resp: Response) => {
    const tanggalLahirStr = req.body.tanggalLahir;
    let tanggalLahir: Date;

    if (Date.parse(tanggalLahirStr)) {
      tanggalLahir = new Date(tanggalLahirStr);
    } else {
      throw new Error('Invalid tanggalLahir');
    }

    const payload = {
      nama: req.body.nama as string,
      tanggalLahir: tanggalLahir,
      beratBadan: parseFloat(req.body.beratBadan),
      tinggiBadan: parseFloat(req.body.tinggiBadan),
      sex: Sex[req.body.sex] as Sex
    };

    let data = req.db.repoBalita.create(payload);
    data = await req.db.repoBalita.save(data);

    resp.redirect("/app/data/list");
  });

  app.get("/app/data/edit/:id", async (req, resp) => {
    const id = req.params.id;
    const item = await req.db.repoBalita.findOne(id);
    // Change date to YYYY-MM-DD
    const htmlDateStr = htmlDate(item.tanggalLahir);
    resp.render("app/data/edit", {
      balita: {
        ...item,
        htmlDateStr
      }
    });
  });

  app.post("/app/data/edit/:id", multer().none(), async (req, resp) => {
    const id = req.params.id;
    let item = await req.db.repoBalita.findOne(id);

    item.nama = req.body.nama;
    item.tinggiBadan = parseFloat(req.body.tinggiBadan);
    item.beratBadan = parseFloat(req.body.beratBadan);
    item.tanggalLahir = new Date(req.body.tanggalLahir);
    item.sex = Sex[req.body.sex] as Sex;

    await req.db.repoBalita.save(item);

    const message = 'Sukses mengubah data balita';
    const link = `/app/data/detail/${item.id}`;
    const type = 'success';

    resp.render("app/notif", {
      message,
      link,
      type
    });
  });

  app.get("/app/data/delete/:id", async (req, resp) => {
    const id = req.params.id;
    await req.db.repoBalita.delete(id);
    resp.redirect("/app/data/list");
  });

  app.get("/app/rank/form", async (req, resp) => {
    resp.render("app/rank/form");
  });

  app.get("/app/rank", async (req, resp) => {
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

    // Sort by V.
    const sorted = withVs.sort((a, b) => b.v - a.v);
    
    resp.render("app/rank/result", {
      items: sorted
    });
  });

  app.get("/app/user/add", (req, resp) => {
    resp.render("app/user/add");
  });

  app.post("/app/user/add", multer().none(), async (req, resp) => {
    const nama = req.body.nama;
    const username = req.body.username;
    const password = req.body.password;

    let user = req.db.repoUser.create({
      nama,
      username,
      password
    });

    user = await req.db.repoUser.save(user);
    resp.redirect("/app/user/list");
  });

  app.get("/app/user/list", async (req, resp) => {
    const items = await req.db.repoUser.find();
    resp.render("app/user/list", {
      items
    });
  });

  app.get("/app/user/edit/:id", async (req, resp) => {
    const id = req.params.id;
    const user = await req.db.repoUser.findOne(id);
    resp.render("app/user/edit", {
      user
    });
  });

  app.get("/app/import", async (req, resp) => {
    resp.render("app/import-data");
  });

  app.post("/app/import", multer().single('data'), async (req, resp) => {
    const file = req.file;
    let lines: any[] = [];

    const stream = new MultiStream(file.buffer, {});
    const repo = req.db.repoBalita;
    const convertToDataBalita = (row: any) => {
      let data = new DataBalita();
      data.nama = row.nama;
      data.tinggiBadan = parseFloat(row.tinggiBadan);
      data.beratBadan = parseFloat(row.beratBadan);
      data.sex = row.sex == 'L' ? Sex.LAKI_LAKI : Sex.PEREMPUAN;
      const intUmur = parseInt(row.umur);
      const tanggalLahir = moment().subtract(intUmur, "years").toDate();
      data.tanggalLahir = tanggalLahir;

      return data;
    }

    stream
      .pipe(csv())
      .on('data', data => lines.push(data))
      .on('end', async () => {
        const balitaData = lines.map(convertToDataBalita);
        await repo.save(balitaData);
        resp.redirect("/app/data/list");
      });
  });
};
