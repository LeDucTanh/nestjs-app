import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Certificate } from "./certificate.entity";

@Entity("certificate_category", { schema: "beautygo_dev" })
export class CertificateCategory {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column("varchar", { length: 255 })
  name: string;

  @OneToMany(
    () => Certificate,
    (certificate) => certificate.certificateCategory
  )
  certificates: Certificate[];
}
