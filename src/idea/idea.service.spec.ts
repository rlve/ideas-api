import { Test, TestingModule } from '@nestjs/testing';
import { IdeaService } from './idea.service';
import { getRepositoryToken } from '@nestjs/typeorm';
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

describe('IdeaService', () => {
  let service: IdeaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IdeaService,
        {
          provide: getRepositoryToken(IdeaEntity),
          useClass: MockRepository,
        },
      ],
    }).compile();

    service = module.get<IdeaService>(IdeaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
