import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { EaidStoreService } from './eaid-store.service';

describe('EaidStoreService', () => {
  let service: EaidStoreService;
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([
     
    ])],
    providers: [EaidStoreService]
  }));
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EaidStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
