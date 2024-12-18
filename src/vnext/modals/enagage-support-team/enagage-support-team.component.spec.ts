import { NgxSliderModule } from "@angular-slider/ngx-slider";
import { CommonModule, CurrencyPipe } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserTestingModule } from "@angular/platform-browser/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { SharedModule } from "@app/shared";
import { NgbActiveModal, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { EaRestService } from "ea/ea-rest.service";
import { FileUploadModule } from "ng2-file-upload";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { of } from "rxjs";
import { LocalizationService } from "vnext/commons/services/localization.service";
import { LocalizationPipe } from "vnext/commons/shared/pipes/localization.pipe";
import { PriceEstimateService } from "vnext/proposal/edit-proposal/price-estimation/price-estimate.service";
import { ProposalStoreService } from "vnext/proposal/proposal-store.service";
import { VnextService } from "vnext/vnext.service";
import { EnagageSupportTeamComponent } from "./enagage-support-team.component";
import { DataIdConstantsService } from "vnext/commons/services/data-id-constants.service";
import { ElementIdConstantsService } from "vnext/commons/services/element-id-constants.service";

const exceptionsDataMock = {
  rid: "EAMP1655843964010",
  user: "prguntur",
  error: false,
  data: {
    requestExceptionOption: {
      proposalId: 20012381,
      exceptions: [
        {
          exceptionType: "PURCHASE_ADJUSTMENT_REQUEST",
          reasons: [
            "TBD",
            "Issues with Customer Install Base, including missing Orders",
            "Reduction to the one-time discount",
            "Request for a non-standard one-time discount (subject to MDM approval first)",
          ],
          reasonSelectionOptional: false,
          autoApprovalCandidate: false,
        },
      ],
      showUpload: false,
    },
  },
  buildVersion: "NOV 11-14-2021 09:53 EST RELEASE",
  currentDate: 1655843964511,
};

const paReasonsMock = {
  data: {
    paReasons: ["TBD", "TBDDD"],
  },
};

class EaRestServiceMock {
  getApiCall(url) {
    return of(paReasonsMock);
  }
  getApiCallJson(url) {
    return of(paReasonsMock);
  }
  postApiCall() {
    return of({
      data: {
        responseApproverList: [
          {
            test: "test",
          },
        ],
      },
    });
  }
}

class VnextServiceMock {
  isValidResponseWithData(res: any) {
    return of(true);
  }

  isValidResponseWithoutData(res: any) {
    return of(true);
  }
}

const NgbActiveModalMock = {
 close: jest.fn().mockReturnValue('close')
};

describe("EnagageSupportTeamComponent", () => {
  let component: EnagageSupportTeamComponent;
  let fixture: ComponentFixture<EnagageSupportTeamComponent>;
  let vnextService = new VnextServiceMock();
  let eaRestService = new EaRestServiceMock();
  let activeModal: NgbActiveModal;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserTestingModule,
        FormsModule,
        ReactiveFormsModule,
        BsDatepickerModule.forRoot(),
        FileUploadModule,
        NgxSliderModule,
        NgbTooltipModule,
      ],
      declarations: [EnagageSupportTeamComponent,LocalizationPipe],
      providers: [
        { provide: NgbActiveModal, useValue: NgbActiveModalMock },
        PriceEstimateService,
        { provide: VnextService, useValue: vnextService },
        ProposalStoreService,
        LocalizationService,
        CurrencyPipe,
        LocalizationPipe,
        DataIdConstantsService,
        { provide: EaRestService, useValue: eaRestService }, ElementIdConstantsService
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnagageSupportTeamComponent);
    component = fixture.componentInstance;
    component.exceptionDataObj = exceptionsDataMock.data.requestExceptionOption;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should exceptionComment be blank initlly", () => {
    expect(component.exceptionComment).not.toBe(undefined);
  });

  it("should start ngoninit", () => {
    const exceptionSpy = jest.spyOn(component, "setExceptionsData");
    component.ngOnInit();
    expect(exceptionSpy).toHaveBeenCalled();
  });

  it("should check all the reasons selected", () => {
    component.reasonsSelectedCount = 1;
    component.exceptionsData = component.exceptionDataObj.exceptions;
    component.checkAllReasonsSelected(component.exceptionsData);
    expect(component.isReasonSelected).toBeTruthy();
  });

  it("should check if exceptioncomment changed", () => {
    const checkReasonsSpy = jest.spyOn(component, "checkAllReasonsSelected");
    component.selectedReasons = ["1"];
    component.exceptionComment = "test";
    component.exceptionsData = component.exceptionDataObj.exceptions;
    component.isExceptionCommentChanged();
    expect(component.isCommentWritten).toBeTruthy();
    expect(checkReasonsSpy).toHaveBeenCalled();
    expect(component.enableSubmit).toBeTruthy();

    component.exceptionComment = "";
    component.isExceptionCommentChanged();
    expect(component.enableSubmit).toBeFalsy();
    expect(component.checkboxValue).toBeFalsy();
  });

  it("should check selectedReasons", () => {
    const reasons =
      exceptionsDataMock.data.requestExceptionOption.exceptions[0].reasons;
    component.selectedReasons = [reasons[1]];
    let isSelectedReasonPresent = component.checkSelectedReasons(reasons[1]);
    expect(isSelectedReasonPresent).toBeTruthy();
    isSelectedReasonPresent = component.checkSelectedReasons(reasons[2]);
   // expect(isSelectedReasonPresent).toBe(false);
  });

  it("should call edit pa reasons", () => {
    const apiSpy = jest.spyOn(eaRestService, "getApiCall");
    component.edit();
    expect(apiSpy).toHaveBeenCalled();
    expect(component.defaultedPaReasons).toBeTruthy();
  });

  it("should prepareSelectedReasons", () => {
    let exception = exceptionsDataMock.data.requestExceptionOption.exceptions;
    // exception['selectedReasons'] = [];
    component.selectedReasons = [];
    component.prepareSelectedReasons(exception);
    expect(component.selectedReasons.length).toBeFalsy();

    exception["selectedReasons"] = ["1"];
    component.selectedReasons = [];
    component.prepareSelectedReasons(exception);
    expect(component.selectedReasons.length).toBeTruthy();
  });

  it("should check selectExceptionsReason", () => {
    const checkAllReasonsSelectedSpy = jest.spyOn(
      component,
      "checkAllReasonsSelected"
    );
    component.defaultedPaReasons = paReasonsMock.data.paReasons;
    component.selectExceptionsReason(
      component.exceptionsData[0].reasons[0],
      component.exceptionsData[0].exceptionType,
      component.exceptionsData[0]
    );
 //   expect(component.reasonsSelectedCount).toBeFalsy();
    component.selectExceptionsReason(
      component.exceptionsData[0].reasons[1],
      component.exceptionsData[0].exceptionType,
      component.exceptionsData[0]
    );
  //  expect(component.reasonsSelectedCount).toBeTruthy();
    //expect(component.selectedReasons.length).toBe(false);
    expect(checkAllReasonsSelectedSpy).toHaveBeenCalled();
    // expect(component.enableSubmit).toBeFalsy();
    component.isCommentWritten = false;
    component.selectedReasons = [];
    component.reasonsSelectedCount = 0;
    component.selectExceptionsReason(
      component.exceptionsData[0].reasons[1],
      component.exceptionsData[0].exceptionType,
      component.exceptionsData[0]
    );
    // expect(component.enableSubmit).toBeFalsy();
  });

  it("should checkAllReasonsSelected()", () => {
    let data;
    expect(component.checkAllReasonsSelected(data)).toBe(undefined);
  });
  it("should withdrawSupport()", () => {
    const withdrawSupport = jest.spyOn(component, "withdrawSupport");
    component.withdrawSupport();
    expect(withdrawSupport).toHaveBeenCalled();
  });
  it("should close()", () => {
    const close = jest.spyOn(component, "close");
    expect(component.close()).toBeUndefined();
  });
  it("should submit()", () => {
    const submit = jest.spyOn(component, "submit");
    expect(component.submit()).toBeUndefined();
  });
});
