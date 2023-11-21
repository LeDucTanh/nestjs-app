import { WithTimestamp } from "src/utils/app-base.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("refresh_token", { schema: "beautygo_dev" })
export class RefreshToken extends WithTimestamp {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "userId" })
  userId: number;

  @Column("varchar", { name: "token", length: 255 })
  token: string;
}
