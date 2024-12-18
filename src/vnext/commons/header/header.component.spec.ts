import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { EaStoreService } from "ea/ea-store.service";
import { LocalizationService } from "../services/localization.service";
import { VnextStoreService } from "../services/vnext-store.service";
import { LocalizationPipe } from "../shared/pipes/localization.pipe";

import { HeaderComponent } from "./header.component";

describe("HeaderComponent", () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent, LocalizationPipe],
      providers: [VnextStoreService, LocalizationService, EaStoreService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    console.log("Running test suite: HeaderComponent");
    fixture.detectChanges();
  });

  it("should create", () => {
    console.log("Running test case: should create");
    expect(component).toBeTruthy();
  });
});
