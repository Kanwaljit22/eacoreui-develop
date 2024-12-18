import { ComponentFixture, TestBed, fakeAsync } from "@angular/core/testing";

import { FilterMenuComponent } from "./filter-menu.component";
import { PriceEstimateService } from "vnext/proposal/edit-proposal/price-estimation/price-estimate.service";
import { ProposalRestService } from "vnext/proposal/proposal-rest.service";
import { VnextService } from "vnext/vnext.service";
import { ProposalStoreService } from "vnext/proposal/proposal-store.service";
import { UtilitiesService } from "vnext/commons/services/utilities.service";
import { LocalizationService } from "vnext/commons/services/localization.service";
import { EaRestService } from "ea/ea-rest.service";
import { EaService } from "ea/ea.service";
import { CurrencyPipe } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { PriceEstimateStoreService } from "vnext/proposal/edit-proposal/price-estimation/price-estimate-store.service";
import { RouterTestingModule } from "@angular/router/testing";
import { VnextStoreService } from "vnext/commons/services/vnext-store.service";
import { ProjectStoreService } from "vnext/project/project-store.service";
import { LocalizationPipe } from "vnext/commons/shared/pipes/localization.pipe";
import { DataIdConstantsService } from "vnext/commons/services/data-id-constants.service";
import { ElementIdConstantsService } from "vnext/commons/services/element-id-constants.service";
describe("FilterMenuComponent", () => {
  let component: FilterMenuComponent;
  let fixture: ComponentFixture<FilterMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterMenuComponent, LocalizationPipe],

      imports: [HttpClientModule, RouterTestingModule],
      providers: [
        PriceEstimateService,
        ProposalStoreService,
        UtilitiesService,
        CurrencyPipe,
        VnextStoreService,
        ProjectStoreService,
        ProposalRestService,
        VnextService,
        EaRestService,
        LocalizationService,
        EaService,
        PriceEstimateStoreService,
        DataIdConstantsService,
        ElementIdConstantsService
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterMenuComponent);
    component = fixture.componentInstance;
    component.filterMetaData = [
      {
        type: "BUYINGPROGRAM",
        name: "Buying Program",
        inputType: "checkbox",
        filters: [
          {
            name: "EA 3.0",
            id: "3.0",
            selected: true,
          },
          {
            name: "EA 2.0",
            id: "2.0",
            selected: true,
          },
        ],
      },

      {
        type: "DISPLAYFILTER",
        name: "Creator",
        inputType: "radio",
        filters: [
          {
            name: "Created By Me",
            id: "createdByMe",
            selected: true,
          },
          {
            name: "Shared With Me",
            id: "sharedWithMe",
          },
          {
            name: "Created By All",
            id: "ALLRECORDS_SUPERUSER",
            checkForSuperUser: true,
          },
        ],
      },
      {
        type: "DEALSTATUS",
        name: "Deal Status: Active",
        inputType: "checkbox",
        filters: [
          {
            name: "Approved",
            id: "Approved",
            selected: true,
          },

          {
            name: "More Information Required - BOM",
            id: "More Information Required-BOM",
            selected: true,
          },

          {
            name: "Qualified",
            id: "Qualified",
            selected: true,
          },
          {
            name: "Qualification In Progress",
            id: "Qualification in Progress",
            selected: true,
          },
          {
            name: "Re-Opened",
            id: "Re-Opened",
            selected: true,
          },
        ],
      },
      {
        type: "DEALSTATUS",
        name: "Deal Status: Inactive",
        inputType: "checkbox",
        filters: [
          {
            name: "Cancelled",
            id: "Cancelled",
            selected: true,
          },
          {
            name: "Closed",
            id: "Closed",
            selected: true,
          },
        ],
      },
    ];
    component.isPartnerLoggedIn = false;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should call ngOnInit", () => {});
  it("should call clearAll", () => {
    component.clearAll();
    expect(component.isClearFilterApplied).toBeTruthy();
  });
  it("should call apply", () => {
    component.apply();
  });

  it("should call selectFilter", () => {
    //for type radio.
    component.selectFilter(
      component.filterMetaData[1],
      component.filterMetaData[1].filters[1],
      component.filterMetaData[1].inputType
    );
    expect(component.filterMetaData[1].filters[1].selected).toBeTruthy();
  });
  it("should call selectFilter", () => {
    //when type is not radio.
    component.selectFilter(
      component.filterMetaData[0],
      component.filterMetaData[0].filters[0],
      component.filterMetaData[0].inputType
    );
    expect(component.filterMetaData[0].filters[0].selected).toBeFalsy();
  });
});
