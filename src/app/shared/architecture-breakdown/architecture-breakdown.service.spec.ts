import { TestBed, waitForAsync } from "@angular/core/testing";
import { ArchitectureBreakdownService } from "./architecture-breakdown.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { AppDataService } from "../services/app.data.service";

describe('ArchitectureBreakdownService', () => {
    let service:ArchitectureBreakdownService;
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
            providers:[ArchitectureBreakdownService,{provide:AppDataService,useClass:MockAppDataService}]
        }).compileComponents();
        service =  TestBed.inject(ArchitectureBreakdownService);
        httpTestingController = TestBed.inject(HttpTestingController);


    }));

    it('should call getTopPartnerData', (done) => {
        const response = {
            status: "Success",
          };
      
          const uri = url + 'api/prospect/top-partner';
          service.getTopPartnerData({}).subscribe((response: any) => {
            expect(response.status).toBe("Success");
            done();
          });
          const req = httpTestingController.expectOne(uri);
          expect(req.request.method).toEqual("POST");
          req.flush(response);
    });


    it('should call getPartnerDetailsByCust', (done) => {
        const response = {
            status: "Success",
          };
      
          const uri = url + 'api/prospect/details-by-partner';
          service.getPartnerDetailsByCust({}).subscribe((response: any) => {
            expect(response.status).toBe("Success");
            done();
          });
          const req = httpTestingController.expectOne(uri);
          expect(req.request.method).toEqual("POST");
          req.flush(response);
    });
})