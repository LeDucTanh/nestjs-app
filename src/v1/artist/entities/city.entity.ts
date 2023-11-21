import {Column,Entity,OneToMany,OneToOne,PrimaryGeneratedColumn} from "typeorm";
import {ArtistAddress} from './artist-address.entity'
import {District} from './district.entity'


@Entity("city" ,{schema:"beautygo_dev" } )
export  class City {

  @PrimaryGeneratedColumn({ type:"int", unsigned:true })
  id:number;

  @Column("varchar",{ nullable:true,length:255 })
  name:string | null;

  @OneToMany(()=>ArtistAddress,artistAddress=>artistAddress.city)
  artistAddresses:ArtistAddress[];

  @OneToOne(()=>District,district=>district.city)
  district:District;

}
