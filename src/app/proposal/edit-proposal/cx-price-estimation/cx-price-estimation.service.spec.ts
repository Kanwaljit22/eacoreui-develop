import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { CxPriceEstimationService } from "./cx-price-estimation.service"
import { TestBed, waitForAsync } from "@angular/core/testing";
import { ProposalDataService } from "@app/proposal/proposal.data.service";
import { HttpClient } from "@angular/common/http";
import { AppDataService } from "@app/shared/services/app.data.service";
import { ConstantsService } from "@app/shared/services/constants.service";


describe('CxPriceEstimationService', () => {
    let service:CxPriceEstimationService;
    let httpTestingController:HttpTestingController;
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
        proposalDataObject ={proposalId:'123'}
        relatedCxProposalId:'123'
      }
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            providers: [
                CxPriceEstimationService,
                HttpClient,
                ConstantsService,
                {provide:ProposalDataService, useClass:MockProposalDataService},
                {provide:AppDataService, useClass:MockAppDataService}
            ],
            imports: [HttpClientTestingModule],
      
          })
            .compileComponents();
          service = TestBed.inject(CxPriceEstimationService);
        //   appDataService = TestBed.inject(AppDataService)
          httpTestingController = TestBed.inject(HttpTestingController);
      }))


      it('should call getColumnDefs', (done) => {
        const response={status:"success"}
        service.getColumnDefs().subscribe((response:any) => {
            expect(response.status).toBe('success');
            done();
        });
        const uri  = url +  'api/proposal/' + '123'+ '/price-estimate-metadata?archName=' +'test';
        const req = httpTestingController.expectOne(uri);
        expect(req.request.method).toEqual("GET");
        req.flush(response)
      });
      
      it('should call saveDiscount', (done) => {
        const response={status:"success"}
        service.saveDiscount({}).subscribe((response:any) => {
            expect(response.status).toBe('success');
            done();
        });
        const uri  = url + 'api/proposal/tcv/suites/discount?p=' + '123';
        const req = httpTestingController.expectOne(uri);
        expect(req.request.method).toEqual("POST");
        req.flush(response)
      });

      it('should call getData', (done) => {
        const response={status:"success"};
        service['constantsService'].CURRENCY = 'USD'
        service.getData().subscribe((response:any) => {
            expect(response.status).toBe('success');
            done();
        });
        const uri  =   '/api/proposal/' + '123'+ '/price-estimate/cx?c='+ 'USD';
        const req = httpTestingController.expectOne(uri);
        expect(req.request.method).toEqual("GET");
        req.flush(response)
      });

      it('should call getCascadeDiscount', (done) => {
        const response={status:"success"};
        service.getCascadeDiscount().subscribe((response:any) => {
            expect(response.status).toBe('success');
            done();
        });
        const uri  =   url + 'api/proposal/' + '123'+'/cascade-discounts'
        const req = httpTestingController.expectOne(uri);
        expect(req.request.method).toEqual("GET");
        req.flush(response)
      });
      
      it('should call viewAndEditHardwareSupport', (done) => {
        const response={status:"success"};
        service.viewAndEditHardwareSupport().subscribe((response:any) => {
            expect(response.status).toBe('success');
            done();
        });
        const uri  =   url + 'api/proposal/' + '123'+'/view-hardware-items'
        const req = httpTestingController.expectOne(uri);
        expect(req.request.method).toEqual("GET");
        req.flush(response)
      });

      it('should call openSmartsheet', (done) => {
        const response={status:"success"};
        service.openSmartsheet().subscribe((response:any) => {
            expect(response.status).toBe('success');
            done();
        });
        const uri  =   url +'api/qualification/deal-assurers-smartsheet-redirect-url'
        const req = httpTestingController.expectOne(uri);
        expect(req.request.method).toEqual("GET");
        req.flush(response)
      });

      it('should call getPollerServiceUrl', () => {
        const res = service.getPollerServiceUrl()
        const uri  =   url +'api/proposal/'+'123'+'/sync-prices';
        expect(res).toEqual(uri);
      });

      it('should call getDelistedFlag', (done) => {
        const response={status:"success"};
        service.getDelistedFlag().subscribe((response:any) => {
            expect(response.status).toBe('success');
            done();
        });
        const uri  =   url + 'api/proposal/'+'123'+'/cx-de-listed-pricing-details';
        const req = httpTestingController.expectOne(uri);
        expect(req.request.method).toEqual("GET");
        req.flush(response)
      });
})