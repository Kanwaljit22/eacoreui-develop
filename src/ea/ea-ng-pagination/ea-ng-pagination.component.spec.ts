import { HttpClientModule } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import {
  NgbActiveModal,
  NgbModule,
  NgbPaginationModule,
} from "@ng-bootstrap/ng-bootstrap";
import { EaRestService } from "ea/ea-rest.service";
import { EaService } from "ea/ea.service";
import { of } from "rxjs";
import { LocalizationService } from "vnext/commons/services/localization.service";
import { LocalizationPipe } from "vnext/commons/shared/pipes/localization.pipe";

import { EaNgPaginationComponent } from "./ea-ng-pagination.component";

class MockEaRestService {
  getApiCall() {
    return of({
      data: {
        smartAccounts: [
          {
            smartAccName: "test",
          },
        ],
        hasEa2Entity: false,
      },
    });
  }
  postApiCall() {
    return of({
      data: {

      },
    });
  }
  getApiCallJson(){
    return of({
      data: {

      },
    });
  }
}
describe("EaNgPaginationComponent", () => {
  let component: EaNgPaginationComponent;
  let fixture: ComponentFixture<EaNgPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EaNgPaginationComponent, LocalizationPipe],
      imports: [
        HttpClientModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        NgbPaginationModule,
      ],
      providers: [
        LocalizationService,
        NgbActiveModal,
        { provide: EaRestService, useClass: MockEaRestService },
        EaService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EaNgPaginationComponent);
    component = fixture.componentInstance;
    component.paginationObject = {};
    console.log("Running test suite: EaNgPaginationComponent");
    fixture.detectChanges();
  });

  it("should create", () => {
    console.log("Running test case: should create");
    expect(component).toBeTruthy();
  });

  it("call pageChange", () => {
    console.log("Running test case: call pageChange");
    const value = "pageSize";

    component.pageChange(value);
    expect(component.paginationObject.currentPage).toBeTruthy();
  });
});
