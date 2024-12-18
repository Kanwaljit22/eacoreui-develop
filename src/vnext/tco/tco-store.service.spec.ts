import { TestBed } from '@angular/core/testing';

import { TcoStoreService } from './tco-store.service';

describe.skip('TcoStoreService', () => {
  let service: TcoStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TcoStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
