import { TestBed, waitForAsync } from "@angular/core/testing";
import { ManageSuitesService } from "./manage-suites.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { AppDataService } from "@app/shared/services/app.data.service";
import { ConstantsService } from "@app/shared/services/constants.service";
import { HttpClient } from "@angular/common/http";


describe('ManageSuitesService', () => {


    let service :ManageSuitesService;
    let httpTestingController :HttpTestingController;
    const url = "https://localhost:4200/";
    class MockAppDataService{
        customerID='123';
        customerName='test';
        isQualOrPropListFrom360Page=true;
        archName='test';
       get getAppDomain(){
            return url;
          }
          userInfo ={
            userId:"123"
          }
      }

      class MockProposalDataService{
        proposalDataObject = {
          proposalId:'123'
        }
      }
        class MockConstantsService{
            SECURITY='test'
        }


      beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            providers: [
            ManageSuitesService,
            { provide: AppDataService, useClass:MockAppDataService },
            HttpClient,
              {provide:ConstantsService, useClass:MockConstantsService}
            ],
            imports: [HttpClientTestingModule],
      
          })
            .compileComponents();
          service = TestBed.inject(ManageSuitesService);
        //   appDataService = TestBed.inject(AppDataService)
          httpTestingController = TestBed.inject(HttpTestingController);
          service.proposalId ='123';
      })) 

    it('should call saveSuites', (done) => {
        const response = {
            status: "Success"
          };
  
          const uri =  url +  'api/proposal/suiteSelection';
          service.saveSuites().subscribe((response:any) => {
            expect(response.status).toBe("Success");
            done()
          });
  
          const req = httpTestingController.expectOne(uri);
          expect(req.request.method).toEqual("POST")
          req.flush(response);
    });


    it('should call checkForRedirection', (done) => {
        const response = {
            status: "Success"
          };
          service.proposalId ='123';
          const uri =  url +  'api/proposal/'+'123'+'/bill-to-punchout-details';
          service.checkForRedirection().subscribe((response:any) => {
            expect(response.status).toBe("Success");
            done()
          });
  
          const req = httpTestingController.expectOne(uri);
          expect(req.request.method).toEqual("GET")
          req.flush(response);
    });

    it('should call getSuites', (done) => {
        const response = {
            status: "Success"
          };

          const uri =  url  + 'api/proposal/suites';
          service.getSuites({}).subscribe((response:any) => {
            expect(response.status).toBe("Success");
            done()
          });
  
          const req = httpTestingController.expectOne(uri);
          expect(req.request.method).toEqual("POST")
          req.flush(response);
    });

    it('should call saveConfigPayload', (done) => {
        const response = {
            status: "Success"
          };

          const uri =  url  + 'api/proposal/configPunchOut/123'
          service.saveConfigPayload('123').subscribe((response:any) => {
            expect(response.status).toBe("Success");
            done()
          });
  
          const req = httpTestingController.expectOne(uri);
          expect(req.request.method).toEqual("POST")
          req.flush(response);
    });

    it('should call ibPull', (done) => {
        const response = {
            status: "Success"
          };
          const uri =  url +  'api/proposal/'+'123'+ '/cx-ib-pull'
          service.ibPull('123').subscribe((response:any) => {
            expect(response.status).toBe("Success");
            done()
          });
  
          const req = httpTestingController.expectOne(uri);
          expect(req.request.method).toEqual("GET")
          req.flush(response);
    });
})