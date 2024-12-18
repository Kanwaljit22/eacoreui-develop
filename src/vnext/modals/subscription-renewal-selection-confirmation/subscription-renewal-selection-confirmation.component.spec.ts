import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { LocalizationService } from "vnext/commons/services/localization.service";
import { LocalizationPipe } from "vnext/commons/shared/pipes/localization.pipe";

import { SubscriptionRenewalSelectionConfirmationComponent } from "./subscription-renewal-selection-confirmation.component";
import { DataIdConstantsService } from "vnext/commons/services/data-id-constants.service";

describe("SubscriptionRenewalSelectionConfirmationComponent", () => {
  let component: SubscriptionRenewalSelectionConfirmationComponent;
  let fixture: ComponentFixture<SubscriptionRenewalSelectionConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SubscriptionRenewalSelectionConfirmationComponent,
        LocalizationPipe,
      ],
      imports: [HttpClientModule, RouterTestingModule],
      providers: [LocalizationService, NgbActiveModal, DataIdConstantsService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      SubscriptionRenewalSelectionConfirmationComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call close method when close button is clicked", () => {
    const modalRef = TestBed.get(NgbActiveModal);
    jest.spyOn(modalRef, "close");
    component.close();
    expect(modalRef.close).toHaveBeenCalled();
  });
  it("should call confirm method when close button is clicked", () => {
    const modalRef = TestBed.get(NgbActiveModal);
    jest.spyOn(modalRef, "close");
    component.confirm();
    expect(modalRef.close).toHaveBeenCalled();
  });
});
