import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AddPartnerService } from './add-partner.service';

describe('AddPartnerService', () => {
  let service: AddPartnerService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AddPartnerService],
    });
    service = TestBed.inject(AddPartnerService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify(); // Verify that there are no outstanding requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return data from the API', () => {
    const testData = { key: 'value' }; // Replace this with your expected data

    // Make a mock HTTP request
    service.getData().subscribe((data) => {
      expect(data).toEqual(testData); // Assert that the returned data matches the expected data
    });

    const req = httpTestingController.expectOne('assets/data/proposal/addPartner.json'); // Verify that the correct URL is called
    expect(req.request.method).toEqual('GET'); // Verify that it's a GET request

    // Respond with mock data
    req.flush(testData);
  });

});
