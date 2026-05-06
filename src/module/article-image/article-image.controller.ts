import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ArticleImageService } from './article-image.service';
import { CreateArticleImageDto } from './dto/create-article-image.dto';
import { UpdateArticleImageDto } from './dto/update-article-image.dto';

@Controller('article-image')
export class ArticleImageController {
  constructor(private readonly articleImageService: ArticleImageService) {}

  @Post()
  create(@Body() createArticleImageDto: CreateArticleImageDto) {
    return this.articleImageService.create(createArticleImageDto);
  }

  @Get()
  findAll() {
    return this.articleImageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleImageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleImageDto: UpdateArticleImageDto) {
    return this.articleImageService.update(+id, updateArticleImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleImageService.remove(+id);
  }
}
