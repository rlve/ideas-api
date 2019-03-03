import { UserRO } from 'src/user/user.ro';
import { CommentRO } from 'src/comment/comment.ro';

export class IdeaRO {
  id?: string;
  created: Date;
  updated: Date;
  idea: string;
  description: string;
  author: UserRO;
  upvotes?: number;
  downvotes?: number;
  comments?: CommentRO[];
}
