import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceSearchPartiersComponent } from './advance-search-parties.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { EaidStoreService } from 'vnext/eaid/eaid-store.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { CurrencyPipe } from '@angular/common';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { EaService } from 'ea/ea.service';
import { EaRestService } from 'ea/ea-rest.service';
import { VnextService } from 'vnext/vnext.service';
import { MessageService } from 'vnext/commons/message/message.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { LocalizationPipe } from '../pipes/localization.pipe';
import { of } from 'rxjs';

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

describe('AdvanceSearchPartiersComponent', () => {
  let component: AdvanceSearchPartiersComponent;
  let fixture: ComponentFixture<AdvanceSearchPartiersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvanceSearchPartiersComponent, LocalizationPipe ],
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([
       
      ])],
      schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],
      providers:[EaidStoreService,UtilitiesService,CurrencyPipe,ProposalStoreService,VnextStoreService,ProjectStoreService,MessageService,VnextService,  EaService,{ provide: EaRestService, useClass: MockEaRestService }, LocalizationService, ElementIdConstantsService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvanceSearchPartiersComponent);
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

  it('should call close', () => {
    let projectStoreService = fixture.debugElement.injector.get(ProjectStoreService);
    component.close()
    expect(projectStoreService.showHideAdvanceSearch).toBe(false);
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

  it('should call apply', () => {
    let projectStoreService = fixture.debugElement.injector.get(ProjectStoreService);
    component.searchIds = '123423';
    component.apply();
    expect(projectStoreService.showHideAdvanceSearch).toBe(false);
  });
});
