import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddAdditionalCostComponent } from './add-additional-cost.component';
import { TcoService } from 'vnext/tco/tco.service';
import { EaRestService } from 'ea/ea-rest.service';
import { ActivatedRoute } from '@angular/router';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { of } from 'rxjs';
import { HttpClientModule } from "@angular/common/http";
import { LocalizationPipe } from "vnext/commons/shared/pipes/localization.pipe";
import { TcoStoreService } from '../../tco-store.service';
import { VnextService } from 'vnext/vnext.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { CurrencyPipe } from '@angular/common';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';

class MockEaRestService {
  putApiCall(url: string, body: any) {
    return of({ success: true } as any);
  }
}

class MockTcoService {
  addAdditionalCost = true;
  refreshGraph = { next: jest.fn() };
}

class MockTcoStoreService {
  tcoData: any = {
    alc: {
      additionalCosts: []
    }
  };
  inflation = {
    cxAvailable: true
  }
}

describe('AddAdditionalCostComponent', () => {
  let component: AddAdditionalCostComponent;
  let fixture: ComponentFixture<AddAdditionalCostComponent>;
  let eaRestServiceMock: EaRestService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddAdditionalCostComponent, LocalizationPipe],
      imports: [HttpClientModule],
      providers: [
        { provide: EaRestService, useClass: MockEaRestService },
        { provide: TcoService, useClass: MockTcoService },
        { provide: TcoStoreService, useClass: MockTcoStoreService},
        LocalizationService,
        VnextService,
        VnextStoreService,
        ProjectStoreService,
        UtilitiesService,
        CurrencyPipe,
        ProposalStoreService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddAdditionalCostComponent);
    component = fixture.componentInstance;
    eaRestServiceMock = TestBed.inject(EaRestService);
    component.tcoObjId = '777';
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should add a new cost with `isExistingAdditionalCost` set to false when `addNewCost` is called', () => {
    component.additionalCosts = [];
    component.addNewCost();
    expect(component.additionalCosts.length).toBe(1);
  });

  it('should not add more than 10 additional costs', () => {
    component.additionalCosts = Array(10).fill({
      name: '',
      swPercent: "",
      cxPercent: "",
      bau: false,
      ea: false,
      isExistingAdditionalCost: false
    });
    component.addNewCost();
    expect(component.additionalCosts.length).toBe(10);
  });

  it('should remove cost from `additionalCosts` if it is not an existing cost', () => {
    component.additionalCosts = [
      { name: 'New Cost', swPercent: "", cxPercent: "", bau: true, ea: false }
    ];
    component.removeCost(0);
    expect(component.additionalCosts.length).toBe(0);
  });

  it('should disable the save button if any cost is invalid', () => {
    component.additionalCosts = [
      { name: '', swPercent: "", cxPercent: "", bau: true, ea: false }
    ];
    expect(component.isSaveDisabled()).toBe(true);

    component.additionalCosts[0].name = 'Valid Name';
    component.additionalCosts[0].swPercent = '15';
    component.additionalCosts[0].cxPercent = '15';
    expect(component.isSaveDisabled()).toBe(false);
  });

  it('should make API call to save additional costs and close the modal on success', () => {
    const putApiCallSpy = jest.spyOn(eaRestServiceMock, 'putApiCall');

    component.additionalCosts = [
      { name: 'Opex Cost', swPercent: "", cxPercent: "", bau: true, ea: true}
    ];
    component.saveAndContinue();

    expect(putApiCallSpy).toHaveBeenCalledWith(`proposal/tco/777/additional-cost`, {
     data: 
        { additionalCostAttributes: component.additionalCosts }
    });
  });

  it('should disable "Add New Cost" button when there are already 10 additional costs', () => {
    component.additionalCosts = Array(10).fill({
      name: '',
      swPercent: "",
      cxPercent: "",
      bau: false,
      ea: false,
      isExistingAdditionalCost: true
    });
    expect(component.isAddCostDisabled()).toBe(true);

    component.additionalCosts.pop();
    expect(component.isAddCostDisabled()).toBe(false);
  });
});
