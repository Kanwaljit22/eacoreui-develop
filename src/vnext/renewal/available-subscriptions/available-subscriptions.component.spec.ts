import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvailableSubscriptionsComponent } from './available-subscriptions.component';
import { FormsModule } from '@angular/forms';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { CreateProposalStoreService } from 'vnext/proposal/create-proposal/create-proposal-store.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';

const availableMockData = [
  {
    "subRefId": "SR202333",
    "status": "ACTIVE",
    "startDateStr": "26-Jun-2024",
    "endDateStr": "25-Aug-2029",
    "subscriptionId": "SC110793",
    "statusDesc": "Active",
    "offerType": "EA 3.0",
    "partner": { "beGeoName": "ACIERNET USA INC" },
    "suites": ["Services: Cisco DNA Wireless", "Cisco DNA Wireless"],
    "daysLeft": 1830,
    "masterAgreementId": "EA51459",
    "typeDesc": "Early",
    "selected": false
  },
  {
    "subRefId": "SR202438",
    "status": "ACTIVE",
    "startDateStr": "18-Jun-2024",
    "endDateStr": "17-Jun-2027",
    "subscriptionId": "SC110898",
    "statusDesc": "Active",
    "offerType": "EA 3.0",
    "partner": { "beGeoName": "D&H DISTRIBUTING COMPANY" },
    "suites": ["Cisco DNA Switching", "Services: Cisco DNA Switching"],
    "daysLeft": 1030,
    "masterAgreementId": "EA52435",
    "typeDesc": "Early",
    "selected": false
  }
];

const otherMockData = [
  {
    "subRefId": "SR202333",
    "status": "ACTIVE",
    "startDateStr": "26-Jun-2024",
    "endDateStr": "25-Aug-2029",
    "subscriptionId": "SC110793",
    "statusDesc": "Active",
    "offerType": "EA 3.0",
    "partner": { "beGeoName": "ACIERNET USA INC" },
    "suites": ["Services: Cisco DNA Wireless", "Cisco DNA Wireless"],
    "daysLeft": 1830,
    "masterAgreementId": "EA51459",
    "typeDesc": "Early",
    "selected": false
  }
];

describe('AvailableSubscriptionsComponent', () => {
  let component: AvailableSubscriptionsComponent;
  let fixture: ComponentFixture<AvailableSubscriptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AvailableSubscriptionsComponent, LocalizationPipe],
      providers:[CreateProposalStoreService, ProposalStoreService],
      imports: [FormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableSubscriptionsComponent);
    component = fixture.componentInstance;

    component.availableSubscriptions = availableMockData;
    component.otherSubscriptions = otherMockData;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle all available subscriptions', () => {
    expect(component.allAvailableSelected).toBeFalsy();
    expect(component.availableSubscriptions.every(sub => sub.selected === false)).toBeTruthy();

    component.toggleAllAvailableSelection();
    fixture.detectChanges();

    expect(component.allAvailableSelected).toBeTruthy();
    expect(component.availableSubscriptions.every(sub => sub.selected === true)).toBeTruthy();

    component.toggleAllAvailableSelection();
    fixture.detectChanges();

    expect(component.allAvailableSelected).toBeFalsy();
    expect(component.availableSubscriptions.every(sub => sub.selected === false)).toBeTruthy();
  });

  it('should toggle all other subscriptions', () => {
    expect(component.allOtherSelected).toBeFalsy();
    expect(component.otherSubscriptions.every(sub => sub.selected === false)).toBeTruthy();

    component.toggleAllOtherSelection();
    fixture.detectChanges();

    expect(component.allOtherSelected).toBeTruthy();
    expect(component.otherSubscriptions.every(sub => sub.selected === true)).toBeTruthy();

    component.toggleAllOtherSelection();
    fixture.detectChanges();

    expect(component.allOtherSelected).toBeFalsy();
    expect(component.otherSubscriptions.every(sub => sub.selected === false)).toBeTruthy();
  });

  it('should toggle individual subscription selection', () => {
    expect(component.availableSubscriptions[0].selected).toBeFalsy();

    component.toggleSelection(component.availableSubscriptions[0]);
    fixture.detectChanges();

    expect(component.availableSubscriptions[0].selected).toBeTruthy();

    component.toggleSelection(component.availableSubscriptions[0]);
    fixture.detectChanges();

    expect(component.availableSubscriptions[0].selected).toBeFalsy();
  });

  it('should emit event when subscription is toggled', () => {
    const emitSpy = jest.spyOn(component.subscriptionChecked, 'emit');

    // Toggle selection
    component.toggleSelection(component.availableSubscriptions[0]);
    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalledWith(availableMockData[0]);
  });

  it('should update allAvailableSelected and allOtherSelected flags correctly', () => {
    component.toggleAllAvailableSelection();
    fixture.detectChanges();

    expect(component.allAvailableSelected).toBeTruthy();
    expect(component.availableSubscriptions.every(sub => sub.selected)).toBeTruthy();

    component.toggleAllOtherSelection();
    fixture.detectChanges();

    expect(component.allOtherSelected).toBeTruthy();
    expect(component.otherSubscriptions.every(sub => sub.selected)).toBeTruthy();

    component.toggleSelection(component.availableSubscriptions[0]);
    fixture.detectChanges();

    expect(component.allAvailableSelected).toBeFalsy();
    expect(component.availableSubscriptions[0].selected).toBeFalsy();
  });

  it('should correctly set allAvailableSelected and allOtherSelected based on subscriptions', () => {
    // Case 1: Both subscriptions arrays are populated, and all items are selected
    component.availableSubscriptions = availableMockData.map(sub => ({ ...sub, selected: true }));
    component.otherSubscriptions = otherMockData.map(sub => ({ ...sub, selected: true }));
  
    component.checkAllSelected();
    fixture.detectChanges();
  
    expect(component.allAvailableSelected).toBeTruthy();
    expect(component.allOtherSelected).toBeTruthy();
  
    // Case 2: availableSubscriptions has unselected items
    component.availableSubscriptions[0].selected = false;
  
    component.checkAllSelected();
    fixture.detectChanges();
  
    expect(component.allAvailableSelected).toBeFalsy();
    expect(component.allOtherSelected).toBeTruthy();
  
    // Case 3: otherSubscriptions has unselected items
    component.availableSubscriptions = availableMockData.map(sub => ({ ...sub, selected: true })); // Reset availableSubscriptions to selected
    component.otherSubscriptions[0].selected = false;
  
    component.checkAllSelected();
    fixture.detectChanges();
  
    expect(component.allAvailableSelected).toBeTruthy();
    expect(component.allOtherSelected).toBeFalsy();
  
    // Case 4: Empty availableSubscriptions and otherSubscriptions arrays
    component.availableSubscriptions = [];
    component.otherSubscriptions = [];
  
    component.checkAllSelected();
    fixture.detectChanges();
  
    expect(component.allAvailableSelected).toBeFalsy();
    expect(component.allOtherSelected).toBeFalsy();
  
    // Case 5: availableSubscriptions or otherSubscriptions is undefined
    component.availableSubscriptions = undefined;
    component.otherSubscriptions = undefined;
  
    component.checkAllSelected();
    fixture.detectChanges();
  
    expect(component.allAvailableSelected).toBeFalsy();
    expect(component.allOtherSelected).toBeFalsy();
  });
  
});
