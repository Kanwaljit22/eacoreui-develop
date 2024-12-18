
import {  CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';

import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { EaRestService } from 'ea/ea-rest.service';
import { EaStoreService } from 'ea/ea-store.service';

import { of } from 'rxjs';
import { BlockUiService } from 'vnext/commons/services/block-ui.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { ProjectRestService } from 'vnext/project/project-rest.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { ProjectService } from 'vnext/project/project.service';
import { VnextService } from 'vnext/vnext.service';
import { ProposalRestService } from '../proposal-rest.service';
import { ProposalStoreService } from '../proposal-store.service';
import { ProposalService } from '../proposal.service';
import { ProposalDashboardComponent } from './proposal-dashboard.component';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';

const proposalDataMock = { "rid": "EAMP1656522604104", "user": "prguntur", "error": false, "data": { "objId": "626b0169bad6407a7dc599e7", "id": 20009733, "projectObjId": "614c9231e5c642705a44e295", "projectId": 2000013, "name": "Test Proposal", "billingTerm": { "rsd": "20220428", "billingModel": "Prepaid", "term": 36, "eaEndDate": 1745737200000, "eaEndDateStr": "20250427" }, "countryOfTransaction": "US", "priceList": { "id": "1109", "name": "Global Price List - US" }, "currencyCode": "USD", "partnerInfo": { "beGeoId": 639324, "beId": 586064, "beGeoName": "ConvergeOne, Inc.", "pgtmvBeGeoId": 272241792, "countryCode": "US" }, "customer": { "accountName": "THE WALT DISNEY STUDIOS", "customerGuId": "213433", "customerGuName": "THE WALT DISNEY COMPANY", "preferredLegalName": "THE WALT DISNEY STUDIOS", "preferredLegalAddress": { "addressLine1": "500 SOUTH BUENA VISTA STREET", "city": "BURBANK", "state": "CA", "zip": "91521", "country": "US" }, "customerReps": [{ "id": 0, "title": "Dev", "firstName": "Pradeep", "lastName": "G", "name": "Pradeep G", "email": "prguntur@cisco.com" }], "federalCustomer": false, "countryCode": "US", "duoCustomerType": { "federalCustomer": true, "legacyCustomer": true, "subscriptionLines": false, "hwTokenLines": false }, "legacyCustomer": true }, "dealInfo": { "id": "52547273", "statusDesc": "Qualified", "optyOwner": "mariar", "buyMethodDisti": false, "type": "PARTNER", "dealScope": 3, "dealSource": 0, "dealType": 3, "crPartyId": "235436613", "partnerDeal": true, "distiDeal": false }, "buyingProgram": "BUYING_PGRM_3", "locked": false, "status": "COMPLETE", "initiatedBy": { "type": "CISCO", "distiInitiated": false, "ciscoInitiated": true }, "audit": { "createdBy": "prguntur", "createdAt": 1651179881204, "updatedBy": "prguntur", "updatedAt": 1656522579951 }, "priceInfo": { "extendedList": 394646.4, "unitNet": 0, "originalExtendedList": 0, "originalUnitList": 0, "totalNet": 146429.28, "totalNetBeforeCredit": 225115.2, "totalNetAfterIBCredit": 146429.28, "unitListMRC": 0, "unitNetMRC": 0 }, "commitInfo": { "committed": true, "threshold": 100000.0, "fullCommitTcv": 146429.28 }, "loccDetail": { "loccSigned": true, "loccInitiated": true, "loccOptional": false, "loccNotRequired": false, "loccExpiredDate": "25-Aug-2022", "deferred": false, "customerContact": { "id": "0", "preferredLegalName": "DISNEY ENTERPRISES, INC.", "repName": "RS Singh", "repFirstName": "RS", "repLastName": "Singh", "repTitle": "Dev", "repEmail": "rishiksi@cisco.com", "preferredLegalAddress": { "city": "KISSIMMEE", "state": "FL", "zip": "34747", "country": "US" } } }, "forceAllowCompletion": false, "programEligibility": { "eligible": true, "nonEligiblePrimaryEnrollments": [], "nonEligibleSecondaryEnrollments": [], "eligiblePrimaryEnrollments": [], "eligibleSecondaryEnrollments": [] }, "syncStatus": { "configDirty": false, "priceDirty": false, "hanaDirty": false, "quoteInSync": false, "ruleDirty": false, "cxCcwrPriceDirty": false }, "deleted": false, "scopeInfo": { "scopeId": 1429, "masterAgreementId": "EA2584", "returningCustomer": false }, "permissions": { "featureAccess": [{ "name": "proposal.delete", "description": "Proposal Delete", "disabled": false, "defaulted": true }, { "name": "project.manage_team", "description": "Project Manage Team", "disabled": false, "defaulted": false }, { "name": "proposal.reopen", "description": "Proposal Reopen", "disabled": false, "defaulted": true }, { "name": "proposal.edit_name", "description": "Proposal Edit Name", "disabled": false, "defaulted": false }, { "name": "compliance.hold.release", "description": "Compliance Hold Release", "disabled": false, "defaulted": false }, { "name": "proposal.create", "description": "Proposal Create", "disabled": false, "defaulted": true }, { "name": "proposal.document_center", "description": "Document Center", "disabled": false, "defaulted": false }, { "name": "proposal.duplicate", "description": "Proposal Duplicate", "disabled": false, "defaulted": false }, { "name": "proposal.view", "description": "Proposal View", "disabled": false, "defaulted": true }] }, "completionAudit": { "createdBy": "prguntur", "createdAt": 1656522579950, "updatedBy": "prguntur", "updatedAt": 1656522579950 }, "projectStatus": "COMPLETE", "subscriptionInfo": { "existingCustomer": false }, "summaryViewAllowed": true, "allowCompletion": true, "statusDesc": "Complete" }, "buildVersion": "NOV 11-14-2021 09:53 EST RELEASE", "currentDate": 1656522605703 };

const dashboardDataMock = { "rid": "EAMP1656522607287", "user": "prguntur", "error": false, "data": { "priceInfo": { "extendedList": 394646.4, "discountedAmount": 169531.2, "totalSwNet": 146429.28, "totalSwNetBeforeCredit": 225115.2, "swPurchaseAdjustment": 78685.92, "totalSrvcNet": 0, "totalSrvcNetBeforeCredit": 0, "totalNet": 146429.28, "totalNetBeforeCredit": 225115.2, "purchaseAdjustment": 78685.92 } }, "buildVersion": "NOV 11-14-2021 09:53 EST RELEASE", "currentDate": 1656522607688 };

const lifeCycleDataMock = { "rid": "EAMP1656522607272", "user": "prguntur", "error": false, "data": { "lifecycles": [{ "name": "Deal", "status": "COMPLETED" }, { "name": "Scoping", "status": "COMPLETED" }, { "name": "Proposal", "status": "COMPLETED" }, { "name": "Quote", "status": "IN_PROGRESS" }, { "name": "Order", "status": "IN_PROGRESS" }, { "name": "Fulfillment", "status": "IN_PROGRESS" }] }, "buildVersion": "NOV 11-14-2021 09:53 EST RELEASE", "currentDate": 1656522607792 };

const exceptionDataMock = { "rid": "EAMP1656522607565", "user": "prguntur", "error": false, "data": { "allowExceptionSubmission": false, "allowExceptionWithdrawl": false }, "buildVersion": "NOV 11-14-2021 09:53 EST RELEASE", "currentDate": 1656522607938 };

const promotionalEligibilityCheckDataMock = { "rid": "EAMP1656522607565", "user": "prguntur", "error": false, "data": { "proposal": { "objId": "626b0169bad6407a7dc599e7", "id": 20009733, "projectObjId": "614c9231e5c642705a44e295", "projectId": 2000013, "name": "Test Proposal", "billingTerm": { "rsd": "20220428", "billingModel": "Prepaid", "term": 36, "eaEndDate": 1745737200000, "eaEndDateStr": "20250427" }, "countryOfTransaction": "US", "priceList": { "id": "1109", "name": "Global Price List - US" }, "currencyCode": "USD", "partnerInfo": { "beGeoId": 639324, "beId": 586064, "beGeoName": "ConvergeOne, Inc.", "pgtmvBeGeoId": 272241792, "countryCode": "US" }, "customer": { "accountName": "THE WALT DISNEY STUDIOS", "customerGuId": "213433", "customerGuName": "THE WALT DISNEY COMPANY", "preferredLegalName": "THE WALT DISNEY STUDIOS", "preferredLegalAddress": { "addressLine1": "500 SOUTH BUENA VISTA STREET", "city": "BURBANK", "state": "CA", "zip": "91521", "country": "US" }, "customerReps": [{ "id": 0, "title": "Dev", "firstName": "Pradeep", "lastName": "G", "name": "Pradeep G", "email": "prguntur@cisco.com" }], "federalCustomer": false, "countryCode": "US", "duoCustomerType": { "federalCustomer": true, "legacyCustomer": true, "subscriptionLines": false, "hwTokenLines": false }, "legacyCustomer": true }, "dealInfo": { "id": "52547273", "statusDesc": "Qualified", "optyOwner": "mariar", "buyMethodDisti": false, "type": "PARTNER", "dealScope": 3, "dealSource": 0, "dealType": 3, "crPartyId": "235436613", "partnerDeal": true, "distiDeal": false }, "buyingProgram": "BUYING_PGRM_3", "locked": false, "status": "COMPLETE", "initiatedBy": { "type": "CISCO", "distiInitiated": false, "ciscoInitiated": true }, "audit": { "createdBy": "prguntur", "createdAt": 1651179881204, "updatedBy": "prguntur", "updatedAt": 1656522579951 }, "priceInfo": { "extendedList": 394646.4, "unitNet": 0, "originalExtendedList": 0, "originalUnitList": 0, "totalNet": 146429.28, "totalNetBeforeCredit": 225115.2, "totalNetAfterIBCredit": 0, "unitListMRC": 0, "unitNetMRC": 0 }, "commitInfo": { "committed": true, "threshold": 100000.0, "fullCommitTcv": 146429.28 }, "forceAllowCompletion": false, "programEligibility": { "eligible": true, "nonEligiblePrimaryEnrollments": [], "nonEligibleSecondaryEnrollments": [], "eligiblePrimaryEnrollments": [], "eligibleSecondaryEnrollments": [] }, "syncStatus": {"cxCcwrPriceDirty":true,"cxEditFlag":false,"cxCcwrRipFlag":false,"showIbAssessmentButton":false}, "deleted": false, "scopeInfo": { "scopeId": 1429, "masterAgreementId": "EA2584", "returningCustomer": false }, "completionAudit": { "createdBy": "prguntur", "createdAt": 1656522579950, "updatedBy": "prguntur", "updatedAt": 1656522579950 }, "subscriptionInfo": { "existingCustomer": false }, "summaryViewAllowed": true, "allowCompletion": true, "statusDesc": "Complete" } }, "buildVersion": "NOV 11-14-2021 09:53 EST RELEASE", "currentDate": 1656522608107 };


class VnextServiceMock {
    isValidResponseWithData(res) {
        return of(true);
    }

    isValidResponseWithoutData(res) {
        return of(true);
    }
}

class ProposalServiceMock {
    getExceptionSummaryData() {
       
    }

    setProposalParamsForWorkspaceCaseInputInfo() {
        
    }
}


class ProposalRestServiceMock {
    getApiCall(url) {
        return of(dashboardDataMock);
    }
    postApiCall(url, req) {
        return of(true)
    }
}

const NgbActiveModalMock = {
   close: jest.fn().mockReturnValue('close')
}

const RouterSpy = {'Router': jest.fn().mockReturnValue('navigate')}

describe('ProposalDashboardComponent', () => {
    let component: ProposalDashboardComponent;
    let fixture: ComponentFixture<ProposalDashboardComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([
                    { path: "ea/project/proposal/list", redirectTo: "" },
                    { path: "ea/project/proposal/123/documents", redirectTo: "" },
                    { path: "ea/project/proposal/123", redirectTo: "" }
                  ]),
                BrowserTestingModule],
            declarations: [ProposalDashboardComponent,LocalizationPipe],
            schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],
            providers: [NgbActiveModal, UtilitiesService, LocalizationService, CurrencyPipe, ProposalStoreService, { provide: ProposalRestService, useClass: ProposalRestServiceMock }, { provide: VnextService, useClass: VnextServiceMock }, NgbModal, {provide: ProposalService, useClass:ProposalServiceMock},  EaStoreService, VnextStoreService, BlockUiService, ProjectStoreService, EaRestService, ProjectService, ProjectRestService, DataIdConstantsService, ElementIdConstantsService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProposalDashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        component.proposalStoreService.proposalData = {
            exception: {
                exceptionActivities: [{},{}]
            }
        }
        component.exceptionApprovalHistory = [{},{}]
        expect(component).toBeTruthy();
    });

    it('should intitate values on ngonInit', () => {
        component.proposalStoreService.proposalData = {
            exception: {
                exceptionActivities: [{},{}]
            }
        }
        component.exceptionApprovalHistory = [{},{}]
        const checkQuotePresentSpy = jest.spyOn(component, 'checkQuotePresent');
        const loadProposalDashboardSpy = jest.spyOn(component, 'loadProposalDashboard');
        const getLifeCycleDataSpy = jest.spyOn(component, 'getLifeCycleData');
        const checkToShowPromoMessagesSpy = jest.spyOn(component, 'checkToShowPromoMessages');
        let proposalService = fixture.debugElement.injector.get(ProposalService);
        let vnextService = fixture.debugElement.injector.get(VnextService);
        component.ngOnInit();
        expect(checkQuotePresentSpy).toHaveBeenCalled();
        expect(loadProposalDashboardSpy).toHaveBeenCalled();
        expect(getLifeCycleDataSpy).toHaveBeenCalled();
        expect(checkToShowPromoMessagesSpy).toHaveBeenCalled();
        expect(vnextService.isRoadmapShown).toBeFalsy();
    });

    it('should check for quote present', () => {
        component.proposalStoreService.proposalData.quoteInfo = {quoteId:'1'}
        component.checkQuotePresent();
        expect(component.isQuotePresent).toBe(true);
    });

    it('should call loadProposalDashboard', () => {
        let restService = fixture.debugElement.injector.get(ProposalRestService);
        jest.spyOn(restService, 'getApiCall').mockReturnValue(of(dashboardDataMock));
        component.loadProposalDashboard();
        expect(component.priceInfo).toBeTruthy();
    });

    it('should call getLifeCycleData1', () => {
        let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
        jest.spyOn(proposalRestService, 'getApiCall').mockReturnValue(of(lifeCycleDataMock));
        //const validateSpy = jest.spyOn(vnextService, 'isValidResponseWithData').mockReturnValue(of(true));
        component.getLifeCycleData();
        //expect(validateSpy).toHaveBeenCalled();
        expect(component.lifeCycleData).toBeTruthy();
    });

    // it('should call getLifeCycleData 1', () => {
    //     let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    //     jest.spyOn(proposalRestService, 'getApiCall').mockReturnValue(of(promotionalEligibilityCheckDataMock));
    //     //const validateSpy = jest.spyOn(vnextService, 'isValidResponseWithData').mockReturnValue(of(true));
    //     const setToShowPromoMsgFlagsSpy = jest.spyOn(component, 'setToShowPromoMsgFlags');
    //     component.getLifeCycleData();
    //    // expect(validateSpy).toHaveBeenCalled();
    //      expect(setToShowPromoMsgFlagsSpy).toHaveBeenCalled();
    // });

    it('should open quote url', () => {
        let res = {
            error: true,
        }
        let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
        jest.spyOn(proposalRestService, 'getApiCall').mockReturnValue(of(res));
       // const validateSpy = jest.spyOn(vnextService, 'isValidResponseWithData').mockReturnValue(of(true));
        window.open = function () { return window; }
        let call = jest.spyOn(window, "open");
        component.openQuoteUrl();
        //expect(validateSpy).toHaveBeenCalled();
        expect(component.isConvertToQuoteClicked).toBeTruthy();
    });

    it('should copy proposal', fakeAsync(() => {
        let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
        jest.spyOn(proposalRestService, 'postApiCall').mockReturnValue(of(proposalDataMock));
        //const validateSpy = jest.spyOn(vnextService, 'isValidResponseWithData').mockReturnValue(of(true));
        let vnextStoreService = fixture.debugElement.injector.get(VnextStoreService);
        
        window['WorkspaceCaseInputInfo'] = function () { return {}; }
        const vnextServiceSpy = jest.spyOn(vnextStoreService, 'cleanToastMsgObject')
        component.copyProposal();
        tick(5000);
        //expect(validateSpy).toHaveBeenCalled();
      //  expect(vnextStoreService.toastMsgObject.copyProposal).toBeTruthy();
        expect(vnextServiceSpy).toHaveBeenCalled();
        flush();
    }));

    it('should call goToQuote', () => {
        window.open = function () { return window; }
        component.proposalStoreService.proposalData.quoteInfo = {redirectUrl: '123'}
        let call = jest.spyOn(window, "open");
        component.goToQuote();
        expect(call).toHaveBeenCalled();
    });
    it('should call setToShowPromoMsgFlags', () => {
        const eligiblePromotions = [{name:'EA-DNAC-OFFER'},{name:'ACI-SOLN-STARTER'}]
        component.setToShowPromoMsgFlags(eligiblePromotions);
        expect(component.allowedDNAC).toBe(true);
    });
    it('should call viewProposalList', () => {
        let val: Promise<true>;
        jest.spyOn(component["router"], 'navigate').mockReturnValue(val);
        component.viewProposalList();
        expect(component["router"].navigate).toHaveBeenCalledWith(['ea/project/proposal/list']);
    });
    it('should call gotoDocument', () => {
        const loadLegalPackage = {}
        let val: Promise<true>;
        component.proposalStoreService.proposalData.objId = '123'
        jest.spyOn(component["router"], 'navigate').mockReturnValue(val);
        component.gotoDocument(loadLegalPackage);
        expect(component["router"].navigate).toHaveBeenCalledWith(['ea/project/proposal/123/documents']);
    });
    it('should call goToCopiedProposal', () => {
        let val: Promise<true>;
        component.copiedProposalData.objId = '123'
        jest.spyOn(component["router"], 'navigate').mockReturnValue(val);
        component.goToCopiedProposal();
        expect(component["router"].navigate).toHaveBeenCalledWith(['ea/project/proposal/123']);
    });
    

});