import {Column,Entity,Index,JoinColumn,ManyToOne,OneToOne,PrimaryGeneratedColumn} from "typeorm";
import {Time} from './time.entity'
import {Artist} from './artist.entity'


@Index("user_id",["artistId",],{  })
@Entity("artist_time" ,{schema:"beautygo_dev" } )
export  class ArtistTime {

  @PrimaryGeneratedColumn({ type:"int", unsigned:true })
  id:number;

  @Column("int")
  artistId:number;

  @Column("int",{ nullable:true,unsigned:true })
  timeId:number | null;

  @OneToOne(()=>Time,time=>time.artistTime,{ onDelete:"CASCADE",onUpdate:"CASCADE" })
  @JoinColumn([{ referencedColumnName: "id" },
  ])
  time:Time;

  @ManyToOne(()=>Artist,artist=>artist.artistTimes,{ onDelete:"CASCADE",onUpdate:"CASCADE" })
  @JoinColumn([{ referencedColumnName: "id" },
  ])
  artist:Artist;

}
