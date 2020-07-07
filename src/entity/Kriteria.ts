import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { SubKriteria } from "./SubKriteria";

export enum KriteriaType {
  Categorial = 'categorial',
  Numeric = 'numeric'
}

export enum FunctionType {
  umur_f = 'umur_f',
  bb_lookup = 'bb_lookup',
  tb_lookup = 'tb_lookup'
}

@Entity()
export class Kriteria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @Column()
  kode: string;

  @Column({ type: 'float' })
  weight_a: number;

  @Column({ type: 'float' })
  weight_b: number;

  @Column({ type: 'float' })
  weight_c: number;

  @Column({
    type: 'enum',
    enum: KriteriaType
  })
  type_kriteria: KriteriaType;

  @OneToMany(type => SubKriteria, sub => sub.kriteria)
  subs: SubKriteria[];

  @Column({ type: 'varchar', length: 250 })
  defaultValue: any;
}
