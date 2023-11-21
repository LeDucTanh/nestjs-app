import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ArtistService } from "./artist-service.entity";

@Entity("category", { schema: "beautygo_dev" })
export class Category {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column("varchar", { nullable: true, length: 255 })
  name: string | null;

  @OneToMany(() => ArtistService, (artistService) => artistService.category)
  artistServices: ArtistService[];
}
