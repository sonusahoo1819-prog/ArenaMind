import { Test, TestingModule } from '@nestjs/testing';
import { NavigationService } from './navigation.service';
import { PrismaService } from '../prisma/prisma.service';

describe('NavigationService', () => {
  let service: NavigationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NavigationService,
        {
          provide: PrismaService,
          useValue: {
            navigationRoute: {
              findFirst: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<NavigationService>(NavigationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
