import { Module } from '@nestjs/common';
import { ArtistSvc } from './artist.service';
import { ArtistController } from './artist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './entities/artist.entity';
import { ArtistAddress } from './entities/artist-address.entity';
import { ArtistServiceImage } from './entities/artist-service-image.entity';
import { ArtistServiceSubCategory } from './entities/artist-service-sub-category.entity';
import { ArtistTime } from './entities/artist-time.entity';
import { Category } from './entities/category.entity';
import { Certificate } from './entities/certificate.entity';
import { CertificateName } from './entities/certificate-name.entity';
import { CertificateCategory } from './entities/certificate-category.entity';
import { City } from './entities/city.entity';
import { Day } from './entities/day.entity';
import { District } from './entities/district.entity';
import { SubCategory } from './entities/sub-category.entity';
import { Time } from './entities/time.entity';
import { ArtistService } from './entities/artist-service.entity';
import { AdminArtistController } from './admin.artist.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Artist,
      ArtistAddress,
      ArtistService,
      ArtistServiceImage,
      ArtistServiceSubCategory,
      ArtistTime,
      Category,
      Certificate,
      CertificateName,
      CertificateCategory,
      City,
      Day,
      District,
      SubCategory,
      Time,
    ]),
  ],
  controllers: [ArtistController, AdminArtistController],
  providers: [ArtistSvc],
})
export class ArtistModule {}
