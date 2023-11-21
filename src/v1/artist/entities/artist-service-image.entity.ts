import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ArtistService } from "./artist-service.entity";

@Index("artist_service_id", ["artistServiceId"], {})
@Entity("artist_service_image", { schema: "beautygo_dev" })
export class ArtistServiceImage {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column("varchar", { length: 255 })
  image: string;

  @Column("int", { unsigned: true })
  artistServiceId: number;

  @ManyToOne(
    () => ArtistService,
    (artistService) => artistService.artistServiceImages,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ referencedColumnName: "id" }])
  artistService: ArtistService;
}
