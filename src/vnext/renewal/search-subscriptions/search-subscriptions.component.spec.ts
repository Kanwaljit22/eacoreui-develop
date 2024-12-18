import { TestBed, ComponentFixture } from '@angular/core/testing';
import { SearchSubscriptionsComponent } from './search-subscriptions.component';
import { ClickOutsideDirective } from './click-outside.directive';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { IRenewalSubscription } from 'vnext/proposal/proposal-store.service';

describe('SearchSubscriptionsComponent', () => {
  let component: SearchSubscriptionsComponent;
  let fixture: ComponentFixture<SearchSubscriptionsComponent>;

  const mockSubscriptions: IRenewalSubscription[] = [
    { subRefId: 'SUB14000', startDateStr: '01-Jan-2024', endDateStr: '01-Jan-2025', selected: false, offerType: 'EA 3.0', statusDesc: 'Active', partnerName: 'Partner 1', typeDesc: 'Early Renewal' },
    { subRefId: 'SUB14001', startDateStr: '01-Feb-2024', endDateStr: '01-Feb-2025', selected: false, offerType: 'EA 2.0', statusDesc: 'Inactive', partnerName: 'Partner 2', typeDesc: 'Standard Renewal' },
    { subRefId: 'SUB14002', startDateStr: '01-Mar-2024', endDateStr: '01-Mar-2025', selected: false, offerType: 'A-Flex', statusDesc: 'Active', partnerName: 'Partner 3', typeDesc: 'Standard Renewal' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SearchSubscriptionsComponent,
        ClickOutsideDirective,
        LocalizationPipe
      ],
      imports: [HttpClientModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSubscriptionsComponent);
    component = fixture.componentInstance;
    component.searchedSubscriptions = [...mockSubscriptions]; // Provide mock data
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter subscriptions based on search terms', () => {
    component.onSearch({ value: 'SUB14000' });
    fixture.detectChanges();
    expect(component.searchedSubscriptions.length).toBe(1);
    expect(component.searchedSubscriptions[0].subRefId).toBe('SUB14000');
  });

  it('should select only one subscription when clicked', () => {
    component.selectSubscription(component.searchedSubscriptions[0]);
    fixture.detectChanges();
    expect(component.searchedSubscriptions[0].selected).toBe(true);
    expect(component.searchedSubscriptions.slice(1).every(sub => !sub.selected)).toBe(true);

    component.selectSubscription(component.searchedSubscriptions[1]);
    fixture.detectChanges();
    expect(component.searchedSubscriptions[0].selected).toBe(false);
    expect(component.searchedSubscriptions[1].selected).toBe(true);
  });

  it('should deselect the subscription if clicked again', () => {
    component.selectSubscription(component.searchedSubscriptions[0]);
    fixture.detectChanges();
    expect(component.searchedSubscriptions[0].selected).toBe(true);

    component.selectSubscription(component.searchedSubscriptions[0]);
    fixture.detectChanges();
    expect(component.searchedSubscriptions[0].selected).toBe(false);
  });

  it('should update anyItemSelected when a subscription is selected', () => {
    component.selectSubscription(component.searchedSubscriptions[0]);
    fixture.detectChanges();
    expect(component.anyItemSelected).toBe(true);

    component.selectSubscription(component.searchedSubscriptions[0]);
    fixture.detectChanges();
    expect(component.anyItemSelected).toBe(false);
  });
});
