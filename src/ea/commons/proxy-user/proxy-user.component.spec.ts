import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { LocalizationService } from "vnext/commons/services/localization.service";

import { ProxyUserComponent } from "./proxy-user.component";
import { DataIdConstantsService } from "vnext/commons/services/data-id-constants.service";
import { EaRestService } from "ea/ea-rest.service";
import { EaService } from "ea/ea.service";
import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";
import { ElementIdConstantsService } from "vnext/commons/services/element-id-constants.service";

describe("ProxyUserComponent", () => {
  let component: ProxyUserComponent;
  let fixture: ComponentFixture<ProxyUserComponent>;

  const NgbActiveModalMock = {
   close: jest.fn().mockReturnValue('close')
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProxyUserComponent],
      imports: [HttpClientModule,FormsModule, RouterTestingModule],
      providers: [
        { provide: NgbActiveModal, useValue: NgbActiveModalMock },
        LocalizationService, DataIdConstantsService,EaService,EaRestService, ElementIdConstantsService
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProxyUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    //fixture.destroy();
  });
  
  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("call  switchToProxy", () => {
    component.switchToProxy();
  });
  it("call  switchToProxy", () => {
    component.cecId = "mariar";
    component.switchToProxy();
  });
  it("call  close", () => {
    component.close();
  });
});
