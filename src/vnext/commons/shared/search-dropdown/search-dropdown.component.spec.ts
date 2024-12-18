import { CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EaRestService } from 'ea/ea-rest.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { ProjectRestService } from 'vnext/project/project-rest.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { ProjectService } from 'vnext/project/project.service';
import { VnextService } from 'vnext/vnext.service';

import { SearchDropdownComponent } from './search-dropdown.component';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';

describe('SearchDropdownComponent', () => {
  let component: SearchDropdownComponent;
  let fixture: ComponentFixture<SearchDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchDropdownComponent ],
      providers: [ProjectService, VnextStoreService, ProjectStoreService, ProjectRestService, VnextService, UtilitiesService, CurrencyPipe, EaRestService, ProposalStoreService, DataIdConstantsService],
      imports: [HttpClientModule, RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchDropdownComponent);
    component = fixture.componentInstance;
    component.searchDropdown = [
      {
        "id": "partyName",
        "name": "Party Name"
      }
    ];
    component.searchValue = ''
    fixture.detectChanges();
  });

  it('shoud call ngOnInit', () => {
    let projectService = fixture.debugElement.injector.get(ProjectService);
    projectService.clearSearchInput.next(true);

    component.ngOnInit()
    expect(component.searchValue).toEqual('');
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call selectDrop', () => {
    const value = {
      "id": "partyId",
      "name": "Party Id"
    }
    component.selectDrop(value)
    expect(component.selectedDropValue).toEqual(value);
  });

  it('should call closeSearch', () => {
    component.closeSearch()
    expect(component.showClose).toBe(false)
  });

  it('should call search', () => {
    component.searchValue = 'test'
    component.search()
    expect(component.showClose).toBe(true)
    component.searchValue = 'te'
    component.search()
    expect(component.search()).toBeUndefined();
  });
  
});
