import { Test, TestingModule } from '@nestjs/testing';
import { IdeaController } from './idea.controller';
import { IdeaService } from './idea.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { IdeaEntity } from './idea.entity';

const createMock = jest.fn((dto: any) => {
  return dto;
});

const saveMock = jest.fn((dto: any) => {
  return dto;
});

const MockRepository = jest.fn().mockImplementation(() => {
  return {
    create: createMock,
    save: saveMock,
  };
});

describe('Idea Controller', () => {
  let controller: IdeaController;
  let service: IdeaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IdeaController],
      providers: [IdeaService,
        {
          provide: getRepositoryToken(IdeaEntity),
          useClass: MockRepository,
        },
      ],
    }).compile();

    service = module.get<IdeaService>(IdeaService);
    controller = module.get<IdeaController>(IdeaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
