import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Kriteria } from "./Kriteria";

export enum SubKriteriaSign {
    Lower = '<',
    LowerEqual = '<=',
    Unbounded = 'unbounded'
}

@Entity()
export class SubKriteria {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    idKriteria: number;

    @ManyToOne(type => Kriteria, kriteria => kriteria.subs, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({
        name: 'idKriteria'
    })
    kriteria: Kriteria;

    @Column()
    label: string;

    @Column()
    kode: string;

    @Column('float', { nullable: true })
    range_min: number;

    @Column('float', { nullable: true })
    range_max: number;

    @Column({ type: 'float' })
    weight_a: number;

    @Column({ type: 'float' })
    weight_b: number;

    @Column({ type: 'float' })
    weight_c: number;

    @Column({
        type: 'enum',
        enum: SubKriteriaSign,
        nullable: true
    })
    range_upper_sign: SubKriteriaSign

    @Column({
        type: 'enum',
        enum: SubKriteriaSign,
        nullable: true
    })
    range_lower_sign: SubKriteriaSign
}
