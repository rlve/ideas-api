import { UserRO } from 'src/user/user.ro';
import { IdeaRO } from 'src/idea/idea.ro';

export class CommentRO {
  id?: string;
  created: Date;
  updated: Date;
  content: string;
  author: UserRO;
  idea: IdeaRO;
}
