import { TestBed } from '@angular/core/testing';

import { EaidService } from './eaid.service';

describe.skip('EaidService', () => {
  let service: EaidService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EaidService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
