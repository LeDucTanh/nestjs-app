import { instanceToPlain } from 'class-transformer';
import { WithTimestamp } from 'src/utils/app-base.entity';
import { Column, Entity, Index } from 'typeorm';

export enum FileStatus {
  Inactivate = 'INACTIVATE',
  Active = 'ACTIVE',
  Deleted = 'DELETED',
}

@Entity()
export class FileUpload extends WithTimestamp {
  @Index()
  @Column({
    type: 'enum',
    enum: FileStatus,
    default: FileStatus.Inactivate,
  })
  status: FileStatus;

  @Column('text', { nullable: true })
  url: string;

  @Column('text', { nullable: true })
  key: string;

  @Column('text', { nullable: true })
  path: string;

  @Column('text', { name: 'file_type', nullable: true })
  fileType: string;

  @Column('int', { name: 'user_id', nullable: true })
  userId: number;

  toJSON() {
    const result = instanceToPlain(this);
    delete result.key;
    delete result.path;
    delete result.fileType;
    delete result.userId;
    return result;
  }
}
