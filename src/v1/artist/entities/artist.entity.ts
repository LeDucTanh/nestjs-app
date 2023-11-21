import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ArtistAddress } from "./artist-address.entity";
import { ArtistTime } from "./artist-time.entity";
import { Certificate } from "./certificate.entity";
import { WithTimestamp } from "src/utils/app-base.entity";
import { ProviderType } from '../../user/entities/user.entity';
import { Day } from "./day.entity";

export enum ArtistLevel {
  Level1 = '1단계',
  Level2 = '2단계',
  Level3 = '3단계',
}

export enum ArtistStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Request = 'REQUEST',
  Reject = 'REJECT'
}

@Entity("artist", { schema: "beautygo_dev" })
export class Artist extends WithTimestamp {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column("varchar", { length: 255 })
  idLogin: string;

  @Column("varchar", { length: 255 })
  password: string;

  @Column("varchar", { length: 255 })
  username: string;

  @Column("date", { nullable: true })
  birthDate: string | null;

  @Column("varchar", { nullable: true, length: 255 })
  phone: string | null;

  @Column("varchar", { nullable: true, length: 255 })
  email: string | null;

  @Column("varchar", { nullable: true, length: 100 })
  sns: string | null;

  @Column("varchar", { nullable: true, length: 255 })
  avatar: string | null;

  @Column("varchar", { nullable: true, length: 255 })
  shopName: string | null;

  @Column({ type: 'enum', enum: ArtistStatus, default: ArtistStatus.Request })
  status: ArtistStatus;

  @Column({
    type: 'enum',
    enum: ProviderType,
    default: ProviderType.Email,
  })
  providerType: ProviderType;

  @Column("float", { nullable: true, precision: 12 })
  lat: number | null;

  @Column("float", { nullable: true, precision: 12 })
  long: number | null;

  @Column({ type: 'enum', enum: ArtistLevel, default: ArtistLevel.Level1 })
  level: ArtistLevel;

  @Column("text", {nullable: true })
  instagram: string | null;

  @Column("text", { nullable: true })
  career: string | null;

  @Column("varchar", { nullable: true, length: 255 })
  introduction: string | null;

  @Column("tinyint", {
    nullable: true,
    width: 1,
    default: () => "'0'",
  })
  recommend: boolean | null;

  @OneToMany(() => ArtistAddress, (artistAddress) => artistAddress.artist)
  artistAddresses: ArtistAddress[];

  @ManyToMany(() => Day, (day) => day.artists, {
  })
  @JoinTable({
    name: 'artist_day',
  })
  days: Day[];

  @OneToMany(() => ArtistTime, (artistTime) => artistTime.artist)
  artistTimes: ArtistTime[];

  @OneToMany(() => Certificate, (certificate) => certificate.artist)
  certificates: Certificate[];
}

