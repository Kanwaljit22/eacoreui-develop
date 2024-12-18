
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AppDataService } from '@app/shared/services/app.data.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { MessageService } from '@app/shared/services/message.service';
import { ConstantsService } from '../shared/services/constants.service';
import { ProposalPollerService } from './../shared/services/proposal-poller.service';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { EaStoreService } from 'ea/ea-store.service';
import { of } from 'rxjs';
import { ProposalDataService } from './proposal.data.service';

describe('ProposalDataService', () => {
    let service: ProposalDataService;
    let httpMock: HttpTestingController;
    let appDataServiceMock: any;
    let utilitiesServiceMock: any;
    let messageServiceMock: any;
    let constantsServiceMock: any;
    let proposalPollerServiceMock: any;
    let blockUiServiceMock: any;
    let eaStoreServiceMock: any;

    beforeEach(() => {
        appDataServiceMock = {
            getSessionObject: jest.fn(),
            setSessionObject: jest.fn(),
            getAppDomain: 'http://localhost/',
            archName: 'DNA'
        };

        utilitiesServiceMock = {
            formatValue: jest.fn((value) => value),
            getFloatValue: jest.fn((value) => value)
        };

        messageServiceMock = {
            displayMessagesFromResponse: jest.fn(),
            displayUiTechnicalError: jest.fn()
        };

        constantsServiceMock = {
            DNA: 'DNA'
        };

        proposalPollerServiceMock = {
            invokeGetPollerservice: jest.fn(),
            stopPollerService: jest.fn()
        };

        blockUiServiceMock = {
            isPollerServiceCall: false
        };

        eaStoreServiceMock = {};

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                ProposalDataService,
                { provide: AppDataService, useValue: appDataServiceMock },
                { provide: UtilitiesService, useValue: utilitiesServiceMock },
                { provide: MessageService, useValue: messageServiceMock },
                { provide: ConstantsService, useValue: constantsServiceMock },
                { provide: ProposalPollerService, useValue: proposalPollerServiceMock },
                { provide: BlockUiService, useValue: blockUiServiceMock },
                { provide: EaStoreService, useValue: eaStoreServiceMock }
            ]
        });

        service = TestBed.inject(ProposalDataService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should create the service', () => {
        expect(service).toBeTruthy();
    });

   // it('should update session proposal', () => {
       // service.proposalDataObject.proposalData.currencyCode = 'USD';
       // service.updateSessionProposal();

        //expect(appDataServiceMock.setSessionObject).toHaveBeenCalled();
        //expect(appDataServiceMock.setSessionObject.mock.calls[0][0].proposalDataObj).toEqual(service.proposalDataObject);
        //expect(appDataServiceMock.setSessionObject.mock.calls[0][0].currency).toBe('USD');
   // });

    it('should validate billing model correctly', () => {
        service.proposalDataObject.proposalData.billingModelID = 'Prepaid';
        service.selectedArchForQna = 'Arch1';
        service.billingModelMetaData = { architectures: { Arch1: ['Prepaid', 'Postpaid'] } };

        service.validateBillingModel();
        expect(service.invalidBillingModel).toBe(false);

        service.proposalDataObject.proposalData.billingModelID = 'Invalid';
        service.validateBillingModel();
        expect(service.invalidBillingModel).toBe(true);
    });

    it('should fetch configuration URL', () => {
        service.getConfigURL().subscribe(response => {
            expect(response).toBeDefined();
        });

        const req = httpMock.expectOne('http://localhost/api/resource/CONFIG_PUCH_OUT_URL');
        expect(req.request.method).toBe('GET');
        req.flush({});
    });

    it('should fetch financial summary', () => {
        const proposalId = 1;
        service.getFinancialSummary(proposalId).subscribe(res => {
            expect(res).toBeDefined();
        });

        const req = httpMock.expectOne(`http://localhost/api/proposal/${proposalId}/financial-summary`);
        expect(req.request.method).toBe('GET');
        req.flush({});
    });

    it('should handle errors in financial summary', () => {
        const proposalId = 1;
        service.getFinancialSummaryData(proposalId);
        
        const req = httpMock.expectOne(`http://localhost/api/proposal/${proposalId}/financial-summary`);
        req.flush({ error: true });
        
        expect(messageServiceMock.displayMessagesFromResponse).toHaveBeenCalled();
    });

    //it('should handle successful financial summary data', () => {
        //const proposalId = 1;
        //const mockResponse = {
        //    data: {
          //      loccNotRequired: true,
          //      brownfieldPartner: false,
           //     tcvSummaries: [
            //        { name: 'Test', netTcvBeforeAdjustment: 1000, postPurchaseAdjustmentNetTotalPrice: 2000 }
           //     ]
          //  }
       // };

        //service.getFinancialSummaryData(proposalId);
        
        //const req = httpMock.expectOne(`http://localhost/api/proposal/${proposalId}/financial-summary`);
        //req.flush(mockResponse);

        //expect(service.isLoccRequired).toBe(false);
       /// expect(service.isBrownfieldPartner).toBe(false);
       // expect(service.summaryData.length).toBe(1);
   // });

    it('should check if annual billing message is required', () => {
        service.proposalDataObject.proposalData.billingModel = 'Annual Billing';
        service.isAnnualBillingMsgRequired();
        
        expect(service.displayAnnualBillingMsg).toBe(true);
        
        service.proposalDataObject.proposalData.billingModel = 'Monthly Billing';
        service.isAnnualBillingMsgRequired();

        expect(service.displayAnnualBillingMsg).toBe(false);
    });

    it('should invoke poller service for bell icon', () => {
        const url = 'test-url';
        const proposalCxParams = {};
        const proposalCxPriceInfo = {};

        proposalPollerServiceMock.invokeGetPollerservice.mockReturnValue(of({ data: { cxParam: { awaitingResponse: false } } }));
        
        service.invokePollerServiceForBellIcon(url, proposalCxParams, proposalCxPriceInfo);
        
        expect(blockUiServiceMock.isPollerServiceCall).toBe(false);
        expect(service.isPollerServiceInvoked).toBe(true);
        expect(service.displayBellIcon).toBe(true);
    });
});
