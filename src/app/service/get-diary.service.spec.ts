import { TestBed } from '@angular/core/testing';

import { GetDiaryService } from './get-diary.service';

describe('GetDiaryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetDiaryService = TestBed.get(GetDiaryService);
    expect(service).toBeTruthy();
  });
});
