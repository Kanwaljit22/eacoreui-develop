import { TestBed, waitForAsync } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { HttpClient } from "@angular/common/http";
import { AppRestService } from "./app.rest.service";

describe("AppRestService", () => {
  let service: AppRestService;
  let httpTestingController: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        AppRestService,
        HttpClient
      ],
      imports: [HttpClientTestingModule],
    }).compileComponents();

    service = TestBed.inject(AppRestService);
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

    it("should call getUserDetails", (done) => {
      const response = {
        status: "Success",
      };

      const uri ='../api/home/user';
      service.getUserDetails().subscribe((response: any) => {
        expect(response.status).toBe("Success");
        done();
      });

      const req = httpTestingController.expectOne(uri);
      expect(req.request.method).toEqual("GET");
      req.flush(response);

    });

    it("should call getHeaderDetails", (done) => {
        const response = {
          status: "Success",
        };
  
        const uri ='test/api/prospect/prospectheader';
        service.getHeaderDetails('test','test').subscribe((response: any) => {
          expect(response.status).toBe("Success");
          done();
        });
  
        const req = httpTestingController.expectOne(uri);
        expect(req.request.method).toEqual("POST");
        req.flush(response);
  
      });

      it("should call getOauthToken", (done) => {
        const response = {
          status: "Success",
        };
  
        const uri ='test/api/oauth/token';
        service.getOauthToken('test/').subscribe((response: any) => {
          expect(response.status).toBe("Success");
          done();
        });
  
        const req = httpTestingController.expectOne(uri);
        expect(req.request.method).toEqual("GET");
        req.flush(response);
  
      });

      it("should call getGlobalMenuBarURL", (done) => {
        const response = {
          status: "Success",
        };
  
        const uri ='test/api/resource/GLOBAL_MENU_BAR_URL'
        service.getGlobalMenuBarURL('test/').subscribe((response: any) => {
          expect(response.status).toBe("Success");
          done();
        });
  
        const req = httpTestingController.expectOne(uri);
        expect(req.request.method).toEqual("GET");
        req.flush(response);
  
      });

      it("should call showOrHideChangeSubscription", (done) => {
        const response = {
          status: "Success",
        };
  
        const uri ='test/api/resource/SHOW_CHANGE_SUBSCRIPTION'
        service.showOrHideChangeSubscription('test/').subscribe((response: any) => {
          expect(response.status).toBe("Success");
          done();
        });
  
        const req = httpTestingController.expectOne(uri);
        expect(req.request.method).toEqual("GET");
        req.flush(response);
      });

      it("should call enableLimitedModeSmartSubs", (done) => {
        const response = {
          status: "Success",
        };
  
        const uri ='test/api/resource/ENABLE_LIMITED_MODE_SMART_SUBSIDIARY';
        service.enableLimitedModeSmartSubs('test/').subscribe((response: any) => {
          expect(response.status).toBe("Success");
          done();
        });
  
        const req = httpTestingController.expectOne(uri);
        expect(req.request.method).toEqual("GET");
        req.flush(response);
      });

      it("should call checkLimitedModeForChangeSubscription", (done) => {
        const response = {
          status: "Success",
        };
  
        const uri ='test/api/resource/ENABLE_LIMITED_MODE_CHANGE_SUBSCRIPTION';
        service.checkLimitedModeForChangeSubscription('test/').subscribe((response: any) => {
          expect(response.status).toBe("Success");
          done();
        });
  
        const req = httpTestingController.expectOne(uri);
        expect(req.request.method).toEqual("GET");
        req.flush(response);
      });

      it("should call displayRenewal", (done) => {
        const response = {
          status: "Success",
        };
  
        const uri ='test/api/resource/SHOW_RENEWAL_OPTION';
        service.displayRenewal('test/').subscribe((response: any) => {
          expect(response.status).toBe("Success");
          done();
        });
  
        const req = httpTestingController.expectOne(uri);
        expect(req.request.method).toEqual("GET");
        req.flush(response);
      });

      it("should call limitedModeFollowOn", (done) => {
        const response = {
          status: "Success",
        };
  
        const uri ='test/api/resource/ENABLE_LIMITED_MODE_FOLLOWON';
        service.limitedModeFollowOn('test/').subscribe((response: any) => {
          expect(response.status).toBe("Success");
          done();
        });
  
        const req = httpTestingController.expectOne(uri);
        expect(req.request.method).toEqual("GET");
        req.flush(response);
      });

      
      it("should call getSubscriptionList", (done) => {
        const response = {
          status: "Success",
        };
  
        const uri ='test/api/subscriptions?cid=123';
        service.getSubscriptionList('test/','123', false).subscribe((response: any) => {
          expect(response.status).toBe("Success");
          done();
        });
  
        const req = httpTestingController.expectOne(uri);
        expect(req.request.method).toEqual("GET");
        req.flush(response);
      });

      it("should call getSubscriptionList b1", (done) => {
        const response = {
          status: "Success",
        };
  
        const uri ='test/api/subscriptions?cid=123&type=RENEWAL&qid=123';
        service.getSubscriptionList('test/','123', true,'123').subscribe((response: any) => {
          expect(response.status).toBe("Success");
          done();
        });
  
        const req = httpTestingController.expectOne(uri);
        expect(req.request.method).toEqual("GET");
        req.flush(response);
      });

      it("should call displayMenuBar", (done) => {
        const response = {
          status: "Success",
        };
  
        const uri ='test/api/resource/SHOW_GLOBAL_MENU_BAR';
        service.displayMenuBar('test/').subscribe((response: any) => {
          expect(response.status).toBe("Success");
          done();
        });
  
        const req = httpTestingController.expectOne(uri);
        expect(req.request.method).toEqual("GET");
        req.flush(response);
      });

      it("should call getUserRoleDetails", (done) => {
        const response = {
          status: "Success",
        };
  
        const uri ='../api/home/userRoles';
        service.getUserRoleDetails().subscribe((response: any) => {
          expect(response.status).toBe("Success");
          done();
        });
  
        const req = httpTestingController.expectOne(uri);
        expect(req.request.method).toEqual("GET");
        req.flush(response);
      });

      it("should call applyUserRole", (done) => {
        const response = {
          status: "Success",
        };
  
        const uri ='../api/home/assignRole?userId=' + '123' + '&userRole=' +'test';
        service.applyUserRole('123','test').subscribe((response: any) => {
          expect(response.status).toBe("Success");
          done();
        });
  
        const req = httpTestingController.expectOne(uri);
        expect(req.request.method).toEqual("PUT");
        req.flush(response);
      });

      it("should call executeWalkMe", (done) => {
        const response = {
          status: "Success",
        };
  
        const uri ='../api/resource/EXECUTE_WALK_ME_SCRIPT';
        service.executeWalkMe().subscribe((response: any) => {
          expect(response.status).toBe("Success");
          done();
        });
  
        const req = httpTestingController.expectOne(uri);
        expect(req.request.method).toEqual("GET");
        req.flush(response);
      });

      it("should call getSalesAccountCount", (done) => {
        const response = {
          status: "Success",
        };
  
        const uri ='test/api/prospect/sales-accounts';
        service.getSalesAccountCount('test/').subscribe((response: any) => {
          expect(response.status).toBe("Success");
          done();
        });
  
        const req = httpTestingController.expectOne(uri);
        expect(req.request.method).toEqual("GET");
        req.flush(response);
      });

      it("should call getResourceForPollerService", (done) => {
        const response = {
          status: "Success",
        };
  
        const uri ='test/api/resource/test';
        service.getResourceForPollerService('test/','test').subscribe((response: any) => {
          expect(response.status).toBe("Success");
          done();
        });
  
        const req = httpTestingController.expectOne(uri);
        expect(req.request.method).toEqual("GET");
        req.flush(response);
      });
});
