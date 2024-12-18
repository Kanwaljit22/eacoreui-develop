import { TestBed, waitForAsync } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { ApproverTeamService } from "./approver-team.service";
import { HttpClient } from "@angular/common/http";
import { ProposalDataService } from "@app/proposal/proposal.data.service";
import { AppDataService } from "@app/shared/services/app.data.service";


describe('ApproverTeamService',() => {
    let service:ApproverTeamService,httpTestingController:HttpTestingController;
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
      class MockProposalDataService{}
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            providers: [
                ApproverTeamService,
                HttpClient,
                {provide:ProposalDataService, useClass:MockProposalDataService},
                {provide:AppDataService, useClass:MockAppDataService}
            ],
            imports: [HttpClientTestingModule],
      
          })
            .compileComponents();
          service = TestBed.inject(ApproverTeamService);
        //   appDataService = TestBed.inject(AppDataService)
          httpTestingController = TestBed.inject(HttpTestingController);
      })) 

      it('should call becomeApprover', (done) => {
        const type = 'becomeApprover';
        const res = { status : 'success'};
        const uri =  `${url}api/proposal/become-approver`;

        service.becomeApprover({}, type).subscribe((response:any) => {
            expect(response.status).toBe('success');
            done();
        })

        const req = httpTestingController.expectOne(uri);
        expect(req.request.method).toEqual("POST")
        req.flush(res);
        
      });

      it('should call becomeApprover b1', (done) => {
        const type = '';
        const res = { status : 'success'};
        const uri =  `${url}api/proposal/approval-decision-options`;

        service.becomeApprover({}, type).subscribe((response:any) => {
            expect(response.status).toBe('success');
            done();
        })

        const req = httpTestingController.expectOne(uri);
        expect(req.request.method).toEqual("POST")
        req.flush(res);
        
      });

      it('should call submitApproverDecision', (done) => {
  
        const res = { status : 'success'};
        const uri =  `${url}api/proposal/submit-decision`;

        service.submitApproverDecision({}).subscribe((response:any) => {
            expect(response.status).toBe('success');
            done();
        })

        const req = httpTestingController.expectOne(uri);
        expect(req.request.method).toEqual("POST")
        req.flush(res);
        
      });

      it('should call requestDocument', (done) => {
  
        const res = new Blob();
        const uri =  url + 'api/proposal/' + '123' + '/purchase-adjustment-document/download?a='  + '123';

        service.requestDocument('123','123').subscribe((response:any) => {
            expect(response.status).toBe(200);
            done();
        })

        const req = httpTestingController.expectOne(uri);
        expect(req.request.method).toEqual("GET")
        req.flush(res);
        
      });


      it('should call preBecomeApprover', (done) => {
  
        const res = { status : 'success'};
        const uri =  url + 'api/proposal/' +'123/pre-become-approver'

        service.preBecomeApprover('123').subscribe((response:any) => {
            expect(response.status).toBe('success');
            done();
        })

        const req = httpTestingController.expectOne(uri);
        expect(req.request.method).toEqual("GET")
        req.flush(res);
        
      });

      it('should call submitCaseNumber', (done) => {
  
        const res = { status : 'success'};
        const uri =  url + 'api/proposal/' +'123'+'/saveCaseNo'

        service.submitCaseNumber('123',{}).subscribe((response:any) => {
            expect(response.status).toBe('success');
            done();
        })

        const req = httpTestingController.expectOne(uri);
        expect(req.request.method).toEqual("POST")
        req.flush(res);
        
      });

      it('should call subscriptionCreditDetails', (done) => {
  
        const res = { status : 'success'};
        const uri =  url +  'api/proposal/renewal/' +'123'+ '/subscription-credit-details'

        service.subscriptionCreditDetails('123').subscribe((response:any) => {
            expect(response.status).toBe('success');
            done();
        })

        const req = httpTestingController.expectOne(uri);
        expect(req.request.method).toEqual("GET")
        req.flush(res);
        
      });

      it('should call downloadSubscriptionDetails', (done) => {
  
        const res = new Blob();
        const uri =  url +  'api/proposal/' +'123'+  '/download-subscription-details'

        service.downloadSubscriptionDetails('123').subscribe((response:any) => {
            expect(response.status).toBe(200);
            done();
        })

        const req = httpTestingController.expectOne(uri);
        expect(req.request.method).toEqual("GET")
        req.flush(res);
        
      });
      it('should call becomeApproverDecision', (done) => {
  
        const res = { status : 'success'};
        const uri =  url +  'api/proposal/' +'123'+  '/approver-decision-options/'+'123';

        service.becomeApproverDecision('123','123').subscribe((response:any) => {
            expect(response.status).toBe('success');
            done();
        })

        const req = httpTestingController.expectOne(uri);
        expect(req.request.method).toEqual("GET")
        req.flush(res);
        
      });

})