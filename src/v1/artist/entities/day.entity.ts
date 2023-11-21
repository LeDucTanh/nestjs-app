import {Column,Entity,ManyToMany,OneToOne,PrimaryGeneratedColumn} from "typeorm";
import { ArtistAddress } from "./artist-address.entity";
import { Artist } from "./artist.entity";


@Entity("day" ,{schema:"beautygo_dev" } )
export  class Day {

  @PrimaryGeneratedColumn({ type:"int", unsigned:true })
  id:number;

  @Column("varchar",{ nullable:true,length:50 })
  name:string | null;

  @ManyToMany(() => Artist, (artist) => artist.days)
  artists: Artist[];

}
