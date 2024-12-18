import { CurrencyPipe } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, inject, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { EaRestService } from "ea/ea-rest.service";
import { EaService } from "ea/ea.service";
import { UtilitiesService } from "vnext/commons/services/utilities.service";
import { VnextStoreService } from "vnext/commons/services/vnext-store.service";
import { ProjectStoreService } from "vnext/project/project-store.service";
import { ProposalStoreService } from "vnext/proposal/proposal-store.service";
import { VnextService } from "vnext/vnext.service";

import { RoadMapComponent } from "./road-map.component";
import { DataIdConstantsService } from "vnext/commons/services/data-id-constants.service";

describe("RoadMapComponent", () => {
  let component: RoadMapComponent;
  let fixture: ComponentFixture<RoadMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoadMapComponent],
      providers: [
        VnextService,
        ProposalStoreService,
        EaService,
        EaRestService,
        VnextStoreService,
        ProjectStoreService,
        UtilitiesService,
        CurrencyPipe,
        DataIdConstantsService
      ],
      imports: [HttpClientTestingModule, RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoadMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call ngOnInit", () => {
    const func = jest.spyOn(component, "loadRoadMapArray");
    component.ngOnInit();
    expect(func).toHaveBeenCalled();
  });

  it("should call isClass roadmapStep > step", () => {
    component.vnextService.roadmapStep = 3;
    const data = 2;
    let result = component.isClass(data);
    expect(result).toBe("completed");
  });
  it("should call isClass roadmapStep === step", () => {
    component.vnextService.roadmapStep = 2;
    const data = 2;
    let result = component.isClass(data);
    expect(result).toBe("active");
  });
  it("should call isClass roadmapStep === step", () => {
    component.vnextService.roadmapStep = 1;
    let service = fixture.debugElement.injector.get(ProposalStoreService);
    service.proposalData.status = "COMPLETE";
    const data = 2;
    let result = component.isClass(data);
    expect(result).toBe("active");
  });
  it("should call isClass roadmapStep === step", () => {
    let service = fixture.debugElement.injector.get(ProposalStoreService);
    service.proposalData.objId = "123";
    const data = 3;
    let result = component.isClass(data);
    expect(result).toBe("active");
  });

  it("callNextOnSubject() should emit data to serviceSubjectProperty$ Subject", inject(
    [VnextService],
    (vnextService) => {
      vnextService.roadmapSubject.subscribe((message) => {
        expect(message).toBe("test");
      });
      component.showRoadMap("test");
    }
  ));
});
