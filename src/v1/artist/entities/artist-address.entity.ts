import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { City } from "./city.entity";
import { District } from "./district.entity";
import { Artist } from "./artist.entity";

@Index("city_id", ["cityId"], {})
@Index("district_id", ["districtId"], {})
@Index("user_id", ["artistId"], {})
@Entity("artist_address", { schema: "beautygo_dev" })
export class ArtistAddress {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("int", { nullable: true, unsigned: true })
  cityId: number | null;

  @Column("int", { nullable: true, unsigned: true })
  districtId: number | null;

  @Column("int")
  artistId: number ;

  @ManyToOne(() => City, (city) => city.artistAddresses, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ referencedColumnName: "id" }])
  city: City;

  @ManyToOne(() => District, (district) => district.artistAddresses, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ referencedColumnName: "id" }])
  district: District;

  @ManyToOne(() => Artist, (artist) => artist.artistAddresses, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ referencedColumnName: "id" }])
  artist: Artist;
}
