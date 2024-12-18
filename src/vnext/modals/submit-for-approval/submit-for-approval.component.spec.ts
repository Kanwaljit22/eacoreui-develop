import { NgxSliderModule } from "@angular-slider/ngx-slider";
import { CommonModule, CurrencyPipe } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserTestingModule } from "@angular/platform-browser/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { SharedModule } from "@app/shared";
import { NgbActiveModal, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { EaRestService } from "ea/ea-rest.service";
import { EaStoreService } from "ea/ea-store.service";
import { FileUploadModule } from "ng2-file-upload";
import { ClickOutsideModule } from "ng4-click-outside";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { of } from "rxjs";
import { ConstantsService } from "vnext/commons/services/constants.service";
import { LocalizationService } from "vnext/commons/services/localization.service";
import { UtilitiesService } from "vnext/commons/services/utilities.service";
import { VnextStoreService } from "vnext/commons/services/vnext-store.service";
import { ProposalRestService } from "vnext/proposal/proposal-rest.service";
import { ProposalStoreService } from "vnext/proposal/proposal-store.service";
import { VnextService } from "vnext/vnext.service";
import { SubmitForApprovalComponent } from "./submit-for-approval.component";
import { DataIdConstantsService } from "vnext/commons/services/data-id-constants.service";
import { ElementIdConstantsService } from "vnext/commons/services/element-id-constants.service";

const exceptionDataMock = {
  rid: "EAMP1656437840253",
  user: "prguntur",
  error: false,
  data: {
    requestExceptionOption: {
      proposalId: 20009453,
      exceptions: [
        {
          exceptionType: "PURCHASE_ADJUSTMENT_REQUEST",
          label: "Purchase Adjustment Request",
          reasons: [
            "My customer is an existing Cisco EA customer (Cisco EA renewal)",
            "Issues with Customer Install Base, including missing Orders",
            "Reduction to the one-time discount",
            "Request for a non-standard one-time discount (subject to MDM approval first)",
          ],
          selectedReason:
            "Issues with Customer Install Base, including missing Orders",
          selectedReasons: [
            "Issues with Customer Install Base, including missing Orders",
            "Reduction to the one-time discount",
          ],
          reasonSelectionOptional: false,
          autoApprovalCandidate: false,
        },
        {
          exceptionType: "SEC_ORDERING_QTY",
          label: "Quantity Minimum Lower Than Expected (Security)",
          reasons: [
            '"Desired EA quantity" must be equal or greater than "Quantity found in customer IB"',
            "Same product or upgrade should be supported",
          ],
          reasonSelectionOptional: false,
          autoApprovalCandidate: false,
        },
        {
          exceptionType: "CX_TIER_THRESHOLD_CHECK",
          label: "Services Tier 3 TCV threshold not met",
          reasons: ["Request Services Exception"],
          reasonSelectionOptional: false,
          autoApprovalCandidate: false,
        },
      ],
      showUpload: true,
      comment: "Test",
    },
  },
  buildVersion: "NOV 11-14-2021 09:53 EST RELEASE",
  currentDate: 1656437841046,
};

class ProposalRestServiceMock {
  getApiCall(url) {
    return of(exceptionDataMock);
  }
  postApiCall(url) {
    return of(true);
  }
}

const NgbActiveModalMock = {
 close: jest.fn().mockReturnValue('close')
};

class VnextServiceMock {
  isValidResponseWithData(res: any) {
    return of(true);
  }

  isValidResponseWithoutData(res: any) {
    return of(true);
  }
}

describe("SubmitForApprovalComponent", () => {
  let component: SubmitForApprovalComponent;
  let fixture: ComponentFixture<SubmitForApprovalComponent>;
  let proposalRestService = new ProposalRestServiceMock();
  let vnextService = new VnextServiceMock();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserTestingModule
      ],
      schemas:[NO_ERRORS_SCHEMA],
      declarations: [SubmitForApprovalComponent],
      providers: [
        { provide: NgbActiveModal, useValue: NgbActiveModalMock },
        { provide: ProposalRestService, useValue: proposalRestService },
        { provide: VnextService, useValue: vnextService },
        EaRestService,
        VnextStoreService,
        ProposalStoreService,
        EaStoreService,
        ConstantsService,
        UtilitiesService,
        LocalizationService,
        CurrencyPipe,
        DataIdConstantsService, ElementIdConstantsService
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitForApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call getData on ngOnInit", () => {
    const getDataSpy = jest.spyOn(component, "getData");
    component.ngOnInit();
    expect(getDataSpy).toHaveBeenCalled();
  });

  it("should get data for exceptions present", () => {
    const setExceptionsDataSpy = jest.spyOn(component, "setExceptionsData");
    const apiSpy = jest.spyOn(proposalRestService, "getApiCall");
    const validateSpy = jest.spyOn(vnextService, "isValidResponseWithData");
    component.getData();
    expect(apiSpy).toHaveBeenCalled();
    expect(validateSpy).toHaveBeenCalled();
    expect(component.exceptionData).toBeTruthy();
  });

  it("should call and get setExceptionsData", () => {
   // console.log("Running test case: should call and get setExceptionsData");
    const checkAllReasonsSelectedSpy = jest.spyOn(
      component,
      "checkAllReasonsSelected"
    );
    component.setExceptionsData();
    expect(component.isCommentWritten).toBeTruthy();
    expect(component.reasonsSelectedCount).toBeTruthy();
    expect(component.selectedReasonsForPA).toBeTruthy();
  //  expect(component.enableSubmit).toBeTruthy();
    expect(checkAllReasonsSelectedSpy).toHaveBeenCalled();
  });

  it("should set checkbox value", () => {
    component.enableAccept = false;
    component.review();
    expect(component.enableAccept).toBeTruthy();
  });

  it("should checkAllReasonsSelected", () => {
    component.checkAllReasonsSelected(component.exceptionData.exceptions);
    // expect(component.enableSubmit).toBeFalsy();

    component.reasonsSelectedCount = 3;
    component.checkAllReasonsSelected([{}, {}, {}]);
    expect(component.enableSubmit).toBeTruthy();
  });

  it("should check selected reason", () => {
    const reason = "Same product or upgrade should be supported";
    let result = component.checkSelectedReasons(reason);
    expect(result).toBeFalsy();

    component.selectedReasonsForPA = [
      "Same product or upgrade should be supported",
    ];
    result = component.checkSelectedReasons(reason);
    expect(result).toBeTruthy();
  });

  it("should remove selected file", () => {
    component.fileName = "test";
    component.removeItem();
    expect(component.fileName).toBeFalsy();
  });

  it("should clear files", () => {
    component.fileName = "test";
    component.clearFile();
    expect(component.fileName).toBeFalsy();
  });

  it("should submitApprovalReasons", () => {
    const proceedSpy = jest.spyOn(component, "proceed");
    component.exceptionData = exceptionDataMock.data.requestExceptionOption;
    component.submitApprovalReasons();
    expect(component.exceptionData.showUpload).toBeTruthy();

    component.fileDetail = {
      lastModified: 1648403279579,
      lastModifiedDate:
        "Sun Mar 27 2022 13:47:59 GMT-0400 (Eastern Daylight Time)",
      name: "Cisco EA - Program Term_20008370_Req_121_WS-5C_Prepaid_US_Networking,Application,CXEA_20220327.pdf",
      size: 63340,
      type: "application/pdf",
      webkitRelativePath: "",
    };

    component.submitApprovalReasons();
    expect(component.exceptionData.showUpload).toBeTruthy();
    expect(proceedSpy).toHaveBeenCalled();
  });

  it("should submitApprovalReasons", () => {
    const apiSpy = jest.spyOn(proposalRestService, "postApiCall");
    component.fileDetail = {
      lastModified: 1648403279579,
      lastModifiedDate:
        "Sun Mar 27 2022 13:47:59 GMT-0400 (Eastern Daylight Time)",
      name: "Cisco EA - Program Term_20008370_Req_121_WS-5C_Prepaid_US_Networking,Application,CXEA_20220327.pdf",
      size: 63340,
      type: "application/pdf",
      webkitRelativePath: "",
    };

    const requestObj = {
      data: {
        proposalObjId: "6262b97b84b4cf6f4ffaecf9",
        exceptions: component.exceptionData.exceptions,
        comment: component.exceptionComment,
      },
    };
    component.proceed(requestObj);
    expect(apiSpy).toHaveBeenCalled();
  });

  it("should select reasons", () => {
    const checkAllReasonsSelectedSpy = jest.spyOn(
      component,
      "checkAllReasonsSelected"
    );
    const reason =
      "My customer is an existing Cisco EA customer (Cisco EA renewal)";
    component.exceptionData = exceptionDataMock.data.requestExceptionOption;
    component.selectReason(
      reason,
      "PURCHASE_ADJUSTMENT_REQUEST",
      component.exceptionData.exceptions[0]
    );
    expect(component.selectedReasonsForPA).toBeTruthy();
    expect(checkAllReasonsSelectedSpy).toHaveBeenCalled();

    component.selectReason(
      reason,
      component.exceptionData.exceptions[1].exceptionType,
      component.exceptionData.exceptions[1]
    );
    expect(component.reasonsSelectedCount).toBeTruthy();
    expect(checkAllReasonsSelectedSpy).toHaveBeenCalled();
  });

  it("should change exception comment", () => {
    const mockEevent: Event = <Event>(<any>{
      target: {
        value: "Test",
      },
    });
    const checkAllReasonsSelectedSpy = jest.spyOn(
      component,
      "checkAllReasonsSelected"
    );
    component.exceptionComment = "";
    component.isExceptionCommentChanged(mockEevent);
    expect(component.enableSubmit).toBeFalsy();
    expect(component.enableAccept).toBeFalsy();
    expect(component.checkboxValue).toBeFalsy();
    expect(component.isCommentWritten).toBeFalsy();

    component.exceptionComment = "Testing";
    component.isExceptionCommentChanged(mockEevent);
    expect(component.isCommentWritten).toBeTruthy();
    expect(checkAllReasonsSelectedSpy).toHaveBeenCalled();
  });

  it("should close()", () => {
    expect(component.close()).toBeUndefined();
  });
  it("should submit()", () => {
    expect(component.submit()).toBeUndefined();
  });
  it("should fileOverBase()", () => {
    component.fileOverBase(true);
    expect(component.hasBaseDropZoneOver).toBeTruthy();
  });

  it("should fileOverBase()", () => {
    const file = new File(["foo"], "foo.txt", {
      type: "text/plain",
    });

    expect(component.dropped([file])).toBeUndefined();
  });
  it("should call onFileChange", () => {
    const event = { target:{ files:[{name:'file.png'}], value :'no'}}
    component.onFileChange(event);
  });
  it("should call processFile", () => {
    const files =[{name:'test.txt'}];
    component.processFile(files[0]);
    expect(component.fileFormatError).toBe(true)
  });
});
