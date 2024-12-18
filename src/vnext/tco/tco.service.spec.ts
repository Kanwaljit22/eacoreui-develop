import { TestBed } from '@angular/core/testing';

import { TcoService } from './tco.service';

describe.skip('TcoService', () => {
  let service: TcoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TcoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
