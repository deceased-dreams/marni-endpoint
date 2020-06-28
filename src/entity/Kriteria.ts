import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export enum KriteriaType {
  Categorial = 'categorial',
  Numeric = 'numeric'
}

@Entity()
export class Kriteria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

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
}
