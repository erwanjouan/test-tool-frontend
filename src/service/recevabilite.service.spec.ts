import { TestBed } from '@angular/core/testing';

import { RecevabiliteService } from './recevabilite.service';

describe('RecevabiliteService', () => {
  let service: RecevabiliteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecevabiliteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
