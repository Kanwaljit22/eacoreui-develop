import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RemoveAdditionalCostComponent } from './remove-additional-cost.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { EaRestService } from 'ea/ea-rest.service';
import { TcoStoreService } from 'vnext/tco/tco-store.service';
import { TcoService } from 'vnext/tco/tco.service';
import { VnextService } from 'vnext/vnext.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { CurrencyPipe } from '@angular/common';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';

class MockEaRestService {
  deleteApiCall(url: string) {
    return of({ data: { test: "default response" } });
  }
}

class MockTcoStoreService {
  tcoData: any = {
    objId: '456',
    alc: {
      additionalCosts: []
    }
  };
}

class MockTcoService {
  addAdditionalCost = true;
  mapTcoData(){}
  refreshGraph = { next: jest.fn() };
}

describe('RemoveAdditionalCostComponent', () => {
  let component: RemoveAdditionalCostComponent;
  let fixture: ComponentFixture<RemoveAdditionalCostComponent>;
  let mockActiveModal: NgbActiveModal;
  let mockEaRestService: MockEaRestService;

  beforeEach(async () => {
    mockActiveModal = { close: jest.fn() } as any;
    mockEaRestService = new MockEaRestService();

    await TestBed.configureTestingModule({
      declarations: [RemoveAdditionalCostComponent],
      providers: [
        { provide: TcoService, useClass: MockTcoService },
        { provide: TcoStoreService, useClass: MockTcoStoreService },
        { provide: NgbActiveModal, useValue: mockActiveModal },
        { provide: EaRestService, useValue: mockEaRestService },
        VnextService,
        VnextStoreService,
        ProjectStoreService,
        ProposalStoreService,
        UtilitiesService,
        CurrencyPipe,

      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveAdditionalCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call removeCost() and make API call with correct URL', () => {
    component.additionalCost = { id: '123', tcoObjId: '456', name: 'CostName' };
    const expectedUrl = 'proposal/tco/456/additional-cost/123';
    jest.spyOn(mockEaRestService, 'deleteApiCall').mockReturnValue(of({ data: { test: "default response" } }));

    component.removeCost();

    expect(mockEaRestService.deleteApiCall).toHaveBeenCalledWith(expectedUrl);
  });

  it('should call close() when removeCost() is successful', () => {
    component.additionalCost = { name: 'CostName' };
    const deleteApiCall = jest.spyOn(mockEaRestService, 'deleteApiCall').mockReturnValue(of({ data: { test: "default response" } }));
  
    component.removeCost();
  
    expect(deleteApiCall).toHaveBeenCalled();
    expect(mockActiveModal.close).toHaveBeenCalled();
  });
  
});
