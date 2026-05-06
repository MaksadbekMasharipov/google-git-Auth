import { Article } from "src/module/article/entities/article.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "article_images"})
export class ArticleImage extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: "varchar", length: 500})
    url!: string;

    @Column({ type: "int" })
    sortorder!: number;

    // relations
    @ManyToOne(() => Article, (article) => article.images)
    article!: Article;
}