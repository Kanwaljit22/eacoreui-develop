import { of, Subject } from 'rxjs';
import { NgbTooltip, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { EaRestService } from 'ea/ea-rest.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { VnextService } from 'vnext/vnext.service';
import { ProposalRestService } from 'vnext/proposal/proposal-rest.service';
import { PriceEstimateStoreService } from 'vnext/proposal/edit-proposal/price-estimation/price-estimate-store.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { ProposalService } from 'vnext/proposal/proposal.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PriceEstimateService } from 'vnext/proposal/edit-proposal/price-estimation/price-estimate.service';
import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';

import { SpnaSuitesCellComponent } from './spna-suites-cell.component';
import { CurrencyPipe } from '@angular/common';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';

class MockProposalRestService {
  postApiCall() {
    return of({
      data: {

      },
      error: false
    })
  }
}
class MockPriceEstimateService {
  setEnrollmentsDiscLovs() {
    return of({
      data: {

      },
      error: false
    })
  }
  updatedTiresMap = new Map([
    ['test', []]
  ]);
  messageMap = new Map([
    ['test', []],
    ['ATO-test', []],
    ['ATO-WARN-test', []]

  ]);
}
describe('SpnaSuitesCellComponent', () => {
  let component: SpnaSuitesCellComponent;
  let fixture: ComponentFixture<SpnaSuitesCellComponent>;
  let proposalRestService = new MockProposalRestService();
  let priceEstimateService = new MockPriceEstimateService();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, NgbTooltip],
      declarations: [ SpnaSuitesCellComponent ],
      providers: [{provide: PriceEstimateService, useValue: priceEstimateService}, PriceEstimateStoreService,ProposalStoreService, ProposalService, UtilitiesService, CurrencyPipe, {provide: ProposalRestService, useValue: proposalRestService},
                  VnextService, VnextStoreService, ProjectStoreService, EaRestService, DataIdConstantsService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpnaSuitesCellComponent);
    component = fixture.componentInstance;
    let params = {
      colDef: {headerName: 'Solutions & Suites', field: 'poolSuiteLineName', cellRenderer: 'agGroupCellRenderer', width: 630, suppressSizeToFit: true},
      column: 'status',
      value: 'test-value',
      data: {
        enrollmentId: 5,
        tiers: [{name: 'test'}],
        ato: 'test'
      },
      node: {
        level: 2
      }

    };
    component.agInit(params);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call refresh', () => {
    expect(component.refresh()).toBe(false)
  });

  it('call applyDiscount', () => {
    component.applyDiscount(component.params.data, component.params);
    component.params.data.enrollmentId = 1;
    component.applyDiscount(component.params.data, component.params);
    expect(component.params.data).toBeTruthy();
  });

  it('call isMultiSuiteDiscout', () => {
    expect(component.isMultiSuiteDiscout()).toBe(false)
    component.params.data.multiProgramDesc = {
      med: 'test'
    }
    expect(component.isMultiSuiteDiscout()).toBe(true)
  });
  it('call isMultiSuiteDiscout STO_REL', () => {
    component.eaService.features.STO_REL = true
    component.params.data.multiProgramDesc = {
      med: 'test'
    }
    expect(component.isMultiSuiteDiscout()).toBe(true)
  });
  it('call changeAtoSelection', () => {
    const tierObj = {name: 'test',selected: false}
   component.priceEstimateService.updateTierForAtoSubject = new Subject();
    component.selectedTier = {name: 'test1'}
    component.changeAtoSelection(tierObj)
    expect(tierObj.selected).toBe(true)
  });
  it('call updateTier', () => {
   component.priceEstimateService.addMoreSuitesFromGrid = new Subject();
    component.updateTier()
    expect(component.showDropdown).toBe(false)
  });
  it('call hideTooltip', () => {
    const tooltip = {close: ()=>{}}
     component.hideTooltip(tooltip)
     expect(component.showDropdown).toBe(false)
   });
   it('call showTooltip', () => {
    const tooltip = {open: ()=>{},_elementRef:{nativeElement:{offsetWidth:1, scrollWidth:2}}}
     component.showTooltip(tooltip)
     expect(component.showDropdown).toBe(false)
   });
   it('call openDesriredQtyPopup', () => {
    component.priceEstimateService.openDesriredQtySubject = new Subject();
    const params = {data:{enrollmentId:1}}
     component.openDesriredQtyPopup(params)
     expect(component.showDropdown).toBe(false)
   });
   it('call openDesriredQtyPopup e= 6', fakeAsync(() => {
    component.priceEstimateStoreService.externalConfigReq.configure = [{atoName: 'test'}]
    component.priceEstimateService.openDesriredQtySubject = new Subject();
    const params = {data:{ato:'test',enrollmentId:6,pidType:'COLLAB'}}
     component.openDesriredQtyPopup(params)
     tick(150);
     expect(component.showDropdown).toBe(false)
     flush();
    }));
    it('call openDrop', () => {
      const event = {clientY:0}
      const params = {node:{expanded:true},showDropdown: false}
       component.openDrop(event,params)
       expect(component.showDropdown).toBe(false)
     });

     it('call applyDiscount', () => {
      component.eaService.features.NPI_AUTOMATION_REL = true
      component.params.data.enrollmentId = 1;
      component.applyDiscount(component.params.data, component.params);
      expect(component.params.data).toBeTruthy();
    });
});
