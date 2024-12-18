import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SalesConnectComponent } from './sales-connect.component';
import { SalesConnectService } from './sales-connect.service';
import { NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { AppDataService } from '../services/app.data.service';
import { CurrencyPipe } from '@angular/common';
import { BlockUiService } from '../services/block.ui.service';
import { CopyLinkService } from '../copy-link/copy-link.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { ProposalPollerService } from '../services/proposal-poller.service';
import { SearchPipe } from '../pipes/search.pipe';
import { LocaleService } from '../services/locale.service';
import { ConstantsService } from '../services/constants.service';
import { of } from 'rxjs';
import { CreateProposalService } from '@app/proposal/create-proposal/create-proposal.service';
import { ActivatedRoute } from '@angular/router';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { TcoDataService } from '@app/tco/tco.data.service';
import { AppRestService } from '../services/app.rest.service';
import { UtilitiesService } from '../services/utilities.service';
import { PriceEstimationService } from '@app/proposal/edit-proposal/price-estimation/price-estimation.service';
import { PermissionService } from '@app/permission.service';
import { HttpClientModule } from '@angular/common/http';
import { MessageService } from '../services/message.service';

const fakeActivatedRoute = {
  snapshot: { data: { } }
} as ActivatedRoute

describe('SalesConnectComponent', () => {
  let component: SalesConnectComponent;
  let fixture: ComponentFixture<SalesConnectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesConnectComponent ],
      providers: [ SalesConnectService, Renderer2, ConstantsService, AppDataService,  PriceEstimationService, PermissionService, UtilitiesService, AppRestService, CurrencyPipe, BlockUiService, CopyLinkService, ProposalDataService, ProposalPollerService, SearchPipe, LocaleService, ConstantsService, CreateProposalService, {provide: ActivatedRoute, useValue: fakeActivatedRoute}, QualificationsService,TcoDataService, MessageService],
      imports: [HttpClientModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesConnectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call shareDocuments', () => {
    component.showCopy = false;
    component.shareDocuments()
    expect( component.showCopy).toBe(true);
  });

   it('call closeRecommends', () => {
    component.closeRecommends()
    expect(component.recommendContent).toBe(false);
  });

  it('call selectedFilter', () => {
    let event = {

    };
    let value = { 'val': 'Suite', 'selected': true }
    component.selectedFilter(event, value)
    expect(component.filterSelected).toEqual([{ 'val': 'Suite', 'selected': true }]);

    value = { 'val': 'Suite', 'selected': false }
    component.filterSelected = [{ 'val': 'Suite', 'selected': true }];
    component.selectedFilter(event, value)
    expect(component.filterSelected).toEqual([]);
  });

  it('call deleteSelection', () => {
    let value = { 'val': 'Suite', 'selected': true }
    component.filterSelected = [{ 'val': 'Suite', 'selected': true }];
    component.filterOptions = [{ 'val': 'Suite', 'selected': true }]
    component.deleteSelection(value)
    expect(component.filterSelected).toEqual([]);
  });

  it('call clearSelection', () => {
    component.filterSelected = [{ 'val': 'Suite', 'selected': true }];
    component.filterOptions = [{ 'val': 'Suite', 'selected': true }]
    component.clearSelection()
    expect(component.filterSelected).toEqual([]);
  });

  it('call selectAll', () => {
    let event = {
      "target" : {
        "checked" : true
      }
    };
    component.filterOptions = [{ 'val': 'Suite', 'selected': false }]
    component.selectAll(event)
    expect(component.filterSelected).toEqual([{ 'val': 'Suite', 'selected': true }]);

    event = {
      "target" : {
        "checked" : false
      }
    };
    component.filterOptions = [{ 'val': 'Suite', 'selected': true }]
    component.selectAll(event)
    expect(component.filterSelected).toEqual([]);
  });

  it('call getFileTypeClass', () => {
    let fileType = 'PPT'
    component.getFileTypeClass(fileType)
    let getFileTypeReturn = component.getFileTypeClass(fileType)
    expect(getFileTypeReturn).toEqual('icon-ppt1');

    fileType = 'PDF'
    component.getFileTypeClass(fileType)
    getFileTypeReturn = component.getFileTypeClass(fileType)
    expect(getFileTypeReturn).toEqual('icon-pdf1');

    fileType = 'DOC'
    component.getFileTypeClass(fileType)
    getFileTypeReturn = component.getFileTypeClass(fileType)
    expect(getFileTypeReturn).toEqual('icon-doc1');

    fileType = 'XLS'
    component.getFileTypeClass(fileType)
    getFileTypeReturn = component.getFileTypeClass(fileType)
    expect(getFileTypeReturn).toEqual('icon-xls1');
  });

  it('call close', () => {
    let evnt = {};
    component.close(evnt);
    expect(component.showCopy).toBe(false);
  })

 it('call  getData', () => {
  let res = {
    "recomendedContent" : {
      "documents" : [
        {
          "title": "test",
          "contentsubcategory": "test"
        }
      ]
    }
  }
  let salesService = fixture.debugElement.injector.get(SalesConnectService);
  jest.spyOn(salesService, 'getSalesData').mockReturnValue(of(res))
  component.getData();
  expect(component.salesData).toEqual(res);
  })

  it('call  getSalesConnectData', () => {
    let res = {
      "data" : {
        "recomendedContent" : {
          "documents" : [
            {
              "title": "test",
              "contentsubcategory": "test"
            }
          ]
        }
      }
     
    }
    let salesService = fixture.debugElement.injector.get(SalesConnectService);
    jest.spyOn(salesService, 'getSalesConnectSearchData').mockReturnValue(of(res))
    component.getSalesConnectData();
    expect(component.salesData).toEqual(res.data);
  })

  it('call  showRecommends', () => {
    let res = {
      "data" : {
        "recomendedContent" : {
          "documents" : [
            {
              "title": "test",
              "contentsubcategory": "test"
            }
          ]
        }
      }
     
    }
    let salesService = fixture.debugElement.injector.get(SalesConnectService);
    jest.spyOn(salesService, 'getSalesConnectSearchData').mockReturnValue(of(res))
    component.showRecommends();
    expect(component.recommendContent).toBe(true);
  })

  it('call  showDocumentDetail', () => {
    let res = {
      "data" : {
      }
    }
   let doc =  {
    "title": "test",
    "contentsubcategory": "test"
   } 
    let salesService = fixture.debugElement.injector.get(SalesConnectService);
    jest.spyOn(salesService, 'getRatingComment').mockReturnValue(of(res))
    component.showDocumentDetail(doc);
    expect(component.showProposalDetail).toBe(true);
  })
});
