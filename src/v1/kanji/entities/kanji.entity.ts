import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { WithTimestamp } from 'src/utils/app-base.entity';
import { ImageFile } from 'src/v1/image-file/entities/image-file.entity';

@Entity('kanji')
export class Kanji extends WithTimestamp {
  @Index('kanji_name_index')
  @Column('varchar', { length: 65, nullable: true })
  name: string;

  @Column('varchar', { length: 65, nullable: true })
  meaning: string;

  @Column('text', { nullable: true })
  text: string;

  @Column('int', { nullable: true })
  imageFileId: number;

  @ManyToOne(() => ImageFile, (_) => _.kanjiList, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  imageFile: ImageFile;
}
