import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AddPartnerContactComponent } from './add-partner-contact.component';
import { AddPartnerService } from './add-partner.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

const NgbActiveModalMock = {
   close: jest.fn().mockReturnValue('close')
}

describe('AddPartnerContactComponent', () => {
  let component: AddPartnerContactComponent;
  let fixture: ComponentFixture<AddPartnerContactComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPartnerContactComponent ],
      providers: [AddPartnerService,  { provide: NgbActiveModal, useValue: NgbActiveModalMock }],
      imports: [HttpClientModule],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPartnerContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call addContact', () => {
    component.createProposalContainer = [ {
        "title": "test",
        "ciscoId" : "test",
        "emailId": "test.com",
        "phoneNumber": "123445",
        "city": "test",
        "state": "CA",
        "country": "USA"
    }]
    component.addContact()
    expect(component).toBeTruthy();
  });

  
  it('call selectedValueCountry', () => {
    let event;
    component.selectedValueCountry(event)
    expect(component.searchBtn).toBe(false);
  });
  
  it('call showFilterResults', () => {
    component.firstName = 'null'
    component.showFilterResults()
    expect(component.showScroll).toBe(true);
    expect(component.cantFindContact ).toBe(true);

    component.firstName = 'test';
    const mock = [{
        "contactName": "Cisco Systems INC Service Operations",
        "title": "Network Support",
        "ciscoId": "memcgoni@cisco.com",
        "emailId": "john@cisco.com",
        "phoneNumber": "0123-456-7890",
        "city": "Raleigh",
        "state": "North Carolina",
        "country": "USA"
    }]
    const specialistService = fixture.debugElement.injector.get(AddPartnerService);
    jest.spyOn(specialistService, "getData").mockReturnValue(of(mock));
    component.showFilterResults()
    expect(component.showScroll).toBe(false);
    expect(component.cantFindContact ).toBe(false);
  });
  
  it('call checkPartnerValidation', () => {
    let data;
    component.firstName = '';
    component.checkPartnerValidation(data)
    expect(component.searchBtn).toBe(true);
  });

  it('call contactCheckbox', () => {
    let obj = [{
        "title": "test",
        "ciscoId" : "test",
        "emailId": "test.com",
        "phoneNumber": "123445",
        "city": "test",
        "state": "CA",
        "country": "USA",
        "contactSearchChecked": true
    }]
    let data = [{
        "title": "test",
        "ciscoId" : "test",
        "emailId": "test.com",
        "phoneNumber": "123445",
        "city": "test",
        "state": "CA",
        "country": "USA",
        "contactSearchChecked": true
    }]
    component.contactCheckbox(obj, data)
    expect(component.addPartnerBtn).toBe(false);

     obj = [{
        "title": "test",
        "ciscoId" : "test",
        "emailId": "test.com",
        "phoneNumber": "123445",
        "city": "test",
        "state": "CA",
        "country": "USA",
        "contactSearchChecked": false
    }]
     data = [{
        "title": "test",
        "ciscoId" : "test",
        "emailId": "test.com",
        "phoneNumber": "123445",
        "city": "test",
        "state": "CA",
        "country": "USA",
        "contactSearchChecked": false
    }]
    component.contactCheckbox(obj, data)
    expect(component.addPartnerBtn).toBe(true)
  });
  
  it('call selectedPartnersData', () => {
    component.searchData = [{
        "title": "test",
        "ciscoId" : "test",
        "emailId": "test.com",
        "phoneNumber": "123445",
        "city": "test",
        "state": "CA",
        "country": "USA",
        "contactSearchChecked": true
    }]
    component.selectedPartnersData();
    expect(component.selectedPartnerTable).toBe(false);
  });

  it('call addPartnerCheckbox', () => {
    let obj = [{
        "title": "test",
        "ciscoId" : "test",
        "emailId": "test.com",
        "phoneNumber": "123445",
        "city": "test",
        "state": "CA",
        "country": "USA",
        "checked": true
    }]
    let data = [{
        "title": "test",
        "ciscoId" : "test",
        "emailId": "test.com",
        "phoneNumber": "123445",
        "city": "test",
        "state": "CA",
        "country": "USA",
        "checked": true
    }]
    component.addPartnerCheckbox(obj, data)
    expect(component.toggleDoneBtn).toBe(false);

     obj = [{
        "title": "test",
        "ciscoId" : "test",
        "emailId": "test.com",
        "phoneNumber": "123445",
        "city": "test",
        "state": "CA",
        "country": "USA",
        "checked": false
    }]
     data = [{
        "title": "test",
        "ciscoId" : "test",
        "emailId": "test.com",
        "phoneNumber": "123445",
        "city": "test",
        "state": "CA",
        "country": "USA",
        "checked": false
    }]
    component.addPartnerCheckbox(obj, data)
    expect(component.toggleDoneBtn).toBe(true)
  });
  
});
