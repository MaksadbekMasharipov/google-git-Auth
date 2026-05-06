import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './module/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './module/auth/entities/auth.entity';
import { ArticleModule } from './module/article/article.module';
import { Article } from './module/article/entities/article.entity';
import { ArticleImage } from './module/article-image/entities/article-image.entity';
import { Tag } from './module/tag/entities/tag.entity';
import { TagModule } from './module/tag/tag.module';


@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      database: String(process.env.DB_NAME as string),
      password: String(process.env.DB_PASSWORD as string),
      entities: [Auth, Article, ArticleImage, Tag],
      synchronize: true,
      logging: false
    }),
    AuthModule,
    ArticleModule,
    TagModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
