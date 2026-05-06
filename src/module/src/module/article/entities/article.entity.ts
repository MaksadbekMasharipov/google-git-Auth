import { Delete } from '@nestjs/common';
import { BaseEntity } from 'src/database/entities/base.entity';
import { Auth } from 'src/module/auth/entities/auth.entity';
import { Tag } from 'src/module/tag/entities/tag.entity';
import { Column, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

@Entity({ name: 'article' })
export class Article extends BaseEntity {
  @Column()
  title!: string;

  @Column()
  content!: string;

  @Column()
  backgroundImge!: string;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date 

  // relations
  @ManyToOne(() => Auth, (user) => user.articles )
  @JoinColumn({name: "user_id"})
  author!: Auth;

  @ManyToMany(() => Tag, (tag) => tag.articles, { nullable: false, cascade: false })
  @JoinTable({name: "tag_id" })
  tags!: Tag[];
}