import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SearchLocateService } from './search-locate.service';

describe('SearchLocateService', () => {
  let service: SearchLocateService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SearchLocateService]
    });
    service = TestBed.inject(SearchLocateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch search data', () => {
    const dummyData = { key: 'value' };

    service.getSearchData().subscribe(data => {
      expect(data).toEqual(dummyData);
    });

    const req = httpMock.expectOne('assets/data/searchLocate.json');
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);
  });

  it('should fetch search contract data', () => {
    const dummyData = { key: 'value' };

    service.getSearchContractData().subscribe(data => {
      expect(data).toEqual(dummyData);
    });

    const req = httpMock.expectOne('assets/data/Ib-summary/searchContract.json');
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);
  });

  it('should fetch search serial data', () => {
    const dummyData = { key: 'value' };

    service.getSearchSerialData().subscribe(data => {
      expect(data).toEqual(dummyData);
    });

    const req = httpMock.expectOne('assets/data/Ib-summary/searchSerial.json');
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);
  });

  it('should fetch search install data', () => {
    const dummyData = { key: 'value' };

    service.getSearchInstallData().subscribe(data => {
      expect(data).toEqual(dummyData);
    });

    const req = httpMock.expectOne('assets/data/Ib-summary/searchInstall.json');
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);
  });
});
