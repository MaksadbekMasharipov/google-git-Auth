import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseInterceptors, UploadedFile, UseGuards, Req } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiInternalServerErrorResponse, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { ArticleResponseDto } from './dto/article-respone.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from "multer"
import path from "path"
import { CreateArticleFileDto } from './dto/create-file.dto';
import { AuthGuard } from 'src/common/guards/auth-guards';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { RolesUser } from 'src/shared/enums/roles.enum';

@ApiBearerAuth("JWT-Auth")
@ApiInternalServerErrorResponse({ description: "internal server error" })
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  // Post
  @UseGuards(AuthGuard, RolesGuard) // token tekshiradi
  @Roles(RolesUser.ADMIN, RolesUser.SUPER_ADMIN) // role tekshiradi
  @ApiResponse({status: 201, description: "Created"})
  @ApiBody({ type: CreateArticleFileDto })
  @ApiConsumes("multipart/form-data")
  @Post()
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
          destination: path.join(process.cwd(), "uploads"),
          filename: (req, file, cb) => {
            const uniqueSuffix = `${file.originalname}${Date.now()}` // asosiy nomni olib, unique atadi
            const ext = path.extname(file.originalname)  // nuqtadan keyingi so'zlarni oladi - .mp4, .png
            cb(null, `${uniqueSuffix}${ext}`)
          }
      })
    })
  )
  create(@Body() createArticleDto: CreateArticleDto, @UploadedFile() file: Express.Multer.File, @Req() req) {
    return this.articleService.create(createArticleDto, file, req.user.id);
  }


  // Get all
  @ApiOkResponse({
    description: "list of articles",
    type: [ArticleResponseDto]
  })
  @HttpCode(200)
  @Get()
  findAll() {
    return this.articleService.findAll();
  }

  
  // Get one
  @ApiOkResponse({
    description: "Article:",
    type: [ArticleResponseDto]
  })
  @ApiBadRequestResponse({ description: "Article not found"})
  @HttpCode(200)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(+id);
  }


  // Update
  @UseGuards(AuthGuard, RolesGuard) // token tekshiradi
  @Roles(RolesUser.ADMIN, RolesUser.SUPER_ADMIN) // role tekshiradi
  @ApiOkResponse({ description: "updated" })
  @ApiBadRequestResponse({ description: "Article not found"})
  @ApiBody({ type: CreateArticleDto })
  @HttpCode(200)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(+id, updateArticleDto);
  }


  // delete
  @UseGuards(AuthGuard, RolesGuard) // token tekshiradi
  @Roles(RolesUser.ADMIN, RolesUser.SUPER_ADMIN) // role tekshiradi
  @ApiOkResponse({ description: "deleted" })
  @ApiBadRequestResponse({ description: "Article not found"})
  @HttpCode(200)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(+id);
  }
}
