import { CurrencyPipe } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { EaRestService } from "ea/ea-rest.service";
import { ProjectRestService } from "vnext/project/project-rest.service";
import { ProjectStoreService } from "vnext/project/project-store.service";
import { ProjectService } from "vnext/project/project.service";
import { ProposalStoreService } from "vnext/proposal/proposal-store.service";
import { VnextService } from "vnext/vnext.service";
import { UtilitiesService } from "../services/utilities.service";
import { VnextStoreService } from "../services/vnext-store.service";

import { SuccessPopoverComponent } from "./success-popover.component";
import { DataIdConstantsService } from "../services/data-id-constants.service";
import { ProposalService } from "vnext/proposal/proposal.service";

describe("SuccessPopoverComponent", () => {
  let component: SuccessPopoverComponent;
  let fixture: ComponentFixture<SuccessPopoverComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SuccessPopoverComponent],
      providers: [
        ProjectService,
        ProposalStoreService,
        EaRestService,
        VnextStoreService,
        ProjectStoreService,
        ProjectRestService,
        VnextService,
        UtilitiesService,
        CurrencyPipe,
        DataIdConstantsService,
        ProposalService
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          {
            path: "ea/project/proposal/:proposalId",
            redirectTo: ""
          },
        ]),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call goToCopiedProposal", () => {
    const copiedProposalData = { objId: "123" };
    let service = fixture.debugElement.injector.get(ProposalStoreService);
    component.goToCopiedProposal(copiedProposalData);
    expect(component['proposalStoreService'].isReadOnly).toBe(false);
  });
});
