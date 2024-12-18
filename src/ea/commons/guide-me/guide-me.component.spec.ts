import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EaRestService } from "ea/ea-rest.service";
import { LocalizationService } from "vnext/commons/services/localization.service";
import { LocalizationPipe } from "vnext/commons/shared/pipes/localization.pipe";

import { GuideMeComponent } from "./guide-me.component";

import { EaStoreService } from "ea/ea-store.service";
import { EaService } from "ea/ea.service";
import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";
import { of } from "rxjs";
import { EaStringToHtmlPipe } from "../pipes/ea-string-to-html.pipe";
import { DataIdConstantsService } from "vnext/commons/services/data-id-constants.service";

describe("GuideMeComponent", () => {
  let component: GuideMeComponent;
  let fixture: ComponentFixture<GuideMeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GuideMeComponent, LocalizationPipe, EaStringToHtmlPipe],
      providers: [
        LocalizationService,
        EaRestService,
        EaService,
        EaStoreService,
        DataIdConstantsService
      ],
      imports: [HttpClientModule, RouterTestingModule],
    })
      //{provide: EaRestService, useClass: MockEaRestService}
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuideMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call openGuideMe with error false ", () => {
    const mock = {
      data: {
        features: [{ description: "test 123" }],
        contextHeader: {
          label: "test",
        },
      },
      error: false,
    };
    let eaStoreService = fixture.debugElement.injector.get(EaStoreService);
    eaStoreService.pageContext = "";

    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getEampApiCall").mockReturnValue(of(mock));
    component.openGuideMe();
    expect(eaStoreService.pageContext).toBe("ngGuideMe");
    expect(component.label).toBe(mock.data.contextHeader.label);
    expect(component.features).toEqual(mock.data.features);
  });

  it("should call openGuideMe with error in API as true", () => {
    const test = {
      error: true,
    };
    let eaStoreService = fixture.debugElement.injector.get(EaStoreService);
    eaStoreService.pageContext = "";

    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    //jest.spyOn(eaRestService, 'getApiCall').mockReturnValue(of(res))
    jest.spyOn(eaRestService, "getEampApiCall").mockReturnValue(of(test));

    component.openGuideMe();
    expect(eaStoreService.pageContext).toBe("ngGuideMe");
    expect(component.label).toBe("");
    //expect(component.features).toEqual(res.data.features);
  });
});
