import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ArtistService } from "./artist-service.entity";
import { SubCategory } from "./sub-category.entity";

@Index("artist_service_id", ["artistServiceId"], {})
@Index("sub_category_id", ["subCategoryId"], {})
@Entity("artist_service_sub_category", { schema: "beautygo_dev" })
export class ArtistServiceSubCategory {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column("int", { unsigned: true })
  artistServiceId: number;

  @Column("int", { unsigned: true })
  subCategoryId: number;

  @ManyToOne(
    () => ArtistService,
    (artistService) => artistService.artistServiceSubCategories,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ referencedColumnName: "id" }])
  artistService: ArtistService;

  @ManyToOne(
    () => SubCategory,
    (subCategory) => subCategory.artistServiceSubCategories,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ referencedColumnName: "id" }])
  subCategory: SubCategory;
}
