import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { EditDealIdComponent } from "./edit-deal-id.component";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Renderer2 } from "@angular/core";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule } from "@angular/common/http";
import { LocaleService } from "@app/shared/services/locale.service";
import { SearchPipe } from "@app/shared/pipes/search.pipe";
import { EaRestService } from "ea/ea-rest.service";
import { ConstantsService } from "@app/shared/services/constants.service";
import { EaService } from "ea/ea.service";
import { MessageService } from "@app/shared/services/message.service";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { QualificationsService } from "@app/qualifications/qualifications.service";
import { AppDataService } from "@app/shared/services/app.data.service";
import { PermissionService } from "@app/permission.service";
import { ProposalDataService } from "@app/proposal/proposal.data.service";
import { EditQualificationService } from "../edit-qualification/edit-qualification.service";
import { CreateProposalService } from "@app/proposal/create-proposal/create-proposal.service";
import { WhoInvolvedService } from "@app/qualifications/edit-qualifications/who-involved/who-involved.service";
import { HttpCancelService } from "@app/shared/services/http.cancel.service";
import { UtilitiesService } from "@app/shared/services/utilities.service";
import { AppRestService } from "@app/shared/services/app.rest.service";
import { CurrencyPipe } from "@angular/common";
import { BlockUiService } from "@app/shared/services/block.ui.service";
import { CopyLinkService } from "@app/shared/copy-link/copy-link.service";
import { FiltersService } from "@app/dashboard/filters/filters.service";
import { IbSummaryService } from "@app/ib-summary/ib-summary.service";
import { ProductSummaryService } from "@app/dashboard/product-summary/product-summary.service";
import { ProposalPollerService } from "@app/shared/services/proposal-poller.service";
import { of } from "rxjs";

const NgbActiveModalMock = {
    close: jest.fn().mockReturnValue('close')
      
   }

describe('EditDealIdComponent', () => {
    let component: EditDealIdComponent;
    let fixture: ComponentFixture<EditDealIdComponent>;


    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
          declarations: [ EditDealIdComponent , SearchPipe],
          providers: [LocaleService,ConstantsService,EaService,EaRestService,
            Renderer2,MessageService,NgbModal, { provide: NgbActiveModal, useValue: NgbActiveModalMock }, QualificationsService, AppDataService, 
            PermissionService, UtilitiesService, AppRestService, CurrencyPipe, BlockUiService, CopyLinkService, 
            ProposalDataService, ProposalPollerService, SearchPipe, EditQualificationService, CreateProposalService, IbSummaryService, ProductSummaryService,
            WhoInvolvedService , HttpCancelService, FiltersService],
          imports: [HttpClientModule,  RouterTestingModule.withRoutes([
            { path: "qualifications", redirectTo: "" }])],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditDealIdComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });

      it('should create', () => {
        expect(component).toBeTruthy();
      });
    
      it('should call ngoninit', () => {
        component.ngOnInit()
        expect(component.oldQualName).toBeFalsy();
      });

      it('should call matchDealId', () => {
        component.matchDealId()
        expect(component.disableUpdateBtn).toBeTruthy();
      });

      it('should call updateDealLookUpID', () => {
        component.updateDealLookUpID()
        expect(component.disableUpdateBtn).toBeTruthy();
      });

      it('should call updateQualName', () => {
        component.qualEAQualificationName = 'tt'
        component.updateQualName()
        expect(component.disableUpdateBtn).toBeFalsy();
      });


      it('should call showLookup with error', () => {
        component.qualEADealId = '1245677';
        component.appDataService.archName = 'DNA';
        component.appDataService.userInfo.userId = 'mariar';
        component.appDataService.customerID = 1236;
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
        let productSummaryService = fixture.debugElement.injector.get(ProductSummaryService);
        jest.spyOn(productSummaryService, "showProspectDealLookUp").mockReturnValue(of(response));
        component.showLookup('')
        expect(component.qualificationNameError).toBeTruthy();
      });

      it('should call showLookup without error', () => {
        component.qualEADealId = '1245677';
        component.appDataService.archName = 'DNA';
        component.appDataService.userInfo.userId = 'mariar';
        component.appDataService.customerID = 1236;
            let response = {
            "rid": "99df3abc-88db-4f70-891c-e856ed82f813",
            "user": "mariar",
            "error": false,
            "data": {
                "dealDetails": {'dealId': '123456'}
            },
            "currentDate": "2024-09-26T19:10:46.884+00:00"
        }
        let productSummaryService = fixture.debugElement.injector.get(ProductSummaryService);
        jest.spyOn(productSummaryService, "showProspectDealLookUp").mockReturnValue(of(response));
        component.showLookup('')
        expect(component.qualificationNameError).toBeFalsy();
      });


      it('should call updateQual with error', () => {
        component.qualEADealId = '1245677';
        component.appDataService.archName = 'DNA';
        component.appDataService.userInfo.userId = 'mariar';
        component.appDataService.customerID = 1236;
        component.qualEAQualificationName = '2133ww3';
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
        // const displayMessagesFromResponse = jest.spyOn(component['messageService'], 'displayMessagesFromResponse')
        let qualService = fixture.debugElement.injector.get(QualificationsService);
        jest.spyOn(qualService, "validateQualName").mockReturnValue(of(response));
        component.updateQual()
        expect(component.qualService.qualification.name).toBeFalsy();
      });

      it('should call updateQual without error and qualcount is not 0', () => {
        component.qualEADealId = '1245677';
        component.appDataService.archName = 'DNA';
        component.appDataService.userInfo.userId = 'mariar';
        component.appDataService.customerID = 1236;
        component.qualEAQualificationName = '2133ww3';
            let response = {
            "rid": "99df3abc-88db-4f70-891c-e856ed82f813",
            "user": "mariar",
            "error": false,
            "qualCount": 1,
            "currentDate": "2024-09-26T19:10:46.884+00:00"
        }
        // const displayMessagesFromResponse = jest.spyOn(component['messageService'], 'displayMessagesFromResponse')
        let qualService = fixture.debugElement.injector.get(QualificationsService);
        jest.spyOn(qualService, "validateQualName").mockReturnValue(of(response));
        component.updateQual()
        expect(component.qualService.qualification.name).toBeFalsy();
      });

      it('should call updateQual without error and qualcount is 0 and other api called with error', () => {
        component.qualEADealId = '1245677';
        component.appDataService.archName = 'DNA';
        component.appDataService.userInfo.userId = 'mariar';
        component.appDataService.customerID = 1236;
        component.qualEAQualificationName = '2133ww3';
            let response = {
            "rid": "99df3abc-88db-4f70-891c-e856ed82f813",
            "user": "mariar",
            "error": false,
            "qualCount": 0,
            "currentDate": "2024-09-26T19:10:46.884+00:00"
        }
        let response2 = {
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
        // const displayMessagesFromResponse = jest.spyOn(component['messageService'], 'displayMessagesFromResponse')
        let qualService = fixture.debugElement.injector.get(QualificationsService);
        jest.spyOn(qualService, "validateQualName").mockReturnValue(of(response));
        jest.spyOn(qualService, "updateQual").mockReturnValue(of(response2));
        component.updateQual()
        expect(component.qualService.qualification.name).toBeFalsy();
      });


      it('should call updateQual without error and qualcount is 0 and other api called without error', () => {
        component.qualEADealId = '1245677';
        component.appDataService.archName = 'DNA';
        component.appDataService.userInfo.userId = 'mariar';
        component.appDataService.customerID = 1236;
        component.qualEAQualificationName = '2133ww3';
            let response = {
            "rid": "99df3abc-88db-4f70-891c-e856ed82f813",
            "user": "mariar",
            "error": false,
            "qualCount": 0,
            "currentDate": "2024-09-26T19:10:46.884+00:00"
        }
        let response2 = {
            "rid": "99df3abc-88db-4f70-891c-e856ed82f813",
            "user": "mariar",
            "error": false,
            "qualId": '1245677',
             "qualStatus": 'In-progress',
            "currentDate": "2024-09-26T19:10:46.884+00:00"
        }
        // const displayMessagesFromResponse = jest.spyOn(component['messageService'], 'displayMessagesFromResponse')
        let qualService = fixture.debugElement.injector.get(QualificationsService);
        jest.spyOn(qualService, "validateQualName").mockReturnValue(of(response));
        jest.spyOn(qualService, "updateQual").mockReturnValue(of(response2));
        component.updateQual()
        expect(component.qualService.qualification.qualID).toBeFalsy();
      });

      it('should call updateQual with error 2', () => {
        component.qualEADealId = '1245677';
        component.appDataService.archName = 'DNA';
        component.appDataService.userInfo.userId = 'mariar';
        component.appDataService.customerID = 1236;
        component.qualEAQualificationName = '2133ww3';
        component.oldQualName = '2133ww3';
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
        // const displayMessagesFromResponse = jest.spyOn(component['messageService'], 'displayMessagesFromResponse')
        let qualService = fixture.debugElement.injector.get(QualificationsService);
        jest.spyOn(qualService, "updateQual").mockReturnValue(of(response));
        component.updateQual()
        expect(component.oldQualName).toBeTruthy();
      });

      it('should call updateQual without error in response 2', () => {
        component.qualEADealId = '1245677';
        component.appDataService.archName = 'DNA';
        component.appDataService.userInfo.userId = 'mariar';
        component.appDataService.customerID = 1236;
        component.qualEAQualificationName = '2133ww3';
        component.eaQualDescription = 'test';
        component.oldQualName = '2133ww3';
            let response = {
            "rid": "99df3abc-88db-4f70-891c-e856ed82f813",
            "user": "mariar",
            "error": false,
            "qualId": '1245677',
             "qualStatus": 'In-progress',
            "currentDate": "2024-09-26T19:10:46.884+00:00"
        }
        // const displayMessagesFromResponse = jest.spyOn(component['messageService'], 'displayMessagesFromResponse')
        let qualService = fixture.debugElement.injector.get(QualificationsService);
        jest.spyOn(qualService, "updateQual").mockReturnValue(of(response));
        component.updateQual()
        expect(component.eaQualDescription).toBeTruthy();
      });

      it('should call addSpecialist with alreadyAdded true', () => {
        component.qualService.qualification.extendedsalesTeam = [
            {
              "name": "Corey Freeze",
              "firstName": "Corey",
              "lastName": "Freeze",
              "email": "cfreeze@cisco.com",
              "ccoId": "cfreeze",
              "access": "rw",
              "notification": "Yes",
              "webexNotification": "Y",
              "notifyByWelcomeKit": "Y",
              "cam": true,
              "mailer": false,
              "createdBy": "mariar",
              "createdAt": "2024-07-16T18:26:23.785+00:00",
              "partner": false,
              "defaultSelection": false
            }
          ]
        component.dealIDData = {
            accountManager: {
                "name": "Corey Freeze",
              "firstName": "Corey",
              "lastName": "Freeze",
              "email": "cfreeze@cisco.com",
              "userId": "cfreeze",
            }
        }
        component.addSpecialist()
        expect(component.dealIDData).toBeTruthy();
      });

      it('should call addSpecialist with response', () => {
        component.qualService.qualification.extendedsalesTeam = [
            {
              "name": "Corey Freezeee",
              "firstName": "Corey",
              "lastName": "Freeze",
              "email": "cfreeze@cisco.com",
              "ccoId": "cfreeze",
              "access": "rw",
              "notification": "Yes",
              "webexNotification": "Y",
              "notifyByWelcomeKit": "Y",
              "cam": true,
              "mailer": false,
              "createdBy": "mariar",
              "createdAt": "2024-07-16T18:26:23.785+00:00",
              "partner": false,
              "defaultSelection": false
            }
          ]
        component.dealIDData = {
            accountManager: {
                "name": "Corey Freeze",
              "firstName": "Corey",
              "lastName": "Freeze",
              "email": "cfreeze@cisco.com",
              "userId": "cfreeze",
            }
        }

        let response = {
            data: [{
                "name": "Corey Freezeee",
                "firstName": "Corey",
                "lastName": "Freeze",
                "email": "cfreeze@cisco.com",
                "ccoId": "cfreeze",
                "access": "rw",
                "notification": "Yes",
                "webexNotification": "Y",
                "notifyByWelcomeKit": "Y",
                "cam": true,
                "mailer": false,
                "createdBy": "mariar",
                "createdAt": "2024-07-16T18:26:23.785+00:00",
                "partner": false,
                "defaultSelection": false
              }]
        }
        let involvedService = fixture.debugElement.injector.get(WhoInvolvedService);
        jest.spyOn(involvedService, "contactAPICall").mockReturnValue(of(response));
        component.addSpecialist()
        expect(component.qualService.qualification.extendedsalesTeam.length).toBeTruthy();
      });


      // it('should call setQualificationValues', () => {    
      //     component.qualEAQualificationName = '12345';
      //     component.eaQualDescription = 'ts';
      //   component.dealIDData = {
      //       "id": "97722774",
      //       "dealId": "97722774",
      //       "dealScope": 3,
      //       "dealStatusDesc": "Qualified",
      //       "optyName": "Deal-2",
      //       "accountName": "FRANCISCAN ALLIANCE INC",
      //       "accountAddress": "1500 ALBANY ST, STE 1001, BEECH GROVE, IN, 46107, USA",
      //       "accountAddressDetail": {
      //         "addressLine1": "1500 ALBANY ST",
      //         "addressLine2": "STE 1001",
      //         "city": "BEECH GROVE",
      //         "state": "IN",
      //         "zip": "46107",
      //         "country": "USA"
      //       },
      //       "bookDate": "2024-08-10T00:00:00.000-0700",
      //       "optyOwner": "mariar",
      //       "customerGuId": 35337,
      //       "customerCrPartyId": 201250882,
      //       "isoCountryCode": "US",
      //       "primaryPartner": "ConvergeOne, Inc.",
      //       "partnerContact": [
      //         {
      //           "partyName": "ConvergeOne, Inc.",
      //           "partyId": 639324
      //         }
      //       ],
      //       accountManager: {
      //           "name": "Corey Freeze",
      //         "firstName": "Corey",
      //         "lastName": "Freeze",
      //         "email": "cfreeze@cisco.com",
      //         "userId": "cfreeze",
      //       },
      //       "dealType": 3,
      //       "createdOn": "16-Jul-2024",
      //       "updatedOn": "16-Jul-2024",
      //       "customerType": "PUBLIC",
      //       "changeSubscriptionDeal": false,
      //       "globalDealScope": false,
      //       "eadeal": true,
      //       "changeSubscriptionDirectCustomerDeal": false,
      //       "partnerDealType": true
      //     }
      //     component.appDataService.subHeaderData = {
      //       moduleName: '',
      //       custName: '',
      //       subHeaderVal: []
      //     }
      //   component.setQualificationValues()
      //   expect(component.qualService.qualification.customerInfo.preferredLegalName).toBeTruthy();

      //   // component.dealIDData.accountManager = undefined;
      //   // component.setQualificationValues()
      //   // expect(component.qualService.qualification.accountManagerName).toBeFalsy();
      // });
});