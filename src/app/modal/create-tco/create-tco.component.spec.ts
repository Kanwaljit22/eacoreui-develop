import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateTcoComponent } from './create-tco.component';
import { LocaleService } from '@app/shared/services/locale.service';
import { NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { TcoApiCallService } from '@app/tco/tco-api-call.service';
import { MessageService } from '@app/shared/services/message.service';
import { LinkedProposalInfo, ProposalDataService } from '@app/proposal/proposal.data.service';
import { TcoDataService } from '@app/tco/tco.data.service';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { CopyLinkService } from '@app/shared/copy-link/copy-link.service';
import { PermissionService } from '@app/permission.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AppDataService } from '@app/shared/services/app.data.service';
import { AppRestService } from '@app/shared/services/app.rest.service';
import { ProposalPollerService } from '@app/shared/services/proposal-poller.service';
import { of } from 'rxjs';

const NgbActiveModalMock = {
 close: jest.fn().mockReturnValue('close')
}

describe('CreateTcoComponent', () => {
  let component: CreateTcoComponent;
  let fixture: ComponentFixture<CreateTcoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTcoComponent ],
      providers: [ { provide: NgbActiveModal, useValue: NgbActiveModalMock }, LocaleService, Renderer2, TcoApiCallService, MessageService, ProposalDataService, TcoDataService, BlockUiService, ConstantsService, CopyLinkService, PermissionService, UtilitiesService, CurrencyPipe, AppDataService, AppRestService, ProposalPollerService],
      imports: [HttpClientModule, CommonModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTcoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('call ngOnInit', () => {
    component.tcoName = 'test';
    component.ngOnInit()
    expect(component.initialName).toEqual('test')
  }); 

  it('call close', () => {
    component.close()
  });
  
  it('call focusInput', () => {
    const val = 'createTco'
    component.focusInput(val);
  });

  it('call create', () => {
    component.tcoName = 'test'
    let mock = {
        "data": {

        }
    }
    const tcoApiCallService = fixture.debugElement.injector.get(TcoApiCallService);
    jest.spyOn(tcoApiCallService, "createTco").mockReturnValue(of(mock));
    const proposalDataService = fixture.debugElement.injector.get(ProposalDataService);
    proposalDataService.proposalDataObject = {
        "proposalId": "12233",
        "proposalData": {
            'name': "", 'desc': "", "defaultPriceList":'' , "priceList": '', "billingModel": "Prepaid Term","billingModelID": "Prepaid", "eaTermInMonths": 0, "eaStartDate": new Date(),"demoProposal":false, "linkId": 0,
            "eaStartDateStr": "", "eaStartDateFormed": "", "countryOfTransaction": "", "netTCV": "", "status": '', "reOpened":false, "currencyCode": "", "priceListId": 0 ,
            "archName":'', "totalNetPrice": 0, "hasLinkedProposal": false, "groupId": 0,"groupName": '', "eaStartDateDdMmmYyyyStr": "","countryOfTransactionName":"",
            "partner": { 'name': "", "partnerId": 0 },"architecture":'',"isStatusInconsistentCrossArch": false,"isStatusIncompleteCrossArch": false,"isOneOfStatusCompleteCrossArch": false, "isCrossArchitecture": false,"mspPartner": false, "linkedProposalsList": Array<LinkedProposalInfo>(),
            "coTerm": {'subscriptionId':  "", 'eaEndDate': "" , 'coTerm': false}, "loaLanguageClarificationIds": [], "loaNonStdModificationIds": [], "dealId": ""
        },
        "defineSuites":{},
        "priceEstimation": {},
        "tcoData": { 'totalPriceGraphTableData': [] },
        "newProposalFlag": false,
        "userEditAccess": true,
        "createdBy":'',
        "noOfSuites" : 0,
        "existingEaDcSuiteCount" : 0,
        "billToId" : ''

    }
    component.create();
  });

  it('call update', () => {
    component.tcoName = 'createTco'
    component.update();
  });

  it('call isNameChanged', () => {
    let event
    component.tcoName = 'createTco'
    component.isNameChanged(event);

    component.tcoName = ''
    component.isNameChanged(event);

    component.tcoName = 'test'
    component.initialName = "name"
    component.isNameChanged(event);
  });
  
});
