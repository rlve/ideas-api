import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  BeforeInsert,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserRO } from './user.ro';
import { IdeaEntity } from 'src/idea/idea.entity';
import { CommentEntity } from 'src/comment/comment.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @Column({
    type: 'text',
    unique: true,
  })
  username: string;

  @Column('text')
  password: string;

  @OneToMany(type => IdeaEntity, idea => idea.author)
  ideas: IdeaEntity[];

  @OneToMany(type => CommentEntity, comment => comment.author)
  comments: CommentEntity[];

  @ManyToMany(type => IdeaEntity, { cascade: true })
  @JoinTable()
  bookmarks: IdeaEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  toResponseObject({
    showToken = false,
    fullComments = false,
    fullIdeas = false,
    fullBookmarks = false,
  } = {}): UserRO {
    const { id, created, username, token, ideas, bookmarks, comments } = this;

    const getAmountOrValues = (condition: boolean, field: any) =>
      condition ? field.map(data => data.toResponseObject()) : field.length;

    return {
      id,
      created,
      username,
      token: showToken ? token : undefined,
      ideas: ideas && getAmountOrValues(fullIdeas, ideas),
      bookmarks: bookmarks && getAmountOrValues(fullBookmarks, bookmarks),
      comments: comments && getAmountOrValues(fullComments, comments),
    };
  }

  async comparePassword(attempt: string) {
    return bcrypt.compare(attempt, this.password);
  }

  private get token() {
    const { id, username } = this;
    return jwt.sign({ id, username }, process.env.SECRET, { expiresIn: '7d' });
  }
}
