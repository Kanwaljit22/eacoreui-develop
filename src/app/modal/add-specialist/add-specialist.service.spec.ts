import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AddSpecialistService } from './add-specialist.service';

describe('AddSpecialistService', () => {
  let service: AddSpecialistService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AddSpecialistService],
    });
    service = TestBed.inject(AddSpecialistService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify(); // Verify that there are no outstanding requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return data from the API', () => {
    const testData = { key: 'value' }; 
   
    service.getData().subscribe((data) => {
      expect(data).toEqual(testData); 
    });

    const req = httpTestingController.expectOne('assets/data/qualification/specialist.json'); 
    expect(req.request.method).toEqual('GET'); // Verify that it's a GET request

    // Respond with mock data
    req.flush(testData);
  });

});
