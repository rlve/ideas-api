import { IdeaRO } from 'src/idea/idea.ro';
import { CommentRO } from 'src/comment/comment.ro';

export class UserRO {
  id: string;
  created: Date;
  username: string;
  token?: string;
  ideas?: IdeaRO[] | number;
  bookmarks?: IdeaRO[] | number;
  comments?: CommentRO[] | number;
}
