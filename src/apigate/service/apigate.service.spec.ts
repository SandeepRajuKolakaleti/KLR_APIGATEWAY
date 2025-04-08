import { Test, TestingModule } from '@nestjs/testing';
import { ApigateService } from './apigate.service';

describe('ApigateService', () => {
  let service: ApigateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApigateService],
    }).compile();

    service = module.get<ApigateService>(ApigateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
