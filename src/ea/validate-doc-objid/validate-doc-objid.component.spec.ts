import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { EaProgressbarComponent } from "ea/commons/progressbar/progressbar.component";
import { EaRestService } from "ea/ea-rest.service";
import { EaStoreService } from "ea/ea-store.service";
import { of } from "rxjs";

import { ValidateDocObjidComponent } from "./validate-doc-objid.component";
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
}

xdescribe("ValidateDocObjidComponent", () => {
  let component: ValidateDocObjidComponent;
  let fixture: ComponentFixture<ValidateDocObjidComponent>;
  beforeAll(() => {
    window.onbeforeunload = () => "Oh no!";
  });
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ValidateDocObjidComponent, EaProgressbarComponent],
      imports: [HttpClientModule, RouterTestingModule],
      providers: [
        { provide: EaRestService, useClass: MockEaRestService },
        EaStoreService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateDocObjidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call getData", () => {
    const res = {
      data: { proposalObjectId: "123" },
    };
    let service = fixture.debugElement.injector.get(EaRestService);
    let eaStoreService = fixture.debugElement.injector.get(EaStoreService);
    jest.spyOn(service, "getApiCall").mockReturnValue(of(res));
    component.getData();
    expect(eaStoreService.displayProgressBar).toBeFalsy();
    expect(eaStoreService.docObjData).toEqual(res.data);
  });
});
