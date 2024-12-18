import { TestBed, waitForAsync } from "@angular/core/testing";
import { BomService } from "./bom.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { AppDataService } from "@app/shared/services/app.data.service";
import { ProposalDataService } from "../proposal.data.service";



describe('BomService', () => {
    let service :BomService;
    let httpTestingController :HttpTestingController;
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

      class MockProposalDataService{
        proposalDataObject = {
          proposalId:'123'
        }
      }



      beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            providers: [
                BomService,
              { provide: AppDataService, useClass:MockAppDataService },
              {provide:ProposalDataService, useClass:MockProposalDataService}
      
            ],
            imports: [HttpClientTestingModule],
      
          })
            .compileComponents();
          service = TestBed.inject(BomService);
        //   appDataService = TestBed.inject(AppDataService)
          httpTestingController = TestBed.inject(HttpTestingController);
      })) 



      it('should call getBomGridRowData', (done) => {
        const response = {
          status: "Success"
        };

        const uri =  url +  'api/proposal/bom?p=' + '123';
        service.getBomGridRowData().subscribe((response:any) => {
          expect(response.status).toBe("Success");
          done()
        });

        const req = httpTestingController.expectOne(uri);
        expect(req.request.method).toEqual("GET")
        req.flush(response);
        

      });

      it('should call getDealQuotes', (done) => {
        const type = 'goToQuote';
        const response = {
          status: "Success"
        };

        const uri =  url +  'api/proposal/' + '123' + '/deal-quotes';
        service.getDealQuotes(type).subscribe((response:any) => {
          expect(response.status).toBe("Success");
          done()
        });

        const req = httpTestingController.expectOne(uri);
        expect(req.request.method).toEqual("GET")
        req.flush(response);
        

      });


      it('should call getDealQuotes b1', (done) => {
        const type = '';
        const response = {
          status: "Success"
        };

        const uri =  url +  'api/proposal/' + '123' + '/conversion-deal-quotes';
        service.getDealQuotes(type).subscribe((response:any) => {
          expect(response.status).toBe("Success");
          done()
        });

        const req = httpTestingController.expectOne(uri);
        expect(req.request.method).toEqual("GET")
        req.flush(response);
        

      });

      it('should call generateBomToQuote', (done) => {
        const response = {
          status: "Success"
        };
        service.linkedQuoteId = '123';

        const uri =  url +  'api/proposal/bom-to-quote';
        service.generateBomToQuote().subscribe((response:any) => {
          expect(response.status).toBe("Success");
          done()
        });

        const req = httpTestingController.expectOne(uri);
        expect(req.request.method).toEqual("POST")
        req.flush(response);
        

      });

      it('should call generateBomToQuote b1', (done) => {
        const response = {
          status: "Success"
        };
        service.linkedQuoteId = '';

        const uri =  url +  'api/proposal/bom-to-quote';
        service.generateBomToQuote().subscribe((response:any) => {
          expect(response.status).toBe("Success");
          done()
        });

        const req = httpTestingController.expectOne(uri);
        expect(req.request.method).toEqual("POST")
        req.flush(response);
        

      });

      it('should call downloadBOMPreview', (done) => {
        let response = new Blob();
        const uri =  url +  'api/proposal/bom/download?p=123';
        service.downloadBOMPreview().subscribe((response:any) => {
          expect(response.status).toBe(200);
          done()
        });
        const req = httpTestingController.expectOne(uri);
        expect(req.request.method).toEqual("GET")
        req.flush(response);
      });

      it('should call getQuoteUrl', (done) => {
        const response = {
          status: "Success"
        };

        const uri =  url +  'api/proposal/goToCCWQuote?p=123&q=' + '123';
        service.getQuoteUrl('123', '123').subscribe((response:any) => {
          expect(response.status).toBe("Success");
          done()
        });

        const req = httpTestingController.expectOne(uri);
        expect(req.request.method).toEqual("GET")
        req.flush(response);
      });

      it('should call getMLBData', (done) => {
        const response = {
          status: "Success"
        };

        const uri =  'assets/data/singleMLBData.json' ;
        service.getMLBData().subscribe((response:any) => {
          expect(response.status).toBe("Success");
          done()
        });

        const req = httpTestingController.expectOne(uri);
        expect(req.request.method).toEqual("GET")
        req.flush(response);
      });

      it('should call getCxLinkedProposalList', (done) => {
        const response = {
          status: "Success"
        };

        const uri =  url +  'api/proposal/' + '123' + "/link-proposals?linkId=" + "123";
        service.getCxLinkedProposalList('123', '123').subscribe((response:any) => {
          expect(response.status).toBe("Success");
          done()
        });

        const req = httpTestingController.expectOne(uri);
        expect(req.request.method).toEqual("GET")
        req.flush(response);
      });
})