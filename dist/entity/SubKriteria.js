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
const Kriteria_1 = require("./Kriteria");
var SubKriteriaSign;
(function (SubKriteriaSign) {
    SubKriteriaSign["Lower"] = "lower";
    SubKriteriaSign["LowerEqual"] = "lower-equal";
    SubKriteriaSign["Unbounded"] = "unbounded";
})(SubKriteriaSign = exports.SubKriteriaSign || (exports.SubKriteriaSign = {}));
let SubKriteria = class SubKriteria {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], SubKriteria.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], SubKriteria.prototype, "idKriteria", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Kriteria_1.Kriteria, kriteria => kriteria.subs, {
        onDelete: 'CASCADE'
    }),
    typeorm_1.JoinColumn({
        name: 'idKriteria'
    }),
    __metadata("design:type", Kriteria_1.Kriteria)
], SubKriteria.prototype, "kriteria", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], SubKriteria.prototype, "label", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], SubKriteria.prototype, "kode", void 0);
__decorate([
    typeorm_1.Column('float', { nullable: true }),
    __metadata("design:type", Number)
], SubKriteria.prototype, "range_min", void 0);
__decorate([
    typeorm_1.Column('float', { nullable: true }),
    __metadata("design:type", Number)
], SubKriteria.prototype, "range_max", void 0);
__decorate([
    typeorm_1.Column({ type: 'float' }),
    __metadata("design:type", Number)
], SubKriteria.prototype, "weight_a", void 0);
__decorate([
    typeorm_1.Column({ type: 'float' }),
    __metadata("design:type", Number)
], SubKriteria.prototype, "weight_b", void 0);
__decorate([
    typeorm_1.Column({ type: 'float' }),
    __metadata("design:type", Number)
], SubKriteria.prototype, "weight_c", void 0);
__decorate([
    typeorm_1.Column({
        type: 'enum',
        enum: SubKriteriaSign,
        nullable: true
    }),
    __metadata("design:type", String)
], SubKriteria.prototype, "range_upper_sign", void 0);
__decorate([
    typeorm_1.Column({
        type: 'enum',
        enum: SubKriteriaSign,
        nullable: true
    }),
    __metadata("design:type", String)
], SubKriteria.prototype, "range_lower_sign", void 0);
SubKriteria = __decorate([
    typeorm_1.Entity()
], SubKriteria);
exports.SubKriteria = SubKriteria;
//# sourceMappingURL=SubKriteria.js.map