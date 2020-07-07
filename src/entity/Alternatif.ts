import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity()
export class Alternatif {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nama: string;

  @Column({ nullable: false })
  tanggalLahir: Date;

  @Column({ type: 'json' })
  data: any;
}
