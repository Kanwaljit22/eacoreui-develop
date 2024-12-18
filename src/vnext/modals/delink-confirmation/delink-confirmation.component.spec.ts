import { CurrencyPipe } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { EaRestService } from "ea/ea-rest.service";

import { LocalizationService } from "vnext/commons/services/localization.service";
import { UtilitiesService } from "vnext/commons/services/utilities.service";
import { VnextStoreService } from "vnext/commons/services/vnext-store.service";
import { LocalizationPipe } from "vnext/commons/shared/pipes/localization.pipe";
import { ProjectStoreService } from "vnext/project/project-store.service";
import { PriceEstimateStoreService } from "vnext/proposal/edit-proposal/price-estimation/price-estimate-store.service";
import { PriceEstimateService } from "vnext/proposal/edit-proposal/price-estimation/price-estimate.service";
import { ProposalStoreService } from "vnext/proposal/proposal-store.service";
import { VnextService } from "vnext/vnext.service";

import { DelinkConfirmationComponent } from "./delink-confirmation.component";
import { DataIdConstantsService } from "vnext/commons/services/data-id-constants.service";
import { ElementIdConstantsService } from "vnext/commons/services/element-id-constants.service";

describe("DelinkConfirmationComponent", () => {
  let component: DelinkConfirmationComponent;
  let fixture: ComponentFixture<DelinkConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DelinkConfirmationComponent, LocalizationPipe],
      providers: [
        LocalizationService,
        NgbActiveModal,
        EaRestService,
        ProjectStoreService,
        PriceEstimateService,
        VnextService,
        VnextStoreService,
        PriceEstimateStoreService,
        ProposalStoreService,
        UtilitiesService,
        CurrencyPipe,
        DataIdConstantsService, ElementIdConstantsService
      ],
      imports: [HttpClientModule, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DelinkConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should call delink()", () => {
    const func = jest.spyOn(component, "close");
    component.delink();
    expect(func).toHaveBeenCalled();
  });

  it("should call close()", () => {
    const func = jest.spyOn(component.activeModal, "close");
    component.close();
    expect(func).toHaveBeenCalled();
  });
});
