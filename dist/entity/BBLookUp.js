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
const Sex_1 = require("./Sex");
const StatusGizi_1 = require("./StatusGizi");
let BBLookUp = class BBLookUp {
    statusGizi(beratBadan) {
        let result;
        if (beratBadan <= this.min_c) {
            result = StatusGizi_1.StatusGizi.BURUK;
        }
        else if (beratBadan > this.min_c && beratBadan < this.min_b) {
            result = StatusGizi_1.StatusGizi.KURANG;
        }
        else if (this.min_b <= beratBadan && beratBadan <= this.plus_b) {
            result = StatusGizi_1.StatusGizi.BAIK;
        }
        else {
            result = StatusGizi_1.StatusGizi.LEBIH;
        }
        return result;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], BBLookUp.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        type: 'enum',
        enum: Sex_1.Sex,
        nullable: false
    }),
    __metadata("design:type", String)
], BBLookUp.prototype, "sex", void 0);
__decorate([
    typeorm_1.Column({ type: 'int' }),
    __metadata("design:type", Number)
], BBLookUp.prototype, "umur", void 0);
__decorate([
    typeorm_1.Column({ type: 'float', name: '_min_3' }),
    __metadata("design:type", Number)
], BBLookUp.prototype, "min_c", void 0);
__decorate([
    typeorm_1.Column({ type: 'float', name: '_min_2' }),
    __metadata("design:type", Number)
], BBLookUp.prototype, "min_b", void 0);
__decorate([
    typeorm_1.Column({ type: 'float', name: '_min_1' }),
    __metadata("design:type", Number)
], BBLookUp.prototype, "min_a", void 0);
__decorate([
    typeorm_1.Column({ type: 'float', name: '_plus_1' }),
    __metadata("design:type", Number)
], BBLookUp.prototype, "plus_a", void 0);
__decorate([
    typeorm_1.Column({ type: 'float', name: '_plus_2' }),
    __metadata("design:type", Number)
], BBLookUp.prototype, "plus_b", void 0);
__decorate([
    typeorm_1.Column({ type: 'float', name: '_plus_3' }),
    __metadata("design:type", Number)
], BBLookUp.prototype, "plus_c", void 0);
__decorate([
    typeorm_1.Column({ type: 'float', name: '_med' }),
    __metadata("design:type", Number)
], BBLookUp.prototype, "median", void 0);
BBLookUp = __decorate([
    typeorm_1.Entity({
        name: 'bb_look_up'
    })
], BBLookUp);
exports.BBLookUp = BBLookUp;
//# sourceMappingURL=BBLookUp.js.map