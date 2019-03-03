import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { IdeaRO } from './idea.ro';
import { CommentEntity } from 'src/comment/comment.entity';

@Entity('idea')
export class IdeaEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @CreateDateColumn() created: Date;

  @UpdateDateColumn() updated: Date;

  @Column('text') idea: string;
  @Column('text') description: string;

  @ManyToOne(type => UserEntity, author => author.ideas)
  author: UserEntity;

  @OneToMany(type => CommentEntity, comment => comment.idea)
  comments: CommentEntity[];

  @ManyToMany(type => UserEntity, { cascade: true })
  @JoinTable()
  upvotes: UserEntity[];

  @ManyToMany(type => UserEntity, { cascade: true })
  @JoinTable()
  downvotes: UserEntity[];

  toResponseObject(): IdeaRO {
    return {
      ...this,
      author: this.author && this.author.toResponseObject(false),
      upvotes: this.upvotes && this.upvotes.length,
      downvotes: this.downvotes && this.downvotes.length,
      comments: this.comments.map(comment => comment.toResponseObject()),
    };
  }
}
