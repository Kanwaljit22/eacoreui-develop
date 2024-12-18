import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DealListService } from './deal-list.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injector, Type } from '@angular/core';

describe('DealListService', () => {
  let dealListService: DealListService;
  let httpClientController:HttpTestingController;
  const url = "https://localhost:4200";

 class MockAppDataService{
  get getAppDomain(){
    return url;
  }
 }

  beforeEach((() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers:[DealListService,{provide: AppDataService , useClass:MockAppDataService}]
    })
    .compileComponents();

    httpClientController = TestBed.inject(HttpTestingController as Type<HttpTestingController>);
    dealListService = TestBed.inject(DealListService);
  }));

  
  it('should create', () => {
    expect(dealListService).toBeTruthy();
  });

  it('should call getColumnsData', (done) => {
    const response = {
      status: "Success"
    };
    const url = "assets/data/deal-list-columns.json";
    dealListService.getColumnsData().subscribe((res:any) => {
      done();
      expect(res.status).toBe("Success");
    })
    const req = httpClientController.expectOne(url);
    expect(req.request.method).toEqual("GET")
    req.flush(response);
  });

it('should call listQualification', (done) => {
  const dealData = {
    dealID:'123'
  };
  const response = {
    status: "Success"
  };
  const urlLocale =  url + 'api/qualification/list';
  dealListService.listQualification(dealData).subscribe((res:any) => {
    done();
    expect(res.status).toBe("Success"); 
  });
  const req = httpClientController.expectOne(urlLocale);
  expect(req.request.method).toEqual("POST")
  req.flush(response);
})
});
