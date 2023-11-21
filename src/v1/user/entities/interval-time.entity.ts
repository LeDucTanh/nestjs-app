import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("interval_time", { schema: "beautygo_dev" })
export class IntervalTime {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name: string | null;
}
