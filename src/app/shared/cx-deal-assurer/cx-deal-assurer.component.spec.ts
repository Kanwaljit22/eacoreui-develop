import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Renderer2 } from "@angular/core";
import { CxDealAssurerComponent } from "./cx-deal-assurer.component";
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from "@angular/core/testing";
import { SearchPipe } from "../pipes/search.pipe";
import { ManageTeamMembersPipe } from "../pipes/manage-team-members.pipe";
import { ManageTeamMembersComponent } from "@app/modal/manage-team-members/manage-team-members.component";
import { LocaleService } from "../services/locale.service";
import { ConstantsService } from "../services/constants.service";
import { EaService } from "ea/ea.service";
import { EaRestService } from "ea/ea-rest.service";
import { DashboardService } from "@app/dashboard/dashboard.service";
import { PermissionService } from "@app/permission.service";
import { TcoDataService } from "@app/tco/tco.data.service";
import { ProposalDataService } from "@app/proposal/proposal.data.service";
import { UtilitiesService } from "../services/utilities.service";
import { MessageService } from "../services/message.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { QualificationsService } from "@app/qualifications/qualifications.service";
import { WhoInvolvedService } from "@app/qualifications/edit-qualifications/who-involved/who-involved.service";
import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";
import { ProposalPollerService } from "../services/proposal-poller.service";
import { HttpCancelService } from "../services/http.cancel.service";
import { AppRestService } from "../services/app.rest.service";
import { CurrencyPipe } from "@angular/common";
import { BlockUiService } from "../services/block.ui.service";
import { AppDataService } from "../services/app.data.service";
import { EditQualificationService } from "@app/modal/edit-qualification/edit-qualification.service";
import { CreateProposalService } from "@app/proposal/create-proposal/create-proposal.service";
import { CopyLinkService } from "../copy-link/copy-link.service";
import { ProductSummaryService } from "@app/dashboard/product-summary/product-summary.service";
import { FiltersService } from "@app/dashboard/filters/filters.service";
import { CxPriceEstimationService } from "@app/proposal/edit-proposal/cx-price-estimation/cx-price-estimation.service";
import { of } from "rxjs";


describe('CxDealAssurerComponent', () => {
    let component: CxDealAssurerComponent;
    let fixture: ComponentFixture<CxDealAssurerComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [CxDealAssurerComponent, SearchPipe, ManageTeamMembersPipe, ManageTeamMembersComponent],
            providers: [LocaleService, ConstantsService, EaService, EaRestService, CxPriceEstimationService,
                DashboardService, Renderer2, MessageService, NgbModal, QualificationsService, AppDataService,
                PermissionService, UtilitiesService, AppRestService, CurrencyPipe, BlockUiService, CopyLinkService,
                ProposalDataService, ProposalPollerService, SearchPipe, EditQualificationService, CreateProposalService,
                TcoDataService, WhoInvolvedService, HttpCancelService, ManageTeamMembersPipe, ProductSummaryService, FiltersService],
            imports: [HttpClientModule, RouterTestingModule.withRoutes([
                { path: "qualifications", redirectTo: "" }])],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CxDealAssurerComponent);
        component = fixture.componentInstance;
        component.qualService.qualification.cxDealAssurerTeams = [{
            ccoId: 'rbinwani'
        }]
        component.cxDealAssurerTeams = [{ ccoId: 'rbinwani' }];
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call ngoninit', () => {
        component.qualService.qualification.cxDealAssurerTeams = [{
            ccoId: 'rbinwani'
        }]
        component.cxDealAssurerTeams = [{ ccoId: 'rbinwani' }];
        const checkboxSelectors = jest.spyOn(component, 'checkboxSelectors')
        component.ngOnInit();
        expect(component.addMember).toBeTruthy();
        expect(checkboxSelectors).toHaveBeenCalled();
    });

    it('should checkboxSelectors', () => {
        // component.qualService.qualification.cxDealAssurerTeams = [
        //     {"name":"Maria Roark","firstName":"Maria","lastName":"Roark","email":"maria.roark@aos5.com","ccoId":"mariar","access":"rw","notification":"Yes","webexNotification":"N","notifyByWelcomeKit":"Y","cam":false,"mailer":false,"partner":false,"defaultSelection":false},{"name":"nancy lindsay","firstName":"nancy","lastName":"lindsay","email":"maria.roark@aos5.com","ccoId":"00u43oziqa7zypre25d7","access":"rw","notification":"No","webexNotification":"Y","notifyByWelcomeKit":"Y","cam":false,"mailer":false,"partner":false,"defaultSelection":false},{"name":"Eric Eliason","firstName":"Eric","lastName":"Eliason","email":"maria.roark@aos5.com","ccoId":"eeliason@convergeone.com","access":"rw","notification":"Yes","webexNotification":"Y","notifyByWelcomeKit":"N","cam":false,"mailer":false,"partner":false,"defaultSelection":false}
        // ]
        component.qualService.qualification.cxDealAssurerTeams = []
        component.checkboxSelectors();
        expect(component.daelAssurerNotifyAllEmail).toBeFalsy();
        expect(component.daelAssurerNotifyAllWebex).toBeFalsy();
        expect(component.dealAssurerMasterCheckDisabled).toBeTruthy();
    });

    it('should checkboxSelectors', () => {
        component.qualService.qualification.cxDealAssurerTeams = [
            { "name": "Maria Roark", "firstName": "Maria", "lastName": "Roark", "email": "maria.roark@aos5.com", "ccoId": "mariar", "access": "rw", "notification": "No", "webexNotification": "N", "notifyByWelcomeKit": "Y", "cam": false, "mailer": false, "partner": false, "defaultSelection": false }, { "name": "nancy lindsay", "firstName": "nancy", "lastName": "lindsay", "email": "maria.roark@aos5.com", "ccoId": "00u43oziqa7zypre25d7", "access": "rw", "notification": "No", "webexNotification": "Y", "notifyByWelcomeKit": "Y", "cam": false, "mailer": false, "partner": false, "defaultSelection": false }, { "name": "Eric Eliason", "firstName": "Eric", "lastName": "Eliason", "email": "maria.roark@aos5.com", "ccoId": "eeliason@convergeone.com", "access": "rw", "notification": "Yes", "webexNotification": "Y", "notifyByWelcomeKit": "N", "cam": false, "mailer": false, "partner": false, "defaultSelection": false }
        ]
        component.checkboxSelectors();
        expect(component.daelAssurerNotifyAllEmail).toBeFalsy();
        expect(component.daelAssurerNotifyAllWebex).toBeFalsy();
    });

    it('should cal removeSelectedCxDealAssurer', () => {
        const id = { id: 'rbinwani' };
        component.selectedCxDealAssurer = [id];
        component.removeSelectedCxDealAssurer(id);
        expect(component.selectedCxDealAssurer).toBeTruthy();
    });

    it('should call onChangeInputValue', () => {
        let value = 'ab'
        component.onChangeInputValue(value);
        expect(component.involvedService.suggestionsArrFiltered.length).toBeFalsy();

        value = 'abc'
        component.onChangeInputValue(value);
        expect(component.involvedService.suggestionsArrFiltered.length).toBeFalsy();
    });


    it('should call checkNotifyCxSp', () => {
        component.daelAssurerNotifyEmail = false;
        let notifyType = 'cxSpEmail';
        component.checkNotifyCxSp(notifyType);
        expect(component.daelAssurerNotifyEmail).toBeTruthy();

        notifyType = 'cxSpWebex';
        component.daelAssurerNotifyWebex = false;
        component.checkNotifyCxSp(notifyType);
        expect(component.daelAssurerNotifyWebex).toBeTruthy();
    });


    it('should call updateCxSpRowObject', () => {
        let obj = { notification: 'Yes', access: 'ro', webexNotification: 'Y' };
        let updateType = 'notification'
        component.updateCxSpRowObject(obj, updateType);
        expect(obj.notification).toEqual('No');

        obj = { notification: 'No', access: 'ro', webexNotification: 'Y' };
        updateType = 'notification'
        component.updateCxSpRowObject(obj, updateType);
        expect(obj.notification).toEqual('Yes');

        obj = { access: 'ro', notification: 'No', webexNotification: 'Y' };
        updateType = 'accessType'
        component.updateCxSpRowObject(obj, updateType);
        expect(obj.access).toEqual('rw');

        obj = { access: 'rw', notification: 'No', webexNotification: 'Y' };
        updateType = 'accessType'
        component.updateCxSpRowObject(obj, updateType);
        expect(obj.access).toEqual('ro');

        obj = { access: 'rw', notification: 'No', webexNotification: 'Y' };
        updateType = 'webexTeam'
        component.updateCxSpRowObject(obj, updateType);
        expect(obj.webexNotification).toEqual('N');

        obj = { access: 'rw', notification: 'No', webexNotification: 'N' };
        updateType = 'webexTeam'
        component.updateCxSpRowObject(obj, updateType);
        expect(obj.webexNotification).toEqual('Y');
    });

    it('should call onSuggestedItemsClick with exisitng value', () => {
        component.selectedCxDealAssurer = [{ fullName: 'rbiwani' }];
        let selectedValue = { fullName: 'rbiwani' };
        component.onSuggestedItemsClick(selectedValue);
        expect(component.searchCxDealAssurer).toBeFalsy();
    });

    it('should call onSuggestedItemsClick with different value', fakeAsync(() => {
        component.selectedCxDealAssurer = [{ fullName: 'rbiwani2' }];
        let selectedValue = { fullName: 'rbiwani' };
        component.onSuggestedItemsClick(selectedValue);
        tick(501)
        expect(component.selectedCxDealAssurer.length).toBeTruthy();
    }));

    it('should call showList', () => {
        component.showList();
        expect(component.searchCxDealAssurer).toBeFalsy();
    });

    it('should call hideList', fakeAsync(() => {
        component.hideList();
        tick(500)
        expect(component.displayList).toBeFalsy();
    }));

    it('should call addMembers with existing member', () => {
        component.dealAssurerAccessType = 'rw';
        component.selectedCxDealAssurer = [{ access: 'rw', notification: 'No', webexNotification: 'Y', fullName: 'Romesh' }]
        component.qualService.qualification.cxDealAssurerTeams = [{ access: 'rw', notification: 'No', webexNotification: 'Y', fullName: 'Romesh' }]
        component.addMembers();
        expect(component.selectedCxDealAssurer).toBeTruthy();

        component.dealAssurerAccessType = 'ro';
        component.selectedCxDealAssurer = [{ access: 'rw', notification: 'No', webexNotification: 'Y', fullName: 'Romesh' }]
        component.qualService.qualification.cxDealAssurerTeams = [{ access: 'rw', notification: 'No', webexNotification: 'Y', fullName: 'Romesh' }]
        component.addMembers();
        expect(component.selectedCxDealAssurer).toBeTruthy();
    });

    it('should call addMembers with new member error true', () => {
        let response = {
            "rid": "99df3abc-88db-4f70-891c-e856ed82f813",
            "user": "mariar",
            "error": true,
            "messages": [
                {
                    "code": "EA146",
                    "text": "Contact emily not found",
                    "severity": "ERROR",
                    "token": [
                        {
                            "name": "ccoId",
                            "value": "emily"
                        }
                    ],
                    "createdAt": "2024-09-26T19:10:46.624+00:00",
                    "createdBy": "mariar",
                    "key": "EA146~ccoId-emily"
                }
            ],
            "currentDate": "2024-09-26T19:10:46.884+00:00"
        }
        component.qualService.qualification.qualID = '98564';
        component.appDataService.userInfo.userId = 'rbinwani';
        const displayMessagesFromResponse = jest.spyOn(component['messageService'], 'displayMessagesFromResponse')
        let involvedService = fixture.debugElement.injector.get(WhoInvolvedService);
        jest.spyOn(involvedService, "contactAPICall").mockReturnValue(of(response));
        component.dealAssurerAccessType = 'rw';
        component.selectedCxDealAssurer = [{ access: 'rw', notification: 'No', webexNotification: 'Y', fullName: 'Romesh B' }]
        component.qualService.qualification.cxDealAssurerTeams = [{ access: 'rw', notification: 'No', webexNotification: 'Y', fullName: 'Romesh' }]
        component.addMembers();
        expect(displayMessagesFromResponse).toHaveBeenCalled();
    });


    it('should call addMembers with new member error false', () => {
        let response = {
            "rid": "99df3abc-88db-4f70-891c-e856ed82f813",
            "user": "mariar",
            "error": false,
            data: [{ access: 'rw', notification: 'No', webexNotification: 'Y', fullName: 'Romesh B' }],
            "currentDate": "2024-09-26T19:10:46.884+00:00"
        }
        component.qualService.qualification.qualID = '98564';
        component.appDataService.userInfo.userId = 'rbinwani';
        const checkboxSelectors = jest.spyOn(component, 'checkboxSelectors')
        let involvedService = fixture.debugElement.injector.get(WhoInvolvedService);
        jest.spyOn(involvedService, "contactAPICall").mockReturnValue(of(response));
        component.dealAssurerAccessType = 'rw';
        component.selectedCxDealAssurer = [{ access: 'rw', notification: 'No', webexNotification: 'Y', fullName: 'Romesh B' }]
        component.qualService.qualification.cxDealAssurerTeams = [{ access: 'rw', notification: 'No', webexNotification: 'Y', fullName: 'Romesh' }]
        component.addMembers();
        expect(checkboxSelectors).toHaveBeenCalled();
    });


    // it('should call updateNotifyAllCxSp with error true', () => {
    //     let checkboxType = 'email';
    //     component.daelAssurerNotifyEmail = false;
    //     let response = {
    //         "rid": "99df3abc-88db-4f70-891c-e856ed82f813",
    //         "user": "mariar",
    //         "error": true,
    //         "messages": [
    //             {
    //                 "code": "EA146",
    //                 "text": "Contact emily not found",
    //                 "severity": "ERROR",
    //                 "token": [
    //                     {
    //                         "name": "ccoId",
    //                         "value": "emily"
    //                     }
    //                 ],
    //                 "createdAt": "2024-09-26T19:10:46.624+00:00",
    //                 "createdBy": "mariar",
    //                 "key": "EA146~ccoId-emily"
    //             }
    //         ],
    //         "currentDate": "2024-09-26T19:10:46.884+00:00"
    //     }
    //     component.qualService.qualification.qualID = '98564';
    //     component.appDataService.userInfo.userId = 'rbinwani';
    //     let displayMessagesFromResponse = jest.spyOn(component['messageService'], 'displayMessagesFromResponse')
    //     let involvedService = fixture.debugElement.injector.get(WhoInvolvedService);
    //     jest.spyOn(involvedService, "contactAPICall").mockReturnValue(of(response));
    //     component.dealAssurerAccessType = 'rw';
    //     component.selectedCxDealAssurer = [{ access: 'rw', notification: 'No', webexNotification: 'Y', fullName: 'Romesh B' }]
    //     component.qualService.qualification.cxDealAssurerTeams = [{ access: 'rw', notification: 'No', webexNotification: 'Y', fullName: 'Romesh' }]
    //     component.updateNotifyAllCxSp(checkboxType);
    //     expect(displayMessagesFromResponse).toHaveBeenCalled();


    //     checkboxType = 'webex';
    //     component.daelAssurerNotifyAllWebex = false;
    //     response = {
    //         "rid": "99df3abc-88db-4f70-891c-e856ed82f813",
    //         "user": "mariar",
    //         "error": true,
    //         "messages": [
    //             {
    //                 "code": "EA146",
    //                 "text": "Contact emily not found",
    //                 "severity": "ERROR",
    //                 "token": [
    //                     {
    //                         "name": "ccoId",
    //                         "value": "emily"
    //                     }
    //                 ],
    //                 "createdAt": "2024-09-26T19:10:46.624+00:00",
    //                 "createdBy": "mariar",
    //                 "key": "EA146~ccoId-emily"
    //             }
    //         ],
    //         "currentDate": "2024-09-26T19:10:46.884+00:00"
    //     }
    //     component.qualService.qualification.qualID = '98564';
    //     component.appDataService.userInfo.userId = 'rbinwani';
    //     displayMessagesFromResponse = jest.spyOn(component['messageService'], 'displayMessagesFromResponse')
    //     involvedService = fixture.debugElement.injector.get(WhoInvolvedService);
    //     jest.spyOn(involvedService, "contactAPICall").mockReturnValue(of(response));
    //     component.dealAssurerAccessType = 'rw';
    //     component.selectedCxDealAssurer = [{ access: 'rw', notification: 'No', webexNotification: 'Y', fullName: 'Romesh B' }]
    //     component.qualService.qualification.cxDealAssurerTeams = [{ access: 'rw', notification: 'No', webexNotification: 'Y', fullName: 'Romesh' }]
    //     component.updateNotifyAllCxSp(checkboxType);
    //     expect(displayMessagesFromResponse).toHaveBeenCalled();
    // });


    // it('should call selectedItem', () => {
    //     let member = { access: 'rw', notification: 'No', webexNotification: 'Y', fullName: 'Romesh B' }
    //     component.selectedItem(member)
    //     expect(component.selectedCxDealAssurer).toBeTruthy();
    // });

});