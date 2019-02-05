import { Test, TestingModule } from '@nestjs/testing';
import { IdeaController } from './idea.controller';
import { IdeaService } from './idea.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeaEntity } from './idea.entity';

describe('Idea Controller', () => {
  let controller: IdeaController;
  let service: IdeaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IdeaController],
      providers: [IdeaService],
    }).compile();

    service = module.get<IdeaService>(IdeaService);
    controller = module.get<IdeaController>(IdeaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
