import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  Column,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { IdeaEntity } from 'src/idea/idea.entity';
import { CommentRO } from './comment.ro';

@Entity('comment')
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @CreateDateColumn() created: Date;
  @UpdateDateColumn() updated: Date;

  @Column('text') content: string;

  @ManyToOne(type => UserEntity, author => author.comments)
  author: UserEntity;

  @ManyToOne(type => IdeaEntity, idea => idea.comments)
  idea: IdeaEntity;

  toResponseObject(): CommentRO {
    return {
      ...this,
      author: this.author && this.author.toResponseObject(false),
      idea: this.idea && this.idea.toResponseObject(),
    };
  }
}
