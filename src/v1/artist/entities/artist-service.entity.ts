import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Category } from "./category.entity";
import { ArtistServiceImage } from "./artist-service-image.entity";
import { ArtistServiceSubCategory } from "./artist-service-sub-category.entity";

@Index("category_id", ["categoryId"], {})
@Entity("artist_service", { schema: "beautygo_dev" })
export class ArtistService {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column("varchar", { length: 255 })
  name: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price: string;

  @Column("varchar", {  nullable: true, length: 255 })
  introduction: string | null;

  @Column("int", { unsigned: true })
  categoryId: number;

  @Column("text", { nullable: true })
  description: string | null;

  @ManyToOne(() => Category, (category) => category.artistServices, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ referencedColumnName: "id" }])
  category: Category;

  @OneToMany(
    () => ArtistServiceImage,
    (artistServiceImage) => artistServiceImage.artistService
  )
  artistServiceImages: ArtistServiceImage[];

  @OneToMany(
    () => ArtistServiceSubCategory,
    (artistServiceSubCategory) => artistServiceSubCategory.artistService
  )
  artistServiceSubCategories: ArtistServiceSubCategory[];
}
