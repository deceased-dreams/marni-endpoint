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
const multer = require("multer");
const util_1 = require("../util");
const Sex_1 = require("../entity/Sex");
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
            resp.redirect("/admin");
        }
    }));
    app.get("/admin", (req, resp) => __awaiter(this, void 0, void 0, function* () {
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
        resp.render("admin/index", {
            aggregate
        });
    }));
    app.get("/admin/alternatif", (req, resp) => __awaiter(this, void 0, void 0, function* () {
        const items = yield req.db.repoBalita.find();
        const withAge = items.map(it => {
            const age = util_1.age(it.tanggalLahir);
            return Object.assign({}, it, { age });
        });
        resp.render("admin/alternatif/list", {
            items: withAge
        });
    }));
};
//# sourceMappingURL=admin.js.map