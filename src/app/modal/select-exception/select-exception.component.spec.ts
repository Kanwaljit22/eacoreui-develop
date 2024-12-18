
import { CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DealListService } from '@app/dashboard/deal-list/deal-list.service';
import { PermissionService } from '@app/permission.service';
import { CreateProposalService } from '@app/proposal/create-proposal/create-proposal.service';
import { PriceEstimationService } from '@app/proposal/edit-proposal/price-estimation/price-estimation.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { CopyLinkService } from '@app/shared/copy-link/copy-link.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { AppRestService } from '@app/shared/services/app.rest.service';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { MessageService } from '@app/shared/services/message.service';
import { ProposalPollerService } from '@app/shared/services/proposal-poller.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { TcoDataService } from '@app/tco/tco.data.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SelectExceptionComponent } from './select-exception.component';

const NgbActiveModalMock = {
   close: jest.fn().mockReturnValue('close')
  }


describe('SelectExceptionComponent', () => {
  let component: SelectExceptionComponent;
  let fixture: ComponentFixture<SelectExceptionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
        imports: [
            HttpClientModule, HttpClientTestingModule, RouterTestingModule, BrowserTestingModule
          ],
      declarations: [ SelectExceptionComponent ],
      schemas:[NO_ERRORS_SCHEMA],
      providers: [AppDataService, CopyLinkService, PriceEstimationService, MessageService, { provide: NgbActiveModal, useValue: NgbActiveModalMock }, NgbModal, ProposalDataService, ConstantsService, LocaleService, AppRestService, BlockUiService, PermissionService, UtilitiesService, CurrencyPipe, ProposalPollerService, CreateProposalService, QualificationsService, DealListService, TcoDataService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectExceptionComponent);
    component = fixture.componentInstance;
    component.exceptionDataObj ={ exceptions: [
      {
          "exceptionType": "PURCHASE_ADJUSTMENT_REQUEST",
          "label": "Purchase Adjustment Request",
          "reasons": [
              "My customer is an existing Cisco EA customer (Cisco EA renewal)",
              "Issues with Customer Install Base, including missing Orders",
              "Reduction to the one-time discount",
              "Request for a non-standard one-time discount (subject to MDM approval first)"
          ],
          "selectedReason": "Issues with Customer Install Base, including missing Orders",
          "selectedReasons": [
              "Issues with Customer Install Base, including missing Orders",
              "Reduction to the one-time discount"
          ],
          "reasonSelectionOptional": false,
          "autoApprovalCandidate": false,
          "comment":[]
      }
  ]}
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngoninit', () => {
   
    const dataSpy = jest.spyOn(component, 'setExceptionsData');
    component.ngOnInit()
    expect(dataSpy).toHaveBeenCalled();
  });

  it('should setExceptionsData', () => {
    const checkAllReasonsSelectedSpy = jest.spyOn(component, 'checkAllReasonsSelected');
    component.setExceptionsData()
    expect(checkAllReasonsSelectedSpy).toHaveBeenCalled();
  });

  it('should check selected reason', () => {
    const reason = "Same product or upgrade should be supported"
    let result = component.checkSelectedReasons(reason);
    expect(result).toBeFalsy();

    component.selectedReasons = ["Same product or upgrade should be supported"]
    result = component.checkSelectedReasons(reason);
    expect(result).toBeTruthy();
  })

  it('should checkAllReasonsSelected', () => {
    component.checkAllReasonsSelected(component.exceptionsData);
    expect(component.enableSubmit).toBeFalsy();

    component.reasonsSelectedCount = 3;
    component.checkAllReasonsSelected([{},{},{}]);
    expect(component.enableSubmit).toBeFalsy();
  })

  it('should change exception comment', () => {
    const mockEevent: Event = <Event><any>{
        target: {
            value: 'Test'
        }
    };
    const checkAllReasonsSelectedSpy = jest.spyOn(component, 'checkAllReasonsSelected');
    component.exceptionComment = '';
    component.isExceptionCommentChanged(mockEevent);
    expect(component.enableSubmit).toBeFalsy();
    expect(component.enableAccept).toBeFalsy();
    expect(component.checkboxValue).toBeFalsy();
    expect(component.isCommentWritten).toBeFalsy();

    component.exceptionComment = 'Testing';
    component.isExceptionCommentChanged(mockEevent);
    expect(component.isCommentWritten).toBeTruthy();
    expect(checkAllReasonsSelectedSpy).toHaveBeenCalled();
  })

  it('should set checkbox value', () => {
    component.enableAccept = false;
    component.reviewChange();
    expect(component.enableAccept).toBeTruthy();
  })

  it('should remove selected file', () => {
    component.fileName = "test";
    component.removeItem();
    expect(component.fileName).toBeFalsy();
  })

  it('should clear files', () => {
    component.fileName = "test";
    component.clearFile();
    expect(component.fileName).toBeFalsy();
  })

  it('should select reasons', () => {
    const checkAllReasonsSelectedSpy = jest.spyOn(component, 'checkAllReasonsSelected');
  const reason = "My customer is an existing Cisco EA customer (Cisco EA renewal)";
  component.selectExceptionsReason(reason, 'PURCHASE_ADJUSTMENT_REQUEST',  component.exceptionsData[0]);
  expect(component.selectedReasons).toBeTruthy();
  expect(checkAllReasonsSelectedSpy).toHaveBeenCalled();

  component.exceptionsData = [
    {
        "exceptionType": "PURCHASE_ADJUSTMENT_REQUEST",
        "label": "Purchase Adjustment Request",
        "reasons": [
            "My customer is an existing Cisco EA customer (Cisco EA renewal)",
            "Issues with Customer Install Base, including missing Orders",
            "Reduction to the one-time discount",
            "Request for a non-standard one-time discount (subject to MDM approval first)"
        ],
        "selectedReason": "Issues with Customer Install Base, including missing Orders",
        "selectedReasons": [
            "Issues with Customer Install Base, including missing Orders",
            "Reduction to the one-time discount"
        ],
        "reasonSelectionOptional": false,
        "autoApprovalCandidate": false
    },
    {
        "exceptionType": "SEC_ORDERING_QTY",
        "label": "Quantity Minimum Lower Than Expected (Security)",
        "reasons": [
            "\"Desired EA quantity\" must be equal or greater than \"Quantity found in customer IB\"",
            "Same product or upgrade should be supported"
        ],
        "reasonSelectionOptional": false,
        "autoApprovalCandidate": false
    },
    {
        "exceptionType": "CX_TIER_THRESHOLD_CHECK",
        "label": "Services Tier 3 TCV threshold not met",
        "reasons": [
            "Request Services Exception"
        ],
        "reasonSelectionOptional": false,
        "autoApprovalCandidate": false
    }
]
  component.selectExceptionsReason(reason, component.exceptionsData[1].exceptionType,  component.exceptionsData[1]);
  expect(component.reasonsSelectedCount).toBeTruthy();
  expect(checkAllReasonsSelectedSpy).toHaveBeenCalled();

});

it('should submitApprovalReasons', () => {
    const proceedSpy = jest.spyOn(component,'proceed');
  component.submit();
  expect(component.exceptionDataObj.showUpload).toBeUndefined();

  component.fileDetail = {
      lastModified: 1648403279579,
      lastModifiedDate: 'Sun Mar 27 2022 13:47:59 GMT-0400 (Eastern Daylight Time)',
      name: "Cisco EA - Program Term_20008370_Req_121_WS-5C_Prepaid_US_Networking,Application,CXEA_20220327.pdf",
      size: 63340,
      type: "application/pdf",
      webkitRelativePath: ""
  }

  component.submit();
  expect(component.exceptionDataObj.showUpload).toBeUndefined();
  component.proceed()
  expect(proceedSpy).toHaveBeenCalled();
})


it('should called setExceptionsData',()=>{
  component.exceptionDataObj ={ exceptions: [
    {
        "exceptionType": "PURCHASE_ADJUSTMENT_REQUEST_NEW",
        "label": "Purchase Adjustment Request",
        "reasons": [
            "My customer is an existing Cisco EA customer (Cisco EA renewal)",
            "Issues with Customer Install Base, including missing Orders",
            "Reduction to the one-time discount",
            "Request for a non-standard one-time discount (subject to MDM approval first)"
        ],
        "reasonSelectionOptional": false,
        "autoApprovalCandidate": false,
       
    }
], "comment":[{id:12,"text":"text"}]}
  component.setExceptionsData()
  expect(component.isCommentWritten ).toBe(true)
})
it("should call processFile", () => {
  const files =[{name:'test.txt'}];
  component.processFile(files[0]);
  expect(component.fileFormatError).toBe(false)
});
it("should call fileOverBase", () => {
  const event = { target:{ value :'no'}}
  component.fileOverBase(event);
  expect(component.hasBaseDropZoneOver).toEqual(event)
});
it("should call dropped", () => {
  const ele = document.createElement('input')
  jest.spyOn(document, 'getElementById').mockReturnValue(ele)
  const event = { target:{ value :'no'}}
  event[0]={name:'file.png'};
  Object.defineProperty(component.uploader , 'queue' , {
      value:['test']
  })
  component.dropped(event);
});
it("should call onFileChange", () => {
  const event = { target:{ files:[{name:'file.png'}], value :'no'}}
  component.onFileChange(event);
});

});
