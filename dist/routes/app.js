"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
const multer = require("multer");
const csv = require("csv-parser");
const moment = require("moment");
const util_1 = require("../util");
const fuzzy_1 = require("../fuzzy");
const DataBalita_1 = require("../entity/DataBalita");
const Sex_1 = require("../entity/Sex");
class MultiStream extends stream_1.Readable {
    constructor(object, options) {
        super(object instanceof Buffer || typeof object === "string" ? options : { objectMode: true });
        this._read = () => {
            this.push(this._object);
            this._object = null;
        };
        this._object = object;
    }
}
exports.MultiStream = MultiStream;
exports.default = (app) => {
    // V1.
    app.get("/login", (req, resp) => {
        resp.render("landing/login");
    });
    app.post("/login", multer().none(), (req, resp) => __awaiter(this, void 0, void 0, function* () {
        const username = req.body.username;
        const password = req.body.password;
        const user = yield req.db.repoUser.findOne({
            username,
            password
        });
        console.log(user);
        if (!user) {
            resp.redirect("/login");
        }
        else {
            req.session.userid = user.id;
            resp.redirect("/app");
        }
    }));
    app.get("/app", (req, resp) => __awaiter(this, void 0, void 0, function* () {
        const repo = req.db.repoBalita;
        const items = yield repo.find();
        const withAge = items.map(it => (Object.assign({}, it, { age: util_1.age(it.tanggalLahir) })));
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
            const sexKey = it.sex == Sex_1.Sex.LAKI_LAKI ? 'L' : 'P';
            const sex = aggregate.sex[sexKey];
            aggregate.umur[it.age] = umur + 1;
            aggregate.sex[sexKey] = sex + 1;
        });
        resp.render("app/index", {
            aggregate
        });
    }));
    app.get("/app/data/list", (req, resp) => __awaiter(this, void 0, void 0, function* () {
        const items = yield req.db.repoBalita.find();
        const withAge = items.map(it => {
            const age = util_1.age(it.tanggalLahir);
            return Object.assign({}, it, { age });
        });
        resp.render("app/data/list", {
            items: withAge
        });
    }));
    app.get("/app/data/add", (req, resp) => __awaiter(this, void 0, void 0, function* () {
        resp.render("app/data/add");
    }));
    app.post("/app/data/add", multer().none(), (req, resp) => __awaiter(this, void 0, void 0, function* () {
        const tanggalLahirStr = req.body.tanggalLahir;
        let tanggalLahir;
        if (Date.parse(tanggalLahirStr)) {
            tanggalLahir = new Date(tanggalLahirStr);
        }
        else {
            throw new Error('Invalid tanggalLahir');
        }
        const payload = {
            nama: req.body.nama,
            tanggalLahir: tanggalLahir,
            beratBadan: parseFloat(req.body.beratBadan),
            tinggiBadan: parseFloat(req.body.tinggiBadan),
            sex: Sex_1.Sex[req.body.sex]
        };
        let data = req.db.repoBalita.create(payload);
        data = yield req.db.repoBalita.save(data);
        resp.redirect("/app/data/list");
    }));
    app.get("/app/data/edit/:id", (req, resp) => __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const item = yield req.db.repoBalita.findOne(id);
        // Change date to YYYY-MM-DD
        const htmlDateStr = util_1.htmlDate(item.tanggalLahir);
        resp.render("app/data/edit", {
            balita: Object.assign({}, item, { htmlDateStr })
        });
    }));
    app.post("/app/data/edit/:id", multer().none(), (req, resp) => __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        let item = yield req.db.repoBalita.findOne(id);
        item.nama = req.body.nama;
        item.tinggiBadan = parseFloat(req.body.tinggiBadan);
        item.beratBadan = parseFloat(req.body.beratBadan);
        item.tanggalLahir = new Date(req.body.tanggalLahir);
        item.sex = Sex_1.Sex[req.body.sex];
        yield req.db.repoBalita.save(item);
        const message = 'Sukses mengubah data balita';
        const link = `/app/data/detail/${item.id}`;
        const type = 'success';
        resp.render("app/notif", {
            message,
            link,
            type
        });
    }));
    app.get("/app/data/delete/:id", (req, resp) => __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        yield req.db.repoBalita.delete(id);
        resp.redirect("/app/data/list");
    }));
    app.get("/app/rank/form", (req, resp) => __awaiter(this, void 0, void 0, function* () {
        resp.render("app/rank/form");
    }));
    app.get("/app/rank", (req, resp) => __awaiter(this, void 0, void 0, function* () {
        const items = yield req.db.repoBalita.find();
        const withAge = items.map(it => (Object.assign({}, it, { age: util_1.age(it.tanggalLahir) })));
        const rows = withAge.map(it => {
            return [
                it.age,
                it.beratBadan,
                it.tinggiBadan,
                it.sex === Sex_1.Sex.LAKI_LAKI ? 0 : 1
            ];
        });
        const priors = [3, 4, 4, 3];
        const result = fuzzy_1.fuzz(rows, priors);
        const withVs = withAge.map((it, idx) => {
            return Object.assign({}, it, { v: result[idx] });
        });
        // Sort by V.
        const sorted = withVs.sort((a, b) => b.v - a.v);
        resp.render("app/rank/result", {
            items: sorted
        });
    }));
    app.get("/app/user/add", (req, resp) => {
        resp.render("app/user/add");
    });
    app.post("/app/user/add", multer().none(), (req, resp) => __awaiter(this, void 0, void 0, function* () {
        const nama = req.body.nama;
        const username = req.body.username;
        const password = req.body.password;
        let user = req.db.repoUser.create({
            nama,
            username,
            password
        });
        user = yield req.db.repoUser.save(user);
        resp.redirect("/app/user/list");
    }));
    app.get("/app/user/list", (req, resp) => __awaiter(this, void 0, void 0, function* () {
        const items = yield req.db.repoUser.find();
        resp.render("app/user/list", {
            items
        });
    }));
    app.get("/app/user/edit/:id", (req, resp) => __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const user = yield req.db.repoUser.findOne(id);
        resp.render("app/user/edit", {
            user
        });
    }));
    app.get("/app/import", (req, resp) => __awaiter(this, void 0, void 0, function* () {
        resp.render("app/import-data");
    }));
    app.post("/app/import", multer().single('data'), (req, resp) => __awaiter(this, void 0, void 0, function* () {
        const file = req.file;
        let lines = [];
        const stream = new MultiStream(file.buffer, {});
        const repo = req.db.repoBalita;
        const convertToDataBalita = (row) => {
            let data = new DataBalita_1.DataBalita();
            data.nama = row.nama;
            data.tinggiBadan = parseFloat(row.tinggiBadan);
            data.beratBadan = parseFloat(row.beratBadan);
            data.sex = row.sex == 'L' ? Sex_1.Sex.LAKI_LAKI : Sex_1.Sex.PEREMPUAN;
            const intUmur = parseInt(row.umur);
            const tanggalLahir = moment().subtract(intUmur, "years").toDate();
            data.tanggalLahir = tanggalLahir;
            return data;
        };
        stream
            .pipe(csv())
            .on('data', data => lines.push(data))
            .on('end', () => __awaiter(this, void 0, void 0, function* () {
            const balitaData = lines.map(convertToDataBalita);
            yield repo.save(balitaData);
            resp.redirect("/app/data/list");
        }));
    }));
};
//# sourceMappingURL=app.js.map