import { Logger } from '@nestjs/common';

export function LoggerExt(context: string) {
  const logger = new Logger(context);

  const logData = (options: any) => {
    const { data, idea, user, comment } = options;

    if (data) {
      logger.log(`DATA: ${JSON.stringify(data)}`);
    }
    if (idea) {
      logger.log(`IDEA: ${JSON.stringify(idea)}`);
    }
    if (user) {
      logger.log(`USER: ${JSON.stringify(user)}`);
    }
    if (comment) {
      logger.log(`COMMENT: ${JSON.stringify(comment)}`);
    }
  };

  return { logData };
}
