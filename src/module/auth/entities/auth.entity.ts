
import { BaseEntity } from 'src/database/entities/base.entity';
import { Article } from 'src/module/article/entities/article.entity';
import { Tag } from 'src/module/tag/entities/tag.entity';
import { RolesUser } from 'src/shared/enums/roles.enum';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';


@Entity({name: 'auth'})
export class Auth extends BaseEntity{

  @Column()
  username!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({type: "enum", enum: RolesUser, default: RolesUser.USER})
  role!: RolesUser;

  @Column()
  otp!: string;

  @Column({type: 'bigint'})
  otpTime!: number;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  profilePicture?: string;

  @Column({ nullable: true })
  accessToken?: string;

  // relations
  @OneToMany(() => Article, (article) => article.author,)
  articles!: Article[]

  @OneToMany(() => Tag, (tag) => tag.createdBy, { nullable: false })
  @JoinColumn({name: "tag_id"})
  tags!: Tag[]
}