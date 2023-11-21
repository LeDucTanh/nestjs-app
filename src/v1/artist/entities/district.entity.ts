import {Column,Entity,JoinColumn,OneToMany,OneToOne,PrimaryGeneratedColumn} from "typeorm";
import {ArtistAddress} from './artist-address.entity'
import {City} from './city.entity'


@Entity("district" ,{schema:"beautygo_dev" } )
export  class District {

  @PrimaryGeneratedColumn({ type:"int", unsigned:true })
  id:number;

  @Column("varchar",{ nullable:true,length:255 })
  name:string | null;

  
  @OneToMany(()=>ArtistAddress,artistAddress=>artistAddress.district)


  artistAddresses:ArtistAddress[];

  @OneToOne(()=>City,city=>city.district,{ onDelete:"CASCADE",onUpdate:"CASCADE" })
  @JoinColumn([{ referencedColumnName: "id",  },
  ])
  city:City;

}
