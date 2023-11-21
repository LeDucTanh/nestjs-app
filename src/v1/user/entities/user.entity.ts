import { WithTimestamp } from 'src/utils/app-base.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  Unique,
} from 'typeorm';
import { genSaltSync, hashSync } from 'bcrypt';
import { FileUpload } from 'src/v1/files/entities/file-upload.entity';
import { MakeupStyle } from './makeup-style.entity';
import { HairStyle } from './hair-style.entity';
import { MakeupType } from './makeup-type.entity';
import { PersonalColor } from './personal-color.entity';

export enum UserRole {
  User = 'USER',
  Admin = 'ADMIN',
  SuperAdmin = 'SUPER_ADMIN',
  Any = 'ANY',
}

export enum UserStatus {
  Active = 'ACTIVE',
  Deactivated = 'DEACTIVATED',
  Removed = 'REMOVED',
}

export enum ProviderType {
  Email = 'EMAIL',
  Google = 'GOOGLE',
  Apple = 'APPLE',
  Kakao = 'KAKAO',
  Naver = 'NAVER',
}
@Entity('user')
export class User extends WithTimestamp {
  @Index()
  @Column({
    type: 'enum',
    enum: [UserRole.User, UserRole.Admin, UserRole.SuperAdmin],
    default: UserRole.User,
  })
  role: UserRole;

  @Index()
  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.Active })
  status: UserStatus;

  @Index()
  @Column({
    type: 'enum',
    enum: ProviderType,
    default: ProviderType.Email,
  })
  providerType: ProviderType;

  @Index()
  @Column('varchar', { length: 255, nullable: true })
  idLogin: string;

  @Column('text', { nullable: true })
  username: string;

  @Column('varchar', { length: 255, nullable: true })
  password: string;

  @Column('varchar', { length: 65, nullable: true })
  phoneNumber: string;

  @Column('varchar', { nullable: true, length: 255 })
  email: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  birthDate: Date;

  @Column('text', { nullable: true })
  socialId: string;

  @Column('float', { nullable: true })
  lat: number;

  @Column('float', { nullable: true })
  long: number;

  @OneToOne(() => FileUpload, {
    nullable: true,
  })
  @JoinColumn()
  avatar: FileUpload;

  @Column('int', { nullable: true })
  avatarId: number;

  @ManyToOne(() => MakeupStyle, (makeupStyle) => makeupStyle.users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  makeupStyle: MakeupStyle;

  @Column('int', { nullable: true })
  makeupStyleId: number;

  @ManyToOne(() => MakeupType, (_) => _.users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  makeupType: MakeupType;

  @Column('int', { nullable: true })
  makeupTypeId: number;

  @ManyToOne(() => HairStyle, (_) => _.users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  hairStyle: HairStyle;

  @Column('int', { nullable: true })
  hairStyleId: number;

  @ManyToOne(() => PersonalColor, (_) => _.users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  personalColor: PersonalColor;

  @Column('int', { nullable: true })
  personalColorId: number;

  @BeforeInsert()
  hashPassword(): void {
    const self = this;
    if (self.password) {
      const salt = genSaltSync(10);
      self.password = hashSync(self.password, salt);
    }
  }
}
