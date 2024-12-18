import {  TestBed, waitForAsync } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { EventEmitter } from "@angular/core";
import { Subject } from "rxjs";
import { AppDataService } from "@app/shared/services/app.data.service";
import { DashboardService } from "./dashboard.service";


describe('DashboardService', () => {
  let service: DashboardService;
  let httpTestingController: HttpTestingController;
  const url = "https://localhost:4200/";


  class MockAppDataService{
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
        DashboardService,
        { provide: AppDataService, useClass:MockAppDataService }

      ],
      imports: [HttpClientTestingModule],

    })
      .compileComponents();
    service = TestBed.inject(DashboardService);
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  it('should call getProposalData', (done) => {
    const response = {
        status: "Success"
      };

      service.getProposalData(false).subscribe({
        next:(res:any) => {
            done();
            expect(res.status).toBe("Success")
        }
      })
      const methodName = 'shared-with-me';
      const url1 =  url + "api/dashboard/user/proposals/" + methodName ;
      const req = httpTestingController.expectOne(url1);
      expect(req.request.method).toBe('GET')
      req.flush(response);
  });


  it('should call getQualData', (done) => {
    const response = {
        status: "Success"
      };

      service.getQualData(false).subscribe({
        next:(res:any) => {
            done();
            expect(res.status).toBe("Success")
        }
      })
      const methodName = 'shared-with-me';
      const url1 =  url + "api/dashboard/user/qualifications/" + methodName ;
      const req = httpTestingController.expectOne(url1);
      expect(req.request.method).toBe('GET')
      req.flush(response);
  });

  it('should call getProspectsData', (done) => {
    const response = {
        status: "Success"
      };

      const viewType = 'GLOBAL'
      service.getProspectsData(viewType).subscribe({
        next:(res:any) => {
            done();
            expect(res.status).toBe("Success")
        }
      })
      const url1 =  url + "api/dashboard/user/prospects?viewtype=" + viewType ;
      const req = httpTestingController.expectOne(url1);
      expect(req.request.method).toBe('GET')
      req.flush(response);
  });

  it('should call getFavorites', (done) => {
    const response = {
        status: "Success"
      };


      service.getFavorites().subscribe({
        next:(res:any) => {
            done();
            expect(res.status).toBe("Success")
        }
      })
      const url1 =  url + "api/dashboard/user/favorites"  ;
      const req = httpTestingController.expectOne(url1);
      expect(req.request.method).toBe('GET')
      req.flush(response);
  });

  it('should call getApprovalPendingProposalCount', (done) => {
    const response = {
        status: "Success"
      };


      service.getApprovalPendingProposalCount().subscribe({
        next:(res:any) => {
            done();
            expect(res.status).toBe("Success")
        }
      })
      const url1 =  url + "api/dashboard/user/approvalPendingProposalCount"  ;
      const req = httpTestingController.expectOne(url1);
      expect(req.request.method).toBe('GET')
      req.flush(response);
  });

  it('should call getViewProposalForQual', (done) => {
    const response = {
        status: "Success"
      };


      service.getViewProposalForQual({id:"1"}).subscribe({
        next:(res:any) => {
            done();
            expect(res.status).toBe("Success")
        }
      })
      const url1 =  url + "api/proposal/users/qual?q=1"  ;
      const req = httpTestingController.expectOne(url1);
      expect(req.request.method).toBe('GET')
      req.flush(response);
  });

  it('should call getDealData', (done) => {
    const response = {
        status: "Success"
      };


      service.getDealData(false, true, 10,10,'').subscribe({
        next:(res:any) => {
            done();
            expect(res.status).toBe("Success")
        }
      })
      const url1 =  url + "api/partner/myDealsService?createdByMe=true"  ;
      const req = httpTestingController.expectOne(url1);
      expect(req.request.method).toBe('POST')
      req.flush(response);
  });


});