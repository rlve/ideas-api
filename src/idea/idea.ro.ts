import { UserRO } from 'src/user/user.ro';

export class IdeaRO {
  id?: string;
  created: Date;
  updated: Date;
  idea: string;
  description: string;
  author: UserRO;
}
