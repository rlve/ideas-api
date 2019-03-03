import { IdeaRO } from 'src/idea/idea.ro';
import { CommentRO } from 'src/comment/comment.ro';

export class UserRO {
  id: string;
  created: Date;
  username: string;
  token?: string;
  ideas?: IdeaRO[];
  bookmarks?: IdeaRO[];
  comments?: CommentRO[];
}
