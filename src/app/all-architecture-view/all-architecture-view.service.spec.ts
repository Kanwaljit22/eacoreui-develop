import {  TestBed, waitForAsync } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { AppDataService } from "@app/shared/services/app.data.service";
import { AllArchitectureViewService } from "./all-architecture-view.service";


describe('AllArchitectureViewService', () => {
  let service: AllArchitectureViewService;
  let httpTestingController: HttpTestingController;
  let appDataService;
  const url = "https://localhost:4200/";


  class MockAppDataService{
    customerID='123';
    customerName='test';
    isQualOrPropListFrom360Page=true;
   get getAppDomain(){
        return url;
      }
      userInfo ={
        userId:"123"
      }
  }
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        AllArchitectureViewService,
        { provide: AppDataService, useClass:MockAppDataService }

      ],
      imports: [HttpClientTestingModule],

    })
      .compileComponents();
    service = TestBed.inject(AllArchitectureViewService);
    appDataService = TestBed.inject(AppDataService)
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  

  it('should call getColDataConsumption', (done) => {
    const response = {
        status: "Success"
      };

      service.getColDataConsumption().subscribe({ 
        next:(res:any) => {
            done();
            expect(res.status).toBe("Success")
        }
      })
      const url1 =  "assets/data/agreements/consumptionMetaData.json" ;
      const req = httpTestingController.expectOne(url1);
      expect(req.request.method).toBe('GET')
      req.flush(response);
  });

  it('should call getColDataAgreements', (done) => {
    const response = {
        status: "Success"
      };

      service.getColDataAgreements().subscribe({ 
        next:(res:any) => {
            done();
            expect(res.status).toBe("Success")
        }
      })
      const url1 =  "assets/data/agreements/agreementsMetaData.json" ;
      const req = httpTestingController.expectOne(url1);
      expect(req.request.method).toBe('GET')
      req.flush(response);
  });

  it('should call getSmartAccountList', (done) => {
    const response = {
        status: "Success"
      };

      service.getSmartAccountList().subscribe({ 
        next:(res:any) => {
            done();
            expect(res.status).toBe("Success")
        }
      })
      const url1 = url +  "api/prospect/agreement/smartAccount?prospectKey=123" ;
      const req = httpTestingController.expectOne(url1);
      expect(req.request.method).toBe('GET')
      req.flush(response);
  });


  it('should call getAgreementsData', (done) => {
    const response = {
        status: "Success"
      };

      service.getAgreementsData('123').subscribe({ 
        next:(res:any) => {
            done();
            expect(res.status).toBe("Success")
        }
      })
      const url1 = url+ "api/prospect/agreement/accounts?type=virtual&x-csw-smart-account-id=123" ;
      const req = httpTestingController.expectOne(url1);
      expect(req.request.method).toBe('GET')
      req.flush(response);
  });

  it('should call getProposalListbyCustomer', (done) => {
    const response = {
        status: "Success"
      };

      service.getProposalListbyCustomer().subscribe({ 
        next:(res:any) => {
            done();
            expect(res.status).toBe("Success")
        }
      })
      appDataService.isQualOrPropListFrom360Page=false;
      service['appDataService'].isQualOrPropListFrom360Page=false;
      const url1 = url+ "api/proposal/list" ;
      const req = httpTestingController.expectOne(url1);
      expect(req.request.method).toBe('POST')
      req.flush(response);
  });

  it('should call getProposalListbyCustomer branch 1', (done) => {
    const response = {
        status: "Success"
      };

      service.getProposalListbyCustomer().subscribe({ 
        next:(res:any) => {
            done();
            expect(res.status).toBe("Success")
        }
      })
      const url1 = url+ "api/proposal/list" ;
      const req = httpTestingController.expectOne(url1);
      expect(req.request.method).toBe('POST')
      req.flush(response);
  });

  it('should call getSubHeaderData', (done) => {
    const response = {
        status: "Success"
      };

      service.getSubHeaderData().subscribe({ 
        next:(res:any) => {
            done();
            expect(res.status).toBe("Success")
        }
      })
      const url1 = url+ "api/prospect/prospect-details-header" ;
      const req = httpTestingController.expectOne(url1);
      expect(req.request.method).toBe('POST')
      req.flush(response);
  });


  it('should call getConsumptionData', (done) => {
    const response = {
        status: "Success"
      };

      service.getConsumptionData('123','123','123').subscribe({ 
        next:(res:any) => {
            done();
            expect(res.status).toBe("Success")
        }
      })
      const url1 = url+ "api/prospect/agreement/consumption?smartAccountID=123&virtualAccountID=123&subscriptionID=123" ;
      const req = httpTestingController.expectOne(url1);
      expect(req.request.method).toBe('GET')
      req.flush(response);
  });

  it('should call getConsumptionDataTrueFwd', (done) => {
    const response = {
        status: "Success"
      };

      service.getConsumptionDataTrueFwd('123','123').subscribe({ 
        next:(res:any) => {
            done();
            expect(res.status).toBe("Success")
        }
      })
      const url1 = url+ "api/prospect/agreement/true-forward?smartAccountID=123&virtualAccountID=123" ;
      const req = httpTestingController.expectOne(url1);
      expect(req.request.method).toBe('GET')
      req.flush(response);
  });


});