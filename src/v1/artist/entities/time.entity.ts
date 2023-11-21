import {Column,Entity,OneToOne,PrimaryGeneratedColumn} from "typeorm";
import {ArtistTime} from './artist-time.entity'


@Entity("time" ,{schema:"beautygo_dev" } )
export  class Time {

  @PrimaryGeneratedColumn({ type:"int", unsigned:true })
  id:number;

  @Column("time")
  time:string;

  @OneToOne(()=>ArtistTime,artistTime=>artistTime.time)
  artistTime:ArtistTime;

}
