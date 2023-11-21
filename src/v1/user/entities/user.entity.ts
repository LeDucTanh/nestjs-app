import { WithTimestamp } from 'src/utils/app-base.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { genSaltSync, hashSync } from 'bcrypt';
import { FileUpload } from 'src/v1/files/entities/file-upload.entity';

export enum UserRole {
  User = 'USER',
  Admin = 'ADMIN',
  SuperAdmin = 'SUPER_ADMIN',
  Any = 'ANY',
}

export enum UserStatus {
  Active = 'ACTIVE',
  Deactivated = 'DEACTIVATED',
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

  @Column('varchar', { length: 65, nullable: true })
  username: string;

  @Column('varchar', { length: 255, nullable: true })
  password: string;

  @Column('varchar', { length: 65, nullable: true })
  phoneNumber: string;

  @Column('varchar', { nullable: true, length: 255 })
  email: string;

  @OneToOne(() => FileUpload, {
    nullable: true,
  })
  @JoinColumn()
  avatar: FileUpload;

  @Column('int', { nullable: true })
  avatarId: number;

  @BeforeInsert()
  hashPassword(): void {
    const self = this;
    if (self.password) {
      const salt = genSaltSync(10);
      self.password = hashSync(self.password, salt);
    }
  }
}
