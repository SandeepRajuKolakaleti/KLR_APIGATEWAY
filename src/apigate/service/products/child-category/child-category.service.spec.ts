import { Test, TestingModule } from '@nestjs/testing';
import { ChildCategoryService } from './child-category.service';

describe('ChildCategoryService', () => {
  let service: ChildCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChildCategoryService],
    }).compile();

    service = module.get<ChildCategoryService>(ChildCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
