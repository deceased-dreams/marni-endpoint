"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const bodyParser = require("body-parser");
const util_1 = require("../util");
const Sex_1 = require("../entity/Sex");
const fuzzy_1 = require("../fuzzy");
const moment = require("moment");
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
exports.default = (app) => {
    app.get("/api/user/:id", (req, resp) => __awaiter(this, void 0, void 0, function* () {
        const user = yield req.db.repoUser.findOne(req.params.id);
        resp.json(user);
    }));
    app.get("/api/alternatif/:id", (req, resp) => __awaiter(this, void 0, void 0, function* () {
        const item = yield req.db.repoBalita.findOneOrFail(req.params.id);
        resp.send(item);
    }));
    app.delete("/api/alternatif/:id", (req, resp) => __awaiter(this, void 0, void 0, function* () {
        yield req.db.repoBalita.delete(req.params.id);
        resp.send('OK');
    }));
    app.put("/api/alternatif/:id", bodyParser.json(), (req, resp) => __awaiter(this, void 0, void 0, function* () {
        const item = yield req.db.repoBalita.findOneOrFail(req.params.id);
        item.nama = req.body.nama;
        item.tinggiBadan = parseFloat(req.body.tinggiBadan);
        item.beratBadan = parseFloat(req.body.beratBadan);
        item.tanggalLahir = new Date(req.body.tanggalLahir);
        item.sex = Sex_1.Sex[req.body.sex];
        yield req.db.repoBalita.save(item);
        resp.send('OK');
    }));
    app.get("/api/alternatif", (req, resp) => __awaiter(this, void 0, void 0, function* () {
        const items = yield req.db.repoBalita.find();
        const withAge = items.map(it => {
            const age = util_1.age(it.tanggalLahir);
            return Object.assign({}, it, { age });
        });
        resp.send(withAge);
    }));
    app.post("/api/alternatif", bodyParser.json(), (req, resp) => __awaiter(this, void 0, void 0, function* () {
        const payload = {
            nama: req.body.nama,
            tanggalLahir: req.body.tanggalLahir,
            beratBadan: parseFloat(req.body.beratBadan),
            tinggiBadan: parseFloat(req.body.tinggiBadan),
            sex: Sex_1.Sex[req.body.sex]
        };
        let data = req.db.repoBalita.create(payload);
        data = yield req.db.repoBalita.save(data);
        resp.send('OK');
    }));
    app.get("/api/rank", (req, resp) => __awaiter(this, void 0, void 0, function* () {
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
        const sorted = withVs.sort((a, b) => b.v - a.v);
        resp.send(sorted);
    }));
    app.get('/api/report/alternatif', (req, resp) => __awaiter(this, void 0, void 0, function* () {
        const fileResultName = 'report-alternatif.docx';
        const items = yield req.db.repoBalita.find();
        const withAge = items.map(it => {
            const age = util_1.age(it.tanggalLahir);
            return Object.assign({}, it, { age, sex: it.sex == 'PEREMPUAN' ? 'Perempuan' : 'Laki - Laki' });
        });
        const dataToPrint = {
            items: withAge,
            waktu: moment().format("dddd, MMMM Do YYYY, h:mm:ss a"),
            total: withAge.length
        };
        const prom = new Promise((resolve, reject) => {
            carbone.render(TEMPLATE_FILE_PATH, dataToPrint, function (err, result) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                // write the result
                fs_1.writeFileSync(fileResultName, result);
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
    }));
    app.get('/api/report/perangkingan', (req, resp) => __awaiter(this, void 0, void 0, function* () {
        const fileResultName = 'ranks.docx';
        const items = yield req.db.repoBalita.find();
        const withAge = items.map(it => (Object.assign({}, it, { age: util_1.age(it.tanggalLahir) })));
        console.log(items);
        let bb_result = yield Promise.all(withAge.map((it) => __awaiter(this, void 0, void 0, function* () {
            const age_in_month = it.age * 12;
            const sex = it.sex;
            const bb = it.beratBadan;
            const row = yield req.db.repoBB.findOne({
                where: {
                    sex,
                    umur: age_in_month
                },
                order: {
                    umur: 'ASC'
                }
            });
            return row.statusGizi(bb);
        })));
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
            return Object.assign({}, it, { sex: it.sex == 'PEREMPUAN' ? 'Perempuan' : 'Laki - Laki', v: result[idx].toFixed(3), bb: 'gizi ' + bb_result[idx].toLowerCase(), vFormatted: ((v) => {
                    if (v < 0.6)
                        return 'Gizi Buruk';
                    if (v > 0.6 && v < 0.699)
                        return 'Gizi Kurang';
                    if (v > 0.7 && v < 0.799)
                        return 'Gizi Sedang';
                    if (v > 0.8)
                        return 'Gizi Baik';
                })(result[idx]) });
        });
        const dataToPrint = {
            items: withVs,
            // Current timestamp
            waktu: moment().format("dddd, MMMM Do YYYY, h:mm:ss a"),
            total: withVs.length
        };
        const prom = new Promise((resolve, reject) => {
            carbone.render(TEMPLATE_2_FILE_PATH, dataToPrint, function (err, result) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                // write the result
                fs_1.writeFileSync(fileResultName, result);
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
    }));
    app.get("/api/bb_lookup", (req, resp) => __awaiter(this, void 0, void 0, function* () {
        const _a = req.query, { age_in_month, sex } = _a, rest = __rest(_a, ["age_in_month", "sex"]);
        const bb = parseFloat(rest.bb);
        const row = yield req.db.repoBB.findOne({
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
        let result = row.statusGizi(bb);
        resp.send(result);
    }));
    app.post("/api/bb_lookup", bodyParser.json(), (req, resp) => __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        console.log("req.body = ", req.body);
        const result = yield Promise.all(data.map((it) => __awaiter(this, void 0, void 0, function* () {
            const { age_in_month, sex } = it, rest = __rest(it, ["age_in_month", "sex"]);
            const bb = parseFloat(rest.bb);
            const row = yield req.db.repoBB.findOne({
                where: {
                    sex,
                    umur: age_in_month
                },
                order: {
                    umur: 'ASC'
                }
            });
            return row.statusGizi(bb);
        })));
        resp.send(result);
    }));
};
//# sourceMappingURL=api.js.map