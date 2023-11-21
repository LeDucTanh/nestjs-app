import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("banner", { schema: "beautygo_dev" })
export class Banner {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("tinyint", {
    name: "type",
    nullable: true,
    comment: "1:Event1 | 2:Event2 | 3:Coupon",
    width: 1,
    default: () => "'1'",
  })
  type: boolean | null;

  @Column("varchar", { name: "main", length: 255 })
  main: string;

  @Column("varchar", { name: "detail", nullable: true, length: 255 })
  detail: string | null;

  @Column("varchar", { name: "title", nullable: true, length: 50 })
  title: string | null;

  @Column("int", { name: "sub_title", nullable: true })
  subTitle: number | null;

  @Column("tinyint", { name: "order", nullable: true, width: 1 })
  order: boolean | null;

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("datetime", {
    name: "updated_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  @Column("datetime", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;
}
