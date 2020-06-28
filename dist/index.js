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
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const express = require("express");
const cors = require("cors");
const DataBalita_1 = require("./entity/DataBalita");
const User_1 = require("./entity/User");
const BBLookUp_1 = require("./entity/BBLookUp");
const api_1 = require("./routes/api");
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield typeorm_1.createConnection();
        const app = express();
        app.use(cors());
        app.use((req, resp, next) => {
            req.db = {
                repoBalita: connection.getRepository(DataBalita_1.DataBalita),
                repoUser: connection.getRepository(User_1.User),
                repoBB: connection.getRepository(BBLookUp_1.BBLookUp),
                conn: connection
            };
            next();
        });
        api_1.default(app);
        app.use(express.static('static'));
        app.listen(5000, (err) => {
            console.log(err);
            console.log("listening at 5000");
        });
    });
}
bootstrap();
//# sourceMappingURL=index.js.map