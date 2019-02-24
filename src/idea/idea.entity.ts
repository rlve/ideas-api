import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { IdeaRO } from './idea.ro';

@Entity('idea')
export class IdeaEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @CreateDateColumn() created: Date;

  @UpdateDateColumn() updated: Date;

  @Column('text') idea: string;
  @Column('text') description: string;

  @ManyToOne(type => UserEntity, author => author.ideas)
  author: UserEntity;

  toResponseObject(): IdeaRO {
    return {
      ...this,
      author: this.author && this.author.toResponseObject(false),
    };
  }
}
