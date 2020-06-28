import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Sex } from "./Sex";

@Entity()
export class DataBalita {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nama: string;

  @Column({ nullable: false })
  tanggalLahir: Date;

  @Column('float',{ nullable: false })
  tinggiBadan: number;

  @Column('float', { nullable: false })
  beratBadan: number;

  @Column({
    type: 'enum',
    enum: Sex,
    nullable: false
  })
  sex: Sex;

  public age_in_month() {
    let months;
    let now = new Date();
    months = (now.getFullYear() - this.tanggalLahir.getFullYear()) * 12;
    months -= now.getMonth() + 1;
    months += this.tanggalLahir.getMonth();
    return months <= 0 ? 0 : months;
  }
}