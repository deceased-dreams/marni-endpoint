"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
var KriteriaType;
(function (KriteriaType) {
    KriteriaType["Categorial"] = "categorial";
    KriteriaType["Numeric"] = "numeric";
})(KriteriaType = exports.KriteriaType || (exports.KriteriaType = {}));
let Kriteria = class Kriteria {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Kriteria.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Kriteria.prototype, "label", void 0);
__decorate([
    typeorm_1.Column({ type: 'float' }),
    __metadata("design:type", Number)
], Kriteria.prototype, "weight_a", void 0);
__decorate([
    typeorm_1.Column({ type: 'float' }),
    __metadata("design:type", Number)
], Kriteria.prototype, "weight_b", void 0);
__decorate([
    typeorm_1.Column({ type: 'float' }),
    __metadata("design:type", Number)
], Kriteria.prototype, "weight_c", void 0);
__decorate([
    typeorm_1.Column({
        type: 'enum',
        enum: KriteriaType
    }),
    __metadata("design:type", String)
], Kriteria.prototype, "type_kriteria", void 0);
Kriteria = __decorate([
    typeorm_1.Entity()
], Kriteria);
exports.Kriteria = Kriteria;
//# sourceMappingURL=Kriteria.js.map