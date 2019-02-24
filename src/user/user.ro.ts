import { IdeaRO } from 'src/idea/idea.ro';

export class UserRO {
  id: string;
  created: Date;
  username: string;
  token?: string;
  ideas?: IdeaRO[];
}
