import { Module } from '@nestjs/common';
import { ArticleImageService } from './article-image.service';
import { ArticleImageController } from './article-image.controller';

@Module({
  controllers: [ArticleImageController],
  providers: [ArticleImageService],
})
export class ArticleImageModule {}
