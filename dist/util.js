"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
function age(date) {
    return moment().diff(date, "years");
}
exports.age = age;
function htmlDate(date) {
    return moment(date).format('YYYY-MM-DD');
}
exports.htmlDate = htmlDate;
//# sourceMappingURL=util.js.map