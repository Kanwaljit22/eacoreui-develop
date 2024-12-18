import { ConstantsService } from "vnext/commons/services/constants.service";
import { Message } from "vnext/commons/message/message.service";
import { CurrencyPipe } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  tick,
} from "@angular/core/testing";
import { UtilitiesService } from "vnext/commons/services/utilities.service";
import { AdjustDesiredQtyService } from "vnext/proposal/edit-proposal/price-estimation/adjust-desired-qty/adjust-desired-qty.service";
import { PriceEstimateStoreService } from "vnext/proposal/edit-proposal/price-estimation/price-estimate-store.service";
import { PriceEstimateService } from "vnext/proposal/edit-proposal/price-estimation/price-estimate.service";
import { ProposalRestService } from "vnext/proposal/proposal-rest.service";
import { ProposalStoreService } from "vnext/proposal/proposal-store.service";
import { VnextService } from "vnext/vnext.service";
import { RouterTestingModule } from "@angular/router/testing";
import { MultiErrorComponent } from "./multi-error.component";
import { VnextStoreService } from "vnext/commons/services/vnext-store.service";
import { ProjectStoreService } from "vnext/project/project-store.service";
import { EaRestService } from "ea/ea-rest.service";
import { MessageType } from "vnext/commons/message/message.service";
import { LocalizationService } from "vnext/commons/services/localization.service";
import { DataIdConstantsService } from "vnext/commons/services/data-id-constants.service";

class MockPriceEstimateService {
  isMerakiSuitesPresent = true;
}

describe("MultiErrorComponent", () => {
  let component: MultiErrorComponent;
  let fixture: ComponentFixture<MultiErrorComponent>;
  const testObj = {
    errors: new Array<Message>(),
    warns: new Array<Message>(),
    info: new Array<Message>(),
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule],
      declarations: [MultiErrorComponent],
      providers: [
        AdjustDesiredQtyService,
        PriceEstimateService,
        ProposalStoreService,
        UtilitiesService,
        CurrencyPipe,
        PriceEstimateStoreService,
        ProposalRestService,
        VnextService,
        VnextStoreService,
        ProjectStoreService,
        EaRestService,
        LocalizationService,
        ConstantsService,
        DataIdConstantsService
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiErrorComponent);
    // let priceEstimateService = TestBed.inject(PriceEstimateService);
    component = fixture.componentInstance;
    component.message = {
      hasError: false,
      messages: [
        {
          text: "test",
          code: "1",
          identifier: true,
          severity: MessageType.Error,
        },
        {
          text: "test",
          code: "1",
          parentIdentifier: true,
          severity: MessageType.Warn,
          level: "BUNDLE",
        },
        {
          text: "test",
          code: "1",
          severity: MessageType.Info,
        },
      ],
    };
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  // it('call ngOnChanges on no Identifier', fakeAsync(() => {
  //   component.identifier = false;
  //   tick(2000); // causing issue due to timer in queue so added flush
  //   fixture.detectChanges();
  //   component.ngOnChanges(component);// on false identifier
  //   flush(); // in order to clear the timer
  // }));

  // it('call ngOnChanges on Identifier', () => {
  //   component.identifier = true;
  //   component.ngOnChanges(component);
  //   expect(component.messagesObj.errors.length).toBeGreaterThan(0); // can add warns / info as well
  // });

  // it('call ngOnChanges on no message', () => {
  //   component.message = undefined;
  //   component.ngOnChanges(component);
  //   expect(component.message.messages.length).toBeFalsy();
  // });

  it("call ShowError method on no Identifier", () => {
    component.identifier = false;
    component.showError(component.message.messages); // on having messages
  });

  it("call ShowError method on Identifier", () => {
    component.identifier = true;
    component.showError(component.message.messages);
    expect(component.messagesObj.errors.length).toBeGreaterThan(0); // can add warns / info as well
  });

  it("call ShowError on no messages", () => {
    component.message = {
      hasError: false,
    };
    component.showError(component.message.messages); // on no messages
    expect(component.messagesObj).toEqual(testObj);
  });

  it("call clear method", () => {
    component.clear();
    expect(component.messagesObj).toEqual(testObj);
  });

  it("call toggleClass method", () => {
    component.toggleClass([]);
    expect(component.displayMsgScroll).toBe(true);
  });

  it("call overflowVisible method true scenario", () => {
    component.overflowVisibles = false;
    component.overflowVisible();
    expect(component.overflowVisibles).toBe(true);
  });

  it("call overflowVisible method false scenario", () => {
    component.overflowVisibles = true;
    component.overflowVisible();
    expect(component.overflowVisibles).toBe(false);
  });

  it("call setMerakiMsg no messages scenario", () => {
    component.message = {
      hasError: false,
    };
    fixture.detectChanges();
    component.setMerakiMsg(); // on no messages
    expect(component.message.messages.length).toEqual(0);
  });

  it("call setMerakiMsg messages scenario", () => {
    let priceEstimateService =
      fixture.debugElement.injector.get(PriceEstimateService);
    let proposalStoreService =
      fixture.debugElement.injector.get(ProposalStoreService);
    let priceEstimateStoreService = fixture.debugElement.injector.get(
      PriceEstimateStoreService
    );
    const constantsService =
      fixture.debugElement.injector.get(ConstantsService);
    priceEstimateService.isMerakiSuitesPresent = true;
    proposalStoreService.isReadOnly = false;
    priceEstimateStoreService.orgIdsArr = [];
    const textObj = {
      severity: "WARN",
      text: "Please enter org id on project page as you have selected Meraki suites on this proposal.",
      type: constantsService.ORGID_EXCEPTION,
    };
    component.setMerakiMsg(); // on having messages
    expect(component.message.messages[3].text).toEqual(textObj.text);
  });
});
