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
      resp.redirect("/admin");
    }
  });

  app.get("/admin", async (req: Request, resp: Response) => {
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

    resp.render("admin/index", {
      aggregate
    });
  });

  app.get("/admin/alternatif", async (req: Request, resp: Response) => {
    const items = await req.db.repoBalita.find();
    const withAge = items.map(it => {
      const age = calcAge(it.tanggalLahir);
      return {
        ...it,
        age
      }
    })
    resp.render("admin/alternatif/list", {
      items: withAge
    });
  });
};