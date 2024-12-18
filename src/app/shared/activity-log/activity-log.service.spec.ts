import { TestBed, waitForAsync } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { AppDataService } from "../services/app.data.service";
import { ActivityLogService } from "./activity-log.service";
import { ConstantsService } from "../services/constants.service";
import { HttpClient } from "@angular/common/http";

describe('ActivityLogService', () => {
    let service:ActivityLogService;
    let httpTestingController:HttpTestingController;
    const url = "https://localhost:4200/";
    class MockAppDataService {
        subHeaderData={favFlag:false,moduleName:'test',subHeaderVal:''}
        customerID = "123";
        customerName = "test";
        isQualOrPropListFrom360Page = true;
        archName = "test";
        get getAppDomain() {
          return url;
        }
        userInfo = {
          userId: "123",
        };
      }
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports:[HttpClientTestingModule],
            declarations:[],
            providers:[ActivityLogService,{provide:AppDataService,useClass:MockAppDataService},ConstantsService,HttpClient]
        }).compileComponents();
        service =  TestBed.inject(ActivityLogService);
        httpTestingController = TestBed.inject(HttpTestingController);


    }));

    it('should call getActivityLogData', (done) => {
        const response = {
            status: "Success",
          };

        const test = 'test';
      
          const uri = url + 'api/activitylog/downloadLogs?id=' + test + '&type=' + test + '&dateFilter=' + test;
          service.getActivityLogData(test, test, test).subscribe((response: any) => {
            expect(response.status).toBe("Success");
            done();
          });
          const req = httpTestingController.expectOne(uri);
          expect(req.request.method).toEqual("GET");
          req.flush(response);
    });
})