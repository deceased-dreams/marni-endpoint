import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Kriteria } from "./Kriteria";

export enum SubKriteriaSign {
    Lower = 'lower',
    LowerEqual = 'lower-equal',
    Unbounded = 'unbounded'
}

@Entity()
export class SubKriteria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  idKriteria: number;

  @ManyToOne(type => Kriteria)
  @JoinColumn({
      name: 'idKriteria'
  })
  kriteria: Kriteria;

  @Column()
  label: string;

  @Column('float')
  cat_value: number;

  @Column('float')
  range_min: number;

  @Column('float')
  range_max: number;

  @Column({
      type: 'enum',
      enum: SubKriteriaSign
  })
  range_sign: SubKriteriaSign
}
