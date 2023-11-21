import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Certificate } from "./certificate.entity";

@Entity("certificate_name", { schema: "beautygo_dev" })
export class CertificateName {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column("varchar", { length: 255 })
  name: string;

  @OneToMany(() => Certificate, (certificate) => certificate.certificateName)
  certificates: Certificate[];
}
