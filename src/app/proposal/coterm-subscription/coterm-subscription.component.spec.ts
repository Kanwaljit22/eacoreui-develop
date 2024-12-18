import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { CotermSubscriptionComponent } from "./coterm-subscription.component";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Renderer2 } from "@angular/core";
import { SearchPipe } from "@app/shared/pipes/search.pipe";
import { LocaleService } from "@app/shared/services/locale.service";
import { DashboardService } from "@app/dashboard/dashboard.service";
import { PermissionService } from "@app/permission.service";
import { ProposalDataService } from "../proposal.data.service";
import { TcoDataService } from "@app/tco/tco.data.service";
import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";
import { WhoInvolvedService } from "@app/qualifications/edit-qualifications/who-involved/who-involved.service";
import { HttpCancelService } from "@app/shared/services/http.cancel.service";
import { ConstantsService } from "@app/shared/services/constants.service";
import { EaService } from "ea/ea.service";
import { ManageTeamMembersPipe } from "@app/shared/pipes/manage-team-members.pipe";
import { ManageTeamMembersComponent } from "@app/modal/manage-team-members/manage-team-members.component";
import { UtilitiesService } from "@app/shared/services/utilities.service";
import { AppRestService } from "@app/shared/services/app.rest.service";
import { MessageService } from "@app/shared/services/message.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { QualificationsService } from "@app/qualifications/qualifications.service";
import { EaRestService } from "ea/ea-rest.service";
import { ProposalPollerService } from "@app/shared/services/proposal-poller.service";
import { CurrencyPipe } from "@angular/common";
import { EditQualificationService } from "@app/modal/edit-qualification/edit-qualification.service";
import { AppDataService } from "@app/shared/services/app.data.service";
import { BlockUiService } from "@app/shared/services/block.ui.service";
import { CopyLinkService } from "@app/shared/copy-link/copy-link.service";
import { CreateProposalService } from "../create-proposal/create-proposal.service";
import { ProductSummaryService } from "@app/dashboard/product-summary/product-summary.service";
import { FiltersService } from "@app/dashboard/filters/filters.service";
import { of } from "rxjs";






describe('CotermSubscriptionComponent', () => {
    let component: CotermSubscriptionComponent;
    let fixture: ComponentFixture<CotermSubscriptionComponent>;


    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
          declarations: [ CotermSubscriptionComponent , SearchPipe, ManageTeamMembersPipe, ManageTeamMembersComponent],
          providers: [LocaleService,ConstantsService,EaService,EaRestService,
            DashboardService, Renderer2,MessageService,NgbModal,QualificationsService, AppDataService, 
            PermissionService, UtilitiesService, AppRestService, CurrencyPipe, BlockUiService, CopyLinkService, 
            ProposalDataService, ProposalPollerService, SearchPipe, EditQualificationService, CreateProposalService, 
            TcoDataService, WhoInvolvedService , HttpCancelService, ManageTeamMembersPipe, ProductSummaryService, FiltersService],
          imports: [HttpClientModule,  RouterTestingModule.withRoutes([
            { path: "qualifications", redirectTo: "" }])],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CotermSubscriptionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });

      it('should create', () => {
        expect(component).toBeTruthy();
      });

      it('should call ngoninit', () => {
        component.createProposalPage = false;
        component.ngOnInit()
        expect(component.selectedSubId).toBeFalsy();

        component.proposalDataService.proposalDataObject.proposalData.coTerm = {'subscriptionId':  "SR12345", 'eaEndDate': "20233455" , 'coTerm': true}
        component.ngOnInit()
        expect(component.selectedSubId).toBeTruthy();
      });

      it('should call lookupSubscriptionModal', () => {
        component.lookupSubscriptionModal()
        expect(component.displayLookupModal).toBeTruthy();
      });

      it('should call hideLookup', () => {
        component.hideLookup()
        expect(component.subscriptionData.length).toBeFalsy();
      });

      it('should call onClickOutside', () => {
        component.createQualPage = false;
        component.initiateRenewalPage = false;
        const hideLookup =  jest.spyOn(component, 'hideLookup')
        component.onClickOutside()
        expect(hideLookup).toHaveBeenCalled();
      });

      it('should call checkSubFromLookUpForRenewal', () => {
        let subId = "SR345678";
        let subIdList = ["SR123456"];
        component.checkSubFromLookUpForRenewal(subId, subIdList)
        expect(component.isSubAlreadyPresent).toBeFalsy();

        subId = "SR345678";
        subIdList = ["SR345678"];
        component.checkSubFromLookUpForRenewal(subId, subIdList)
        expect(component.isSubAlreadyPresent).toBeTruthy();
      });

      it('should call updateLookUpSubscription', () => {
        component.updateLookUpSubscription("")
        expect(component.subscriptionData.length).toBeFalsy();
      });


      it('should call checkSubscriptionValidity', () => {
        let dataObj = {customerMatched: false}
        component.checkSubscriptionValidity(dataObj)
        expect(component.isSubCustmerMacthing).toBeFalsy();


        dataObj = {customerMatched: true}
        component.checkSubscriptionValidity(dataObj)
        expect(component.isSubCustmerMacthing).toBeTruthy();
      });

      it('should call checkSelectionForRenewalLookUp', () => {
        const sub = {subscriptionId: "SR2345", selected: false};
        component.subscriptionList = [{subscriptionId: "SR2345", selected: false}]
        
        component.checkSelectionForRenewalLookUp([],sub, '', '')
        expect(component.subscriptionList[0].selected).toBeTruthy();

        component.subscriptionList = [{subscriptionId: "SR23456", selected: false}]
        
        component.checkSelectionForRenewalLookUp([],sub, '', '')
        expect(component.subscriptionIdList.length).toBeTruthy();
        
      });

      it('should call checkSelectionForRenewalLookUp', () => {
        const sub = {subscriptionId: "SR2345", selected: false};
        component.subscriptionList = [{subscriptionId: "SR2345", selected: false}]
        component.initiateRenewalPage = true;
        const hideLookup =  jest.spyOn(component, 'hideLookup')
        component.selectSubscription([], sub, "list")
        expect(hideLookup).toHaveBeenCalled();

        component.initiateRenewalPage = false;
        component.selectSubscription([], sub, "list")
        expect(hideLookup).toHaveBeenCalled();
        
      });


      it('should call checkSelectionForRenewalLookUp', () => {
        const sub = {subscriptionId: "SR2345", selected: false};
        component.subscriptionList = [{subscriptionId: "SR2345", selected: false}]
        const checkDeselectionForRenewalLookUp =  jest.spyOn(component, 'checkDeselectionForRenewalLookUp')
        component.subscriptionsSelectForRenewalFromLookUp([], sub, "list", 'deselect')
        expect(checkDeselectionForRenewalLookUp).toHaveBeenCalled();

        component.subscriptionList = [{subscriptionId: "SR2345", selected: false}]
        component.subscriptionsSelectForRenewalFromLookUp([], sub, "list", '')
        expect(checkDeselectionForRenewalLookUp).toHaveBeenCalled();

        component.subscriptionList = []
        component.subscriptionsSelectForRenewalFromLookUp([], sub, "list", '')
        expect(component.subscriptionIdList.length).toBeTruthy();
        
      });

      it('should call deselectSubscription', () => {
        let sub = {subscriptionId: "SR2345", selected: true};
        component.initiateRenewalPage = true;
        component.deselectSubscription([], sub, "list")
        expect(sub.selected).toBeFalsy();

        component.initiateRenewalPage = false;
         component.createQualPage = false;
        component.deselectSubscription([], sub, "list")
        expect(component.subscriptionId).toBeFalsy();
        
      });


      it('should call continueWithSelectedSubFromLookUp', () => {
        component.lookedUpSubscriptionData = {subscriptionId: "SR2345", selected: true}; 
        component.continueWithSelectedSubFromLookUp()
        expect(component.displayLookupModal).toBeFalsy();
        
        component.initiateRenewalPage = true;
        component.isSubCustmerMacthing = true;
        component.subscriptionList = [];
        component.continueWithSelectedSubFromLookUp()
        expect(component.subscriptionIdList.length).toBeTruthy();
      });


      it('should call continueWithSubId', () => {
        component.selectedSubId = "SR23456"
        component.continueWithSubId();
        expect(component.selectedSubId).toBeTruthy();
      });

      it('should call subscriptionLookup with no api call', () => {
        component.subscriptionId = ""
        component.subscriptionLookup();
        expect(component.subscriptionData.length).toBeFalsy();
      });

      it('should call subscriptionLookup with error in api call', () => {
        const displayMessagesFromResponse = jest.spyOn(component['messageService'], 'displayMessagesFromResponse')
        component.subscriptionId = "SR2345"
        let response = {
            "rid": "99df3abc-88db-4f70-891c-e856ed82f813",
            "user": "mariar",
            "error": true,
            // "data": {subscriptionId: "SR2345", selected: true},
            "currentDate": "2024-09-26T19:10:46.884+00:00"
        }
        let createProposalService = fixture.debugElement.injector.get(CreateProposalService);
        jest.spyOn(createProposalService, "subscriptionLookup").mockReturnValue(of(response));
        component.subscriptionLookup();
        expect(component.subscriptionData.length).toBeFalsy();
        expect(displayMessagesFromResponse).toHaveBeenCalled();
      });


      it('should call subscriptionLookup with no error and data in api call', () => {
        const displayMessagesFromResponse = jest.spyOn(component['messageService'], 'displayMessagesFromResponse')
        component.subscriptionId = "SR2345"
        let response = {
            "rid": "99df3abc-88db-4f70-891c-e856ed82f813",
            "user": "mariar",
            "error": false,
            // "data": {subscriptionId: "SR2345", selected: true},
            "currentDate": "2024-09-26T19:10:46.884+00:00"
        }
        let createProposalService = fixture.debugElement.injector.get(CreateProposalService);
        jest.spyOn(createProposalService, "subscriptionLookup").mockReturnValue(of(response));
        component.subscriptionLookup();
        expect(component.noDataFound).toBeTruthy();
      });

      it('should call subscriptionLookup with data in api call', () => {
        component.subscriptionId = "SR2345"
        let response = {
            "rid": "99df3abc-88db-4f70-891c-e856ed82f813",
            "user": "mariar",
            "error": false,
            "data": {subscriptionId: "SR2345", selected: true},
            "currentDate": "2024-09-26T19:10:46.884+00:00"
        }
        let createProposalService = fixture.debugElement.injector.get(CreateProposalService);
        jest.spyOn(createProposalService, "subscriptionLookup").mockReturnValue(of(response));
        component.subscriptionLookup();
        expect(component.noDataFound).toBeFalsy();
      });

      it('should call subscriptionLookup with data in api call 2', () => {
        component.subscriptionId = "SR2345"
        let response = {
            "rid": "99df3abc-88db-4f70-891c-e856ed82f813",
            "user": "mariar",
            "error": false,
            "data": {subscriptions: [{subscriptionId: "SR2345", selected: true}]},
            "currentDate": "2024-09-26T19:10:46.884+00:00"
        }
        let createProposalService = fixture.debugElement.injector.get(CreateProposalService);
        jest.spyOn(createProposalService, "subscriptionLookup").mockReturnValue(of(response));
        component.subscriptionLookup();
        expect(component.subscriptionData.length).toBeTruthy();
      });

    //   it('call focusSubIdInput',() =>{
    //     component.focusSubIdInput('test')
    //   });
});