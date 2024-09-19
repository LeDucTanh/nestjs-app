import { Entity, Column, Index, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { WithTimestamp } from 'src/utils/app-base.entity';
import { Kanji } from 'src/v1/kanji/entities/kanji.entity';

export enum ImageFileType {
  TAP_1 = 'TAP_1',
  TAP_2 = 'TAP_2',
}

@Entity()
export class ImageFile extends WithTimestamp {
  @Index('image_file_type_index')
  @Column({
    type: 'enum',
    enum: ImageFileType,
    default: ImageFileType.TAP_1,
  })
  type: ImageFileType;

  @Column()
  filename: string;

  @Column({ type: 'mediumblob' })
  @Exclude()
  data: Buffer;

  @Index('image_file_page_index')
  @Column({ type: 'integer' })
  page: number;

  @OneToMany(() => Kanji, (_) => _.imageFile)
  kanjiList: Kanji[];
}
