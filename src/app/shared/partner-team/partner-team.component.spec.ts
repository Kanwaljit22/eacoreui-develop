import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { PartnerTeamComponent } from "./partner-team.component";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Renderer2 } from "@angular/core";
import { SearchPipe } from "../pipes/search.pipe";
import { ManageTeamMembersPipe } from "../pipes/manage-team-members.pipe";
import { ManageTeamMembersComponent } from "@app/modal/manage-team-members/manage-team-members.component";
import { LocaleService } from "../services/locale.service";
import { ConstantsService } from "../services/constants.service";
import { EaService } from "ea/ea.service";
import { EaRestService } from "ea/ea-rest.service";
import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";
import { DashboardService } from "@app/dashboard/dashboard.service";
import { MessageService } from "../services/message.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { QualificationsService } from "@app/qualifications/qualifications.service";
import { AppDataService } from "../services/app.data.service";
import { PermissionService } from "@app/permission.service";
import { UtilitiesService } from "../services/utilities.service";
import { AppRestService } from "../services/app.rest.service";
import { CurrencyPipe } from "@angular/common";
import { BlockUiService } from "../services/block.ui.service";
import { CopyLinkService } from "../copy-link/copy-link.service";
import { ProposalDataService } from "@app/proposal/proposal.data.service";
import { ProposalPollerService } from "../services/proposal-poller.service";
import { EditQualificationService } from "@app/modal/edit-qualification/edit-qualification.service";
import { CreateProposalService } from "@app/proposal/create-proposal/create-proposal.service";
import { TcoDataService } from "@app/tco/tco.data.service";
import { WhoInvolvedService } from "@app/qualifications/edit-qualifications/who-involved/who-involved.service";
import { HttpCancelService } from "../services/http.cancel.service";
import { ProductSummaryService } from "@app/dashboard/product-summary/product-summary.service";
import { FiltersService } from "@app/dashboard/filters/filters.service";
import { of } from "rxjs";




describe('PartnerTeamComponent', () => {
    let component: PartnerTeamComponent;
    let fixture: ComponentFixture<PartnerTeamComponent>;  

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
          declarations: [ PartnerTeamComponent , SearchPipe, ManageTeamMembersPipe, ManageTeamMembersComponent],
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
        fixture = TestBed.createComponent(PartnerTeamComponent);
        component = fixture.componentInstance;
        component.qualService.qualification.qualID = "208406";
        component.qualService.qualification.distiInitiated = true;
        component.qualService.qualification.partnerTeam = [
            {"name":"Maria Roark","firstName":"Maria","lastName":"Roark","email":"maria.roark@aos5.com","ccoId":"mariar","access":"rw","notification":"Yes","webexNotification":"Y","notifyByWelcomeKit":"Y","cam":false,"mailer":false,"partner":false,"defaultSelection":false},{"name":"nancy lindsay","firstName":"nancy","lastName":"lindsay","email":"maria.roark@aos5.com","ccoId":"00u43oziqa7zypre25d7","access":"rw","notification":"Yes","webexNotification":"Y","notifyByWelcomeKit":"Y","cam":false,"mailer":false,"partner":false,"defaultSelection":false},{"name":"Eric Eliason","firstName":"Eric","lastName":"Eliason","email":"maria.roark@aos5.com","ccoId":"eeliason@convergeone.com","access":"rw","notification":"Yes","webexNotification":"Y","notifyByWelcomeKit":"Y","cam":false,"mailer":false,"partner":false,"defaultSelection":false}
        ]
        component.appDataService.isPatnerLedFlow = true;
        component.filterPartnersTeam = true;
        fixture.detectChanges();
      });

      it('should create', () => {
        expect(component).toBeTruthy();
      });

      it('should ngoninit', () => {
        component.qualService.qualification.qualID = "208406";
        component.qualService.qualification.distiInitiated = true;
        component.qualService.qualification.partnerTeam = [
            {"name":"Maria Roark","firstName":"Maria","lastName":"Roark","email":"maria.roark@aos5.com","ccoId":"mariar","access":"rw","notification":"Yes","webexNotification":"N","notifyByWelcomeKit":"Y","cam":false,"mailer":false,"partner":false,"defaultSelection":false},{"name":"nancy lindsay","firstName":"nancy","lastName":"lindsay","email":"maria.roark@aos5.com","ccoId":"00u43oziqa7zypre25d7","access":"rw","notification":"Yes","webexNotification":"Y","notifyByWelcomeKit":"Y","cam":false,"mailer":false,"partner":false,"defaultSelection":false},{"name":"Eric Eliason","firstName":"Eric","lastName":"Eliason","email":"maria.roark@aos5.com","ccoId":"eeliason@convergeone.com","access":"rw","notification":"Yes","webexNotification":"Y","notifyByWelcomeKit":"Y","cam":false,"mailer":false,"partner":false,"defaultSelection":false}
        ]
        component.appDataService.isPatnerLedFlow = true;
        component.filterPartnersTeam = true;

        const checkboxSelectors =  jest.spyOn(component, 'checkboxSelectors')
        component.ngOnInit()
        expect(component.partnerLedFlow).toBeTruthy();
        expect(component.disableForDisti).toBeFalsy();
        expect(checkboxSelectors).toHaveBeenCalled();

      });

      it('should checkboxSelectors', () => {
        component.qualService.qualification.partnerTeam = [
            {"name":"Maria Roark","firstName":"Maria","lastName":"Roark","email":"maria.roark@aos5.com","ccoId":"mariar","access":"rw","notification":"Yes","webexNotification":"N","notifyByWelcomeKit":"Y","cam":false,"mailer":false,"partner":false,"defaultSelection":false},{"name":"nancy lindsay","firstName":"nancy","lastName":"lindsay","email":"maria.roark@aos5.com","ccoId":"00u43oziqa7zypre25d7","access":"rw","notification":"No","webexNotification":"Y","notifyByWelcomeKit":"Y","cam":false,"mailer":false,"partner":false,"defaultSelection":false},{"name":"Eric Eliason","firstName":"Eric","lastName":"Eliason","email":"maria.roark@aos5.com","ccoId":"eeliason@convergeone.com","access":"rw","notification":"Yes","webexNotification":"Y","notifyByWelcomeKit":"N","cam":false,"mailer":false,"partner":false,"defaultSelection":false}
        ]
        component.checkboxSelectors();
        expect(component.ptNotifyAllWebex).toBeFalsy();
        expect(component.ptNotifyAllEmail).toBeFalsy();
        expect(component.ptNotifyAllWalkme).toBeFalsy();
      });

      it('should onChangePartnerInputValue', () => {
        let selectedValue = ''
        component.onChangePartnerInputValue(selectedValue);

        expect(component.ptNotifyAllWebex).toBeFalsy();
        expect(component.ptNotifyAllEmail).toBeFalsy();


        selectedValue = 'r'
        component.disableForDisti  = false;
        component.partnerDeal = false;
        component.onChangePartnerInputValue(selectedValue);

        expect(component.ptNotifyAllWebex).toBeFalsy();
        expect(component.ptNotifyAllEmail).toBeFalsy();

        // selectedValue = 'ri';
        // component.disableForDisti  = false;
        // component.partnerDeal = true;
        // component.onChangePartnerInputValue(selectedValue);

        // expect(component.ptNotifyAllWebex).toBeTruthy();
        // expect(component.ptNotifyAllEmail).toBeTruthy();
      });

      it('should call searchAndAddPartner response with error', () => {
        let ccoId = 'emily';
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
        component.qualService.qualification.qualID = "208406";
        component.qualService.qualification.distiInitiated = true;
        component.qualService.qualification.partnerTeam = [
            {"name":"Maria Roark","firstName":"Maria","lastName":"Roark","email":"maria.roark@aos5.com","ccoId":"mariar","access":"rw","notification":"Yes","webexNotification":"N","notifyByWelcomeKit":"Y","cam":false,"mailer":false,"partner":false,"defaultSelection":false},{"name":"nancy lindsay","firstName":"nancy","lastName":"lindsay","email":"maria.roark@aos5.com","ccoId":"00u43oziqa7zypre25d7","access":"rw","notification":"Yes","webexNotification":"Y","notifyByWelcomeKit":"Y","cam":false,"mailer":false,"partner":false,"defaultSelection":false},{"name":"Eric Eliason","firstName":"Eric","lastName":"Eliason","email":"maria.roark@aos5.com","ccoId":"eeliason@convergeone.com","access":"rw","notification":"Yes","webexNotification":"Y","notifyByWelcomeKit":"Y","cam":false,"mailer":false,"partner":false,"defaultSelection":false}
        ]
        const displayMessagesFromResponse = jest.spyOn(component['messageService'], 'displayMessagesFromResponse')
        let involvedService = fixture.debugElement.injector.get(WhoInvolvedService);
        jest.spyOn(involvedService, "updatePartnerAPI").mockReturnValue(of(response));

        component.searchAndAddPartner(ccoId);
        expect(displayMessagesFromResponse).toHaveBeenCalled();

      });

      it('should call searchAndAddPartner with existing ccoid', () => {
        let ccoId = 'mariar';
        component.qualService.qualification.qualID = "208406";
        component.qualService.qualification.distiInitiated = true;
        component.qualService.qualification.partnerTeam = [
            {"name":"Maria Roark","firstName":"Maria","lastName":"Roark","email":"maria.roark@aos5.com","ccoId":"mariar","access":"rw","notification":"Yes","webexNotification":"N","notifyByWelcomeKit":"Y","cam":false,"mailer":false,"partner":false,"defaultSelection":false},{"name":"nancy lindsay","firstName":"nancy","lastName":"lindsay","email":"maria.roark@aos5.com","ccoId":"00u43oziqa7zypre25d7","access":"rw","notification":"Yes","webexNotification":"Y","notifyByWelcomeKit":"Y","cam":false,"mailer":false,"partner":false,"defaultSelection":false},{"name":"Eric Eliason","firstName":"Eric","lastName":"Eliason","email":"maria.roark@aos5.com","ccoId":"eeliason@convergeone.com","access":"rw","notification":"Yes","webexNotification":"Y","notifyByWelcomeKit":"Y","cam":false,"mailer":false,"partner":false,"defaultSelection":false}
        ]

        component.searchAndAddPartner(ccoId);
        expect(component.ptNotifyWebex).toBeFalsy();

      });

      it('should call searchAndAddPartner with valid response', () => {
        let ccoId = 'emily';
        let response = {
            "rid": "0a9e73b7-a8ba-4f95-b730-2f2078f26397",
            "user": "mariar",
            "error": false,
            "data": {
                "name": "Eric Eliason",
                "firstName": "Eric",
                "lastName": "Eliason",
                "email": "EEliason@convergeone.com",
                "ccoId": "eeliason@convergeone.com",
                "access": "rw",
                "notification": "Yes",
                "webexNotification": "Y",
                "notifyByWelcomeKit": "Y",
                "cam": false,
                "mailer": false,
                "partner": true,
                "defaultSelection": false,
                "beGeoId": 639324
            },
            "currentDate": "2024-10-01T15:29:23.936+00:00"
        }
        component.qualService.qualification.qualID = "208406";
        component.qualService.qualification.distiInitiated = true;
        component.qualService.qualification.partnerTeam = [
            {"name":"Maria Roark","firstName":"Maria","lastName":"Roark","email":"maria.roark@aos5.com","ccoId":"mariar","access":"rw","notification":"Yes","webexNotification":"N","notifyByWelcomeKit":"Y","cam":false,"mailer":false,"partner":false,"defaultSelection":false},{"name":"nancy lindsay","firstName":"nancy","lastName":"lindsay","email":"maria.roark@aos5.com","ccoId":"00u43oziqa7zypre25d7","access":"rw","notification":"Yes","webexNotification":"Y","notifyByWelcomeKit":"Y","cam":false,"mailer":false,"partner":false,"defaultSelection":false},{"name":"Eric Eliason","firstName":"Eric","lastName":"Eliason","email":"maria.roark@aos5.com","ccoId":"eeliason@convergeone.com","access":"rw","notification":"Yes","webexNotification":"Y","notifyByWelcomeKit":"Y","cam":false,"mailer":false,"partner":false,"defaultSelection":false}
        ]
        let involvedService = fixture.debugElement.injector.get(WhoInvolvedService);
        jest.spyOn(involvedService, "updatePartnerAPI").mockReturnValue(of(response));
        const checkboxSelectors =  jest.spyOn(component, 'checkboxSelectors')

        component.searchAndAddPartner(ccoId);
        expect(component.qualService.qualification.partnerTeam.length).toBeTruthy();
        expect(component.ptNotifyWalkme).toBeTruthy();
        expect(checkboxSelectors).toHaveBeenCalled();
        

      });


      it('should call remove partner api response with error', () => {
        let partner = {name:"Maria Roark",firstName:"Maria",lastName:"Roark",email:"maria.roark@aos5.com",ccoId:"mariar",access:"rw",notification:"Yes",webexNotification:"N",notifyByWelcomeKit:"Y",cam:false,mailer:false,partner:false,"defaultSelection":false}
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
        component.qualService.qualification.qualID = "208406";
        component.qualService.qualification.distiInitiated = true;
        component.qualService.qualification.partnerTeam = [
            {"name":"Maria Roark","firstName":"Maria","lastName":"Roark","email":"maria.roark@aos5.com","ccoId":"mariar","access":"rw","notification":"Yes","webexNotification":"N","notifyByWelcomeKit":"Y","cam":false,"mailer":false,"partner":false,"defaultSelection":false},{"name":"nancy lindsay","firstName":"nancy","lastName":"lindsay","email":"maria.roark@aos5.com","ccoId":"00u43oziqa7zypre25d7","access":"rw","notification":"Yes","webexNotification":"Y","notifyByWelcomeKit":"Y","cam":false,"mailer":false,"partner":false,"defaultSelection":false},{"name":"Eric Eliason","firstName":"Eric","lastName":"Eliason","email":"maria.roark@aos5.com","ccoId":"eeliason@convergeone.com","access":"rw","notification":"Yes","webexNotification":"Y","notifyByWelcomeKit":"Y","cam":false,"mailer":false,"partner":false,"defaultSelection":false}
        ]
        const displayMessagesFromResponse = jest.spyOn(component['messageService'], 'displayMessagesFromResponse')
        let involvedService = fixture.debugElement.injector.get(WhoInvolvedService);
        jest.spyOn(involvedService, "removePartnerAPI").mockReturnValue(of(response));

        component.removePartnerMember(partner);
        expect(displayMessagesFromResponse).toHaveBeenCalled();

      });

      it('should call remove partner api valid response without error', () => {
        let response = {
            "rid": "b8659ba0-a71e-47d3-b33b-7b1d663f3be3",
            "user": "mariar",
            "error": false,
            "currentDate": "2024-10-01T15:29:19.089+00:00"
        }
        component.qualService.qualification.qualID = "208406";
        component.qualService.qualification.distiInitiated = true;
        component.qualService.qualification.partnerTeam = [
            {"name":"Maria Roark","firstName":"Maria","lastName":"Roark","email":"maria.roark@aos5.com","ccoId":"mariar","access":"rw","notification":"Yes","webexNotification":"N","notifyByWelcomeKit":"Y","cam":false,"mailer":false,"partner":false,"defaultSelection":false}
        ]
        let partner = component.qualService.qualification.partnerTeam[0];
        let involvedService = fixture.debugElement.injector.get(WhoInvolvedService);
        jest.spyOn(involvedService, "removePartnerAPI").mockReturnValue(of(response));
        const checkboxSelectors =  jest.spyOn(component, 'checkboxSelectors')

        component.removePartnerMember(partner);
        // expect(component.qualService.qualification.partnerTeam.length).toBeFalsy();
        expect(component.ptNotifyWalkme).toBeTruthy();
        expect(checkboxSelectors).toHaveBeenCalled();

      });


      // it('should call checkNotifyPt', () => {
      //   component.ptNotifyEmail = false;
      //   component.ptNotifyWebex = false;
      //   component.ptNotifyWalkme = false;
      //   let notifyType = component.constansService.EST_EMAIL
      //   component.checkNotifyPt(notifyType);
      //   expect(component.ptNotifyEmail).toBeTruthy();

      //   notifyType = component.constansService.EST_WEBEX
      //   component.checkNotifyPt(notifyType);
      //   expect(component.ptNotifyWebex).toBeTruthy();

      //   notifyType = component.constansService.EST_WALKME
      //   component.checkNotifyPt(notifyType);
      //   expect(component.ptNotifyWalkme).toBeTruthy();
      // });

    //   it('should call updateNotifyAllPt with error in response', () => {
    //     component.ptNotifyAllEmail = true;
    //     component.ptNotifyAllWebex = true;
    //     component.ptNotifyAllWalkme = true;
    //     component.qualService.qualification.qualID = "208406";
    //     component.qualService.qualification.partnerTeam = [
    //         {"name":"Maria Roark","firstName":"Maria","lastName":"Roark","email":"maria.roark@aos5.com","ccoId":"mariar","access":"rw","notification":"Yes","webexNotification":"N","notifyByWelcomeKit":"Y","cam":false,"mailer":false,"partner":false,"defaultSelection":false}
    //     ]
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
    //     let checkboxType = 'email';
    //     const displayMessagesFromResponse = jest.spyOn(component['messageService'], 'displayMessagesFromResponse')
    //     let involvedService = fixture.debugElement.injector.get(WhoInvolvedService);
    //     jest.spyOn(involvedService, "updateAllPartnerAPI").mockReturnValue(of(response));
    //     component.updateNotifyAllPt(checkboxType);
    //     expect(displayMessagesFromResponse).toHaveBeenCalled();

    //     checkboxType = 'webex';
    //     component.updateNotifyAllPt(checkboxType);
    //     expect(displayMessagesFromResponse).toHaveBeenCalled();

    //     checkboxType = 'walkme';
    //     component.updateNotifyAllPt(checkboxType);
    //     expect(displayMessagesFromResponse).toHaveBeenCalled();

    //   });


    //   it('should call updatePtRow with error in response', () => {
    //     component.ptNotifyAllEmail = false;
    //     component.ptNotifyAllWebex = false;
    //     component.ptNotifyAllWalkme = false;
    //     component.qualService.qualification.partnerTeam = [
    //         {"name":"Maria Roark","firstName":"Maria","lastName":"Roark","email":"maria.roark@aos5.com","ccoId":"mariar","access":"rw","notification":"Yes","webexNotification":"N","notifyByWelcomeKit":"Y","cam":false,"mailer":false,"partner":false,"defaultSelection":false}
    //     ]
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
    //     let updateType = 'notification';
    //     let obj = {"name":"Maria Roark","firstName":"Maria","lastName":"Roark","email":"maria.roark@aos5.com","ccoId":"mariar","access":"rw","notification":"Yes","webexNotification":"N","notifyByWelcomeKit":"Y","cam":false,"mailer":false,"partner":false,"defaultSelection":false};
    //     const checkboxSelectors =  jest.spyOn(component, 'checkboxSelectors')
    //     const updatePtRowObject =  jest.spyOn(component, 'updatePtRowObject')
    //     const displayMessagesFromResponse = jest.spyOn(component['messageService'], 'displayMessagesFromResponse')
    //     let involvedService = fixture.debugElement.injector.get(WhoInvolvedService);
    //     jest.spyOn(involvedService, "updatePartnerAPI").mockReturnValue(of(response));
    //     component.updatePtRow(obj, updateType);
    //     expect(displayMessagesFromResponse).toHaveBeenCalled();
    //     expect(updatePtRowObject).toHaveBeenCalled();

    //   });

    //   it('should call updatePtRowObject', () => {
    //     // component.qualService.qualification.partnerTeam = [
    //     //     {"name":"Maria Roark","firstName":"Maria","lastName":"Roark","email":"maria.roark@aos5.com","ccoId":"mariar","access":"rw","notification":"Yes","webexNotification":"N","notifyByWelcomeKit":"Y","cam":false,"mailer":false,"partner":false,"defaultSelection":false}
    //     // ]
    //     let updateType = 'notification';
    //     let obj = {"name":"Maria Roark","firstName":"Maria","lastName":"Roark","email":"maria.roark@aos5.com","ccoId":"mariar","access":"rw","notification":"Yes","webexNotification":"N","notifyByWelcomeKit":"Y","cam":false,"mailer":false,"partner":false,"defaultSelection":false};

    //     component.updatePtRowObject(obj, updateType);
    //     expect(obj.notification).toEqual('No');

    //     // updateType = 'accessType';
    //     // component.updatePtRowObject(obj, updateType);
    //     // expect(obj.access).toEqual('ro');


    //     // updateType = 'webexTeam';
    //     // component.updatePtRowObject(obj, updateType);
    //     // expect(obj.webexNotification).toEqual('Y');

    //     // updateType = 'walkmeTeam';
    //     // component.updatePtRowObject(obj, updateType);
    //     // expect(obj.notifyByWelcomeKit).toEqual('N');

    //   });
});