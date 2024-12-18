import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { EaRestService } from "ea/ea-rest.service";
import { EaService } from "ea/ea.service";
import { LocalizationService } from "vnext/commons/services/localization.service";
import { LocalizationPipe } from "vnext/commons/shared/pipes/localization.pipe";

import { EaProgressbarComponent } from "./progressbar.component";

describe("EaProgressbarComponent", () => {
  let component: EaProgressbarComponent;
  let fixture: ComponentFixture<EaProgressbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EaProgressbarComponent, LocalizationPipe],
      imports: [HttpClientModule, RouterTestingModule],
      providers: [LocalizationService, EaService, EaRestService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EaProgressbarComponent);
    component = fixture.componentInstance;
    console.log("Running test suite: EaProgressbarComponent");
    fixture.detectChanges();
  });

  it("should create", () => {
    console.log("Running test case: should create");
    expect(component).toBeTruthy();
  });
});
