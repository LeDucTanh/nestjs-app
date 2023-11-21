import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CertificateCategory } from "./certificate-category.entity";
import { CertificateName } from "./certificate-name.entity";
import { Artist } from "./artist.entity";

@Index("user_id", ["artistId"], {})
@Index("certificate_category_id", ["certificateCategoryId"], {})
@Index("certificate_name_id", ["certificateNameId"], {})
@Entity("certificate", { schema: "beautygo_dev" })
export class Certificate {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column("int")
  artistId: number;

  @Column("varchar", { length: 255 })
  image: string;

  @Column("int", { unsigned: true })
  certificateCategoryId: number;

  @Column("int", { unsigned: true })
  certificateNameId: number;

  @ManyToOne(
    () => CertificateCategory,
    (certificateCategory) => certificateCategory.certificates,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ referencedColumnName: "id" }])
  certificateCategory: CertificateCategory;

  @ManyToOne(
    () => CertificateName,
    (certificateName) => certificateName.certificates,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ referencedColumnName: "id" }])
  certificateName: CertificateName;

  @ManyToOne(() => Artist, (artist) => artist.certificates, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ referencedColumnName: "id" }])
  artist: Artist;
}
