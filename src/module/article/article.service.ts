import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { Tag } from '../tag/entities/tag.entity';
import { QueryDto } from './dto/query.dto';



@Injectable()
// data base ulash
export class ArticleService {
  constructor(
    @InjectRepository(Article) private articleRepo: Repository<Article>,
    @InjectRepository(Tag) private tagRepo: Repository<Tag>
  ) {}


  // create
  async create(dto: CreateArticleDto, file: Express.Multer.File, userId){
    const foundedTags = await this.tagRepo.findBy({ id: In(dto.tags)});

    if (!foundedTags) throw new BadRequestException()

    const article = this.articleRepo.create({
      ...dto,
      author: userId,
      tags: foundedTags
    });

    article.backgroundImge = `http://localhost:4001/uploads/${file.filename}`
    return await this.articleRepo.save(article);
  }


  // get all
  async findAll(queryDto: QueryDto): Promise<{
    totalPage: number;
    prev: { page: number; limit: number } | undefined;
    next: { page: number; limit: number } | undefined;
    data: Article[];
  }> {
    const { page = 1, limit = 10, search } = queryDto;

    const queryBuilder = this.articleRepo.createQueryBuilder("article")
      .leftJoinAndSelect("article.tags", "tag")
      .where("article.deletedAt IS NULL")

    if (search) {
      queryBuilder.andWhere(
        "article.title ILIKE :search OR article.content ILIKE :search or tags.name ILIKE :search", 
        { search: `%${search}%` });
    }

    const result = await queryBuilder
      .orderBy("article.createdAt", "DESC")
      .skip((page - 1) * limit)
      .take(limit)
      .getMany()

    const total = await queryBuilder.getCount();

    return {
      totalPage: Math.ceil(total / limit),
      prev: page > 1 ? { page: page - 1, limit } : undefined,
      next: page < Math.ceil(total / limit) ? { page: page + 1, limit } : undefined,
      data: result,
    }
  }


  // find one
  async findOne(id: number): Promise<Article> {
    const article = await this.articleRepo.findOne({
      where: { id },
      relations: { tags: true, author: true }
    });

    if (!article) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }

    return article;
  }



  // update
  async update(id: number, dto: UpdateArticleDto): Promise<{message: string}> {
    const article = await this.articleRepo.findOne({ where: { id } });

    if (!article) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }

    Object.assign(article, dto);
    await this.articleRepo.save(article);

    return {message:"Updated"}
  }



  // delete
  async remove(id: number): Promise<{ message: string }> {
    const article = await this.findOne(id);

    if (!article) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }

    await this.articleRepo.softDelete({ id });

    return {
      message: `Article with id ${id} deleted successfully`,
    };
  }
}