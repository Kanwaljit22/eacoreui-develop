import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { LocalizationService } from "vnext/commons/services/localization.service";
import { LocalizationPipe } from "vnext/commons/shared/pipes/localization.pipe";

import { SessionTimeoutComponent } from "./session-timeout.component";
import { DataIdConstantsService } from "vnext/commons/services/data-id-constants.service";

describe("SessionTimeoutComponent", () => {
  let component: SessionTimeoutComponent;
  let fixture: ComponentFixture<SessionTimeoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SessionTimeoutComponent, LocalizationPipe],
      imports: [HttpClientModule, RouterTestingModule],
      providers: [LocalizationService, NgbActiveModal, DataIdConstantsService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionTimeoutComponent);
    component = fixture.componentInstance;
    console.log("Running test suite: SessionTimeoutComponent");
    fixture.detectChanges();
  });

  it("should create", () => {
    console.log("Running test case: should create");
    expect(component).toBeTruthy();
  });

  it("call close", () => {
    console.log("Running test case: call close");
    component.continue();
  });

  it("call close", () => {
    console.log("Running test case: call logout");
    component.logout();
  });
});
