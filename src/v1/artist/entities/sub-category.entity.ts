import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ArtistServiceSubCategory } from "./artist-service-sub-category.entity";

@Entity("sub_category", { schema: "beautygo_dev" })
export class SubCategory {
  @PrimaryGeneratedColumn({
    type: "int",
    comment: "only category Make-up, Hair Make-up",
    unsigned: true,
  })
  id: number;

  @Column("varchar", {
    nullable: true,
    comment: "Multiple selections possible",
    length: 255,
  })
  name: string | null;

  @OneToMany(
    () => ArtistServiceSubCategory,
    (artistServiceSubCategory) => artistServiceSubCategory.subCategory
  )
  artistServiceSubCategories: ArtistServiceSubCategory[];
}
