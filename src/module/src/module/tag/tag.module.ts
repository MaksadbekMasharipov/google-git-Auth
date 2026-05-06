import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { Type } from 'class-transformer';
import { Tag } from './entities/tag.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tag]), // Ma'nosi: Tag entity'sini TypeOrmModule'ga qo'shish
    AuthModule // Ma'nosi: AuthModule'ni import qilish, chunki TagController va TagService'da AuthModule'dagi xizmatlardan foydalaniladi
  ],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
