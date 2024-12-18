import { CurrencyPipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EaRestService } from 'ea/ea-rest.service';
import { EaService } from 'ea/ea.service';
import { of } from 'rxjs';
import { MessageService } from 'vnext/commons/message/message.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { EaidStoreService } from 'vnext/eaid/eaid-store.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { VnextService } from 'vnext/vnext.service';

import { AdvancePartySearchComponent } from './advance-party-search.component';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
class MockEaRestService {
  getApiCall() {
    return of({
      data: {
        smartAccounts: [
          {
            smartAccName: "test",
          },
        ],
        hasEa2Entity: false,
      },
    });
  }
  postApiCall() {
    return of({
      data: {

      },
    });
  }
  getApiCallJson(){
    return of({
      data: {

      },
    });
  }
  getEampApiCall(){
    return of({
      data: {

      },
    });
  }
  downloadDocApiCall(){
    return of({
      data: {

      },
    });
  }
}
describe('AdvancePartySearchComponent', () => {
  let component: AdvancePartySearchComponent;
  let fixture: ComponentFixture<AdvancePartySearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancePartySearchComponent,LocalizationPipe ],
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([
       
      ])],
      schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],
      providers:[EaidStoreService,UtilitiesService,CurrencyPipe,NgbActiveModal,ProposalStoreService,VnextStoreService,ProjectStoreService,MessageService,VnextService,EaRestService,  EaService,{ provide: EaRestService, useClass: MockEaRestService }, LocalizationService, ElementIdConstantsService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancePartySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call reset', () => {
    component.reset()
    expect(component.searchLimitError).toBe(false);
  });
  it('should call displayExcelSearch', () => {
    component.displayExcelSearch()
    expect(component.searchLimitError).toBe(false);
  });
  it('should call search with invalidSerchIds', () => {
    component.searchIds = '12343 \n test'
    component.search()
    expect(component.invalidSerchIds.length).toBe(1);
  });
  it('should call search', () => {
    component.searchIds = '12343'
    component.search()
    expect(component.invalidSerchIds.length).toBe(0);
  });
  it('should call close', () => {
    component.close()
    expect(component.invalidSerchIds.length).toBe(0);
  });
  it('should call downloadErrorFile', () => {
    component.isEditEaidFlow = true
    component.downloadErrorFile()
    expect(component.searchWithExcel).toBe(false);
  });
  it('should call downloadErrorFile', () => {
    component.isEditEaidFlow = true
    component.downloadErrorFile()
    expect(component.searchWithExcel).toBe(false);
  });
  it('should call fileOverBase', () => {
    const e = 'test'
    component.fileOverBase(e)
    expect(component.hasBaseDropZoneOver).toEqual(e);
  });
  it('should call keyDown', () => {
    const event = {preventDefault: ()=>{}}
    component.keyDown(event)
    expect(component.searchWithExcel).toBe(false);
  });

  it('should call searchIdWithExcel', () => {
    component.fileDetail = {name: 'test'}
    component.isEditEaidFlow = true
    component.searchIdWithExcel()
    expect(component.searchWithExcel).toBe(false);
  });
  it('should call processFile', () => {
    const file = {name:'test'}
    component.processFile(file)
    expect(component.fileFormatError).toBe(true);
  });
  it('should call processFile uploadedFileName', () => {
    const file = {name:'test.xlsx'}
    component.processFile(file)
    expect(component.fileFormatError).toBe(false);
  });

});
