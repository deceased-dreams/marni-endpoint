import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Sex } from "./Sex";
import { StatusGizi } from "./StatusGizi";

@Entity({
	name: 'bb_look_up'
})
export class BBLookUp {

	@PrimaryGeneratedColumn()
	id: number;

	@Column({
    type: 'enum',
    enum: Sex,
    nullable: false
  })
  sex: Sex;

  @Column({ type: 'int' })
  umur: number;

  @Column({ type: 'float', name: '_min_3' })
  min_c: number;

  @Column({ type: 'float', name: '_min_2' })
  min_b: number;

  @Column({ type: 'float', name: '_min_1' })
  min_a: number;

  @Column({ type: 'float', name: '_plus_1' })
  plus_a: number;

  @Column({ type: 'float', name: '_plus_2' })
  plus_b: number;

  @Column({ type: 'float', name: '_plus_3' })
  plus_c: number;

  @Column({ type: 'float', name: '_med' })
  median: number;

  public statusGizi(beratBadan: number): StatusGizi {
    let result: StatusGizi;
    if (beratBadan <= this.min_c) {
      result = StatusGizi.BURUK;
    } else if (beratBadan > this.min_c && beratBadan < this.min_b) {
      result = StatusGizi.KURANG;
    } else if (this.min_b <= beratBadan && beratBadan <= this.plus_b) {
      result = StatusGizi.BAIK;
    } else {
      result = StatusGizi.LEBIH;
    }
    return result;
  }
}