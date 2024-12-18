import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HeaderService } from '@app/header/header.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { MessageService } from '@app/shared/services/message.service';
import { SearchLocateService } from '@app/modal/search-locate/search-locate.service';
import { GridInitializationService } from '@app/shared/ag-grid/grid-initialization.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CurrencyPipe } from '@angular/common';
import { LocaleService } from '@app/shared/services/locale.service';
import { AppRestService } from '@app/shared/services/app.rest.service';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { CopyLinkService } from '@app/shared/copy-link/copy-link.service';
import { PermissionService } from '@app/permission.service';
import { RestApiService } from '@app/shared/services/restAPI.service';
import { APP_CONFIG, AppConfig } from '@app/app-config';
import { AccountHealthInsighService } from '@app/shared/account-health-insight/account.health.insight.service';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { SubHeaderComponent, SubHeaderData } from './sub-header.component';
import { ProductSummaryService } from '@app/dashboard/product-summary/product-summary.service';
import { FiltersService } from '@app/dashboard/filters/filters.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { LinkedProposalInfo, ProposalDataService } from '@app/proposal/proposal.data.service';
import { ProposalPollerService } from '../services/proposal-poller.service';
import { PriceEstimationService } from '@app/proposal/edit-proposal/price-estimation/price-estimation.service';
import { CreateProposalService } from '@app/proposal/create-proposal/create-proposal.service';
import { TcoDataService } from '@app/tco/tco.data.service';
import { EaRestService } from 'ea/ea-rest.service';
import { ProposalSummaryService } from '@app/proposal/edit-proposal/proposal-summary/proposal-summary.service';
import { ListProposalService } from '@app/proposal/list-proposal/list-proposal.service';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { LinkSmartAccountService } from '@app/modal/link-smart-account/link-smart-account.service';




class MockAppDataService {

  customerID = "123";
  customerName = "test";
  isQualOrPropListFrom360Page = true;
  archName = "test";

  userInfo = {
    userId: "123",
  };
  subHeaderData: SubHeaderData = {
    moduleName: '',
    custName: '',
    subHeaderVal: null
  };

  createUniqueId() {
    return 'test'
  }

  getDetailsMetaData() {
    return { }

  }

  getSessionObject() {
    return this.userInfo
  }

  getAppDomain() {
    return '../../';
}

  assignColumnWidth(...a){
      return 100;
  }

  setSessionObject() {

  }

  movebreadcrumbUp = new BehaviorSubject(false);
  currentBreadCrumbMovingStatus = this.movebreadcrumbUp.asObservable();

  agreementCntEmitter = new EventEmitter<any>();
  headerDataLoaded = new EventEmitter();
  userInfoObjectEmitter = new EventEmitter<any>();
  deleteAgreementDataEmitter = new EventEmitter<any>();

  isTwoTierUser() {
    return false
  }

  agreementDataEmitter = new EventEmitter<any>();

  linkedSmartAccountObj = { 'name': 'Not Assigned', 'id': '' };
}

describe('SubHeaderComponent', () => {
  let component: SubHeaderComponent;
  let fixture: ComponentFixture<SubHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubHeaderComponent ],
      providers: [HeaderService, { provide:AppDataService, useClass: MockAppDataService}, MessageService, SearchLocateService, GridInitializationService, UtilitiesService, CurrencyPipe, LocaleService, AppRestService, BlockUiService, ConstantsService, CopyLinkService, PermissionService, RestApiService, { provide: APP_CONFIG, useValue: AppConfig }, AccountHealthInsighService, ProductSummaryService, FiltersService, QualificationsService,ProposalDataService, ProposalPollerService, LinkSmartAccountService, PriceEstimationService, CreateProposalService, TcoDataService, EaRestService, ProposalSummaryService, ListProposalService],
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([
      ])],
      schemas:[CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

    it('call create', () => {
        expect(component).toBeTruthy();
    })

    it('call editQual', () => {
        let qualService = fixture.debugElement.injector.get(QualificationsService)
        const promise = new Promise((resolve, reject) => {
            resolve({ updatedQualName: 'test' });
          });
      
          Object.defineProperty(component, "modalVar", {
            value: { open: jest.fn().mockReturnValue({ result: promise } as any) },
          });
        component.editQual();

        const promisedesc = new Promise((resolve, reject) => {
            resolve({ updatedQualDesc: 'testdesc' });
          });
          Object.defineProperty(component, "modalVar", {
            value: { open: jest.fn().mockReturnValue({ result: promisedesc } as any) },
          });
          component.editQual();
    })

    it('call editProposal', () => {
        let appDataService = fixture.debugElement.injector.get(AppDataService)
        const promise = new Promise((resolve, reject) => {
            resolve({ updateData: {
                "name": "test",
                "eaStartDateDdMmmYyyyStr":"231231",
                "eaTermInMonths": 2,
                "priceList":"test",
                "billingModel": "test",
                "status":"Active"
            } });
          });
      
          Object.defineProperty(component, "modalVar", {
            value: { open: jest.fn().mockReturnValue({ result: promise } as any) },
          });
        component.editProposal();
    })

    it('call addFavorite', () => {
        let productSummaryService = fixture.debugElement.injector.get(ProductSummaryService)
        let appDataService = fixture.debugElement.injector.get(AppDataService)
        jest.spyOn(productSummaryService, "addFavorite").mockReturnValue(of({}))
        appDataService.customerID = 1231223
        component.addFavorite();
    })

    it('call removeFavorite', () => {
        const res = {
            error:false
        }
        let productSummaryService = fixture.debugElement.injector.get(ProductSummaryService)
        let appDataService = fixture.debugElement.injector.get(AppDataService)
        jest.spyOn(productSummaryService, "addFavorite").mockReturnValue(of(res))
        appDataService.customerID = 1231223,
        appDataService.archName = 'test';
        component.removeFavorite();
    })

    it('call financialSummary', () => {
        let appDataService = fixture.debugElement.injector.get(AppDataService)
        appDataService.pageContext = "ProposalSummaryStep"
        component.financialSummary();

        appDataService.pageContext = "ProposalPriceEstimateStep";
        component.financialSummary();

        appDataService.pageContext = "DocumentCenter";
        component.financialSummary();
    })

    it('call showDropArch', () => {
       
        component.showDropArch();
    })

    it('call openActivityLog', () => {
       
        component.openActivityLog();
    })

    it('call loccSignaturePending', () => {
        let qualService = fixture.debugElement.injector.get(QualificationsService)
       
        component.loccSignaturePending();
    })

    it('call openLinkModal', () => {
        component.openLinkModal();
    })

    it('call onClickedOutsideSmart', () => {
        const event = {}
        component.onClickedOutsideSmart(event);
    })

    it('call openProposal', () => {
        const proposalId = 1234
          window.open = function () { return window; }
          let call = jest.spyOn(window, "open");
          let appDataService = fixture.debugElement.injector.get(AppDataService);
          appDataService.pageContext = 'ProposalSummaryStep'
          component.openProposal(proposalId);
          expect(call).toHaveBeenCalled();

          appDataService.pageContext = 'ProposalSummary'
          component.openProposal(proposalId);
          expect(call).toHaveBeenCalled();
    })

    it('call getCombinedArchitectureNameForLinkedProposal', () => {
        let appDataService = fixture.debugElement.injector.get(AppDataService)
        appDataService.subHeaderData = {
            moduleName: '',
            custName: '',
            subHeaderVal: ["test","test","test","test","test","test","test","test",[{
                "architecture": "test"
            }]
        ]
        },
        appDataService.archName = 'test';
        component.getCombinedArchitectureNameForLinkedProposal();
    })

    // it('call activeArchitecture', () => {
    //    let allArch = [{
    //     "architecture":"test",
    //     "id":1,
    //     "status": "Active"
    //    }]

    //    let arch = {
    //     "architecture":"test",
    //     "id":1,
    //     "status": "Active"
    //    }
    //    let appDataService = fixture.debugElement.injector.get(AppDataService)
    //    let val: Promise<true>;
    //    jest.spyOn(appDataService["_router"], 'navigate').mockReturnValue(val);
    //     component.activeArchitecture(arch, allArch);
    // })

    // it('call showAllProposal', () => {
    //     let appDataService = fixture.debugElement.injector.get(AppDataService)
    //     const rou = appDataService._router
    //     jest.spyOn(appDataService, 'getSessionObject').mockReturnValueOnce({proposalDataObj:{
    //         "proposalId":""
    //     }})
    //     let proposalDataService = fixture.debugElement.injector.get(ProposalDataService)
    //     proposalDataService.proposalDataObject.proposalId = "test"
    //     proposalDataService.proposalDataObject.proposalData = {
    //         "groupId" : 1,
    //         'name': "", 'desc': "", "defaultPriceList":'' , "priceList": '', "billingModel": "Prepaid Term","billingModelID": "Prepaid", "eaTermInMonths": 0, "eaStartDate": new Date(),"demoProposal":false, "linkId": 0,
    //         "eaStartDateStr": "", "eaStartDateFormed": "", "countryOfTransaction": "", "netTCV": "", "status": '', "reOpened":false, "currencyCode": "", "priceListId": 0 ,
    //         "archName":'', "totalNetPrice": 0, "hasLinkedProposal": false,"groupName": '', "eaStartDateDdMmmYyyyStr": "","countryOfTransactionName":"",
    //         "partner": { 'name': "", "partnerId": 0 },"architecture":'',"isStatusInconsistentCrossArch": false,"isStatusIncompleteCrossArch": false,"isOneOfStatusCompleteCrossArch": false, "isCrossArchitecture": false,"mspPartner": false, "linkedProposalsList": Array<LinkedProposalInfo>(),
    //         "coTerm": {'subscriptionId':  "", 'eaEndDate': "" , 'coTerm': false}, "loaLanguageClarificationIds": [], "loaNonStdModificationIds": [], "dealId": ""
    //     }
    //     let val: Promise<true>;
    //     jest.spyOn(rou., 'navigate').mockReturnValue(val);
    //     component.screenName = proposalDataService.proposalDataObject.proposalId;
    //      component.showAllProposal();
    //  })

     it('call getSmartAccountName', () => {
        let smartAccount = {
            "linked": true,
            "smartAccountName": "test",
            "smartAccountId":12323
        }
        
         component.getSmartAccountName(smartAccount);
     })

     it('call getLinkedSmartAccountName', () => {
        let appDataService = fixture.debugElement.injector.get(AppDataService)
        appDataService.smartAccountData = [{
            "linked": true,
            "smartAccountName": "test",
            "smartAccountId":12323
        }]
        
         component.getLinkedSmartAccountName();
     })

     it('call getAgreementDetails', () => {
        let appDataService = fixture.debugElement.injector.get(AppDataService)
        appDataService.smartAccountData = [{
            "linked": true,
            "smartAccountName": "test",
            "smartAccountId":123
        }]

        let smartAccount = {
            "linked": true,
            "smartAccountName": "test",
            "smartAccountId":12323
        }
        
         component.getAgreementDetails(smartAccount, false);
     })

     it('call deleteSmartAccount', () => {
        let smartAccount = {
            "prospectKey": 12,
            "smartAccountName": "test",
            "smartAccountId":12323,
            "active": true
        }
        let appDataService = fixture.debugElement.injector.get(AppDataService)
        appDataService.smartAccountData = [{
            "linked": true,
            "smartAccountName": "test",
            "smartAccountId":123
        }]
        const promise = new Promise((resolve, reject) => {
            resolve({ continue: true });
          });
      
          Object.defineProperty(component, "modalVar", {
            value: { open: jest.fn().mockReturnValue({ result: promise } as any) },
          });
          let productSummaryService = fixture.debugElement.injector.get(ProductSummaryService)
          jest.spyOn(productSummaryService, "deleteSmartAccount").mockReturnValue(of({error:false}))
        component.deleteSmartAccount(smartAccount);
    })

    it('call isSmartAccountPresent', () => {
        let qualService = fixture.debugElement.injector.get(QualificationsService)
        qualService.qualification.subscription = {
            "smartAccountName": "test"
        }

        let proposalDataService = fixture.debugElement.injector.get(ProposalDataService)
        proposalDataService.linkedRenewalSubscriptions = [ {
            "smartAccountName":"test"
        }]

        component.isSmartAccountPresent();

        qualService.qualification.subscription = {
        }

        proposalDataService.linkedRenewalSubscriptions = [ ];
        component.isSmartAccountPresent();
    })

    it('call getSmartAccountNameToDisplay', () => {
        let qualService = fixture.debugElement.injector.get(QualificationsService)
        qualService.qualification.subscription = {
        }

        let proposalDataService = fixture.debugElement.injector.get(ProposalDataService)
        proposalDataService.linkedRenewalSubscriptions = [ {
            "smartAccountName":"test"
        }]
        component.getSmartAccountNameToDisplay(); 
    })
});
