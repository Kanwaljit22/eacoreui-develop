import { TestBed, waitForAsync } from "@angular/core/testing";
import { ProspectDetailsService } from "./prospect-details.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { AppDataService } from "@app/shared/services/app.data.service";
import { HttpClient } from "@angular/common/http";
import { BlockUiService } from "@app/shared/services/block.ui.service";


describe('ProspectDetailsService', () => {
    
    let service :ProspectDetailsService;
    let httpTestingController :HttpTestingController;
    const url = "https://localhost:4200/";
    class MockAppDataService{
        customerID='123';
        customerName='test';
        isQualOrPropListFrom360Page=true;
        archName='test';
        getSessionObject(){
            return {architectureMetaDataObject:[{selected:true , modules:[{columns:2}]} ]};
        }
        architectureMetaDataObject = '';
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
        class MockBlockUIService{
            spinnerConfig = {
                startChain:() => {
                    
                }
            }
        }
    
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            providers: [
                ProspectDetailsService,
            { provide: AppDataService, useClass:MockAppDataService },
            HttpClient,
            {provide:BlockUiService, useClass:MockBlockUIService}
             
            ],
            imports: [HttpClientTestingModule],
      
          })
            .compileComponents();
          service = TestBed.inject(ProspectDetailsService);
        //   appDataService = TestBed.inject(AppDataService)
          httpTestingController = TestBed.inject(HttpTestingController);
          service.columnHeaderList = [];
        //   service.proposalId ='123';
      }))

      it('should call',() => {
        expect(service).toBeTruthy()
      });


      it('should call getSummaryViewData', (done) => {
        const response = {
            status: "Success"
          };
          const uri =  url + 'api/prospect/prospectheader'
          service.getSummaryViewData({}).subscribe((response:any) => {
            expect(response.status).toBe("Success");
            done()
          });
  
          const req = httpTestingController.expectOne(uri);
          expect(req.request.method).toEqual("POST")
          req.flush(response);
    });

    it('should call getTabData', (done) => {
        const response = {
            status: "Success"
          };
          const uri =  url  + 'api/prospect/' +'test';
          service.getTabData('test').subscribe((response:any) => {
            expect(response.status).toBe("Success");
            done()
          });
  
          const req = httpTestingController.expectOne(uri);
          expect(req.request.method).toEqual("POST")
          req.flush(response);
    });

    it('should call getProposalArchitectures', (done) => {
        const response = {
            status: "Success"
          };
          const uri =  url  + 'api/proposal/architectures';
          service.getProposalArchitectures().subscribe((response:any) => {
            expect(response.status).toBe("Success");
            done()
          });
  
          const req = httpTestingController.expectOne(uri);
          expect(req.request.method).toEqual("GET")
          req.flush(response);
    });


    it('should call updateRowData', () => {
          const array = [{name:'test',value:123}]
          service.updateRowData(array , {})
    });

    it('should call getSummaryHeaderColumns', () => {
        const appDataService = TestBed.inject(AppDataService);
        appDataService.architectureMetaDataObject = [{selected:true , modules:[{columns:2}]} ];
        service.columnHeaderList = [];
      const response =  service.getSummaryHeaderColumns();
      console.log(response)
        expect(service['configService'].architectureMetaDataObject).toEqual([{selected:true , modules:[{columns:2}]} ])
        const architectureObjData = service['configService'].architectureMetaDataObject;
        console.log("columnHeaderList", service.columnHeaderList)
        for (let i = 0; i < architectureObjData.length; i++) {
          if (architectureObjData[i].selected) {
            service.columnHeaderList =
              architectureObjData[i].modules[0].columns;

              expect(service.columnHeaderList).toBe(2)
            break;
          }
        }
      
  });
})