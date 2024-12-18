import { NgPaginationComponent } from './ng-pagination.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { EaService } from 'ea/ea.service';
import { EaRestService } from 'ea/ea-rest.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('NgPaginationComponent', () => {
  let component: NgPaginationComponent;
  let fixture: ComponentFixture<NgPaginationComponent>;
  class MockEaService {
    getLocalizedString(){}
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NgPaginationComponent ],
      imports: [HttpClientModule, RouterTestingModule,NgbPaginationModule],
      providers:[EaRestService,{ provide: EaService, useClass: MockEaService }],
      schemas:[NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgPaginationComponent);
    component = fixture.componentInstance;
    component.paginationObject ={
        'noOfRecords': 0,
        "currentPage": 0,
        "pageSize": 0,
        "noOfPages": 0
      }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  }); 

  it('pageChange', () => {
    const value = 'pageSize'
    component.pageChange(value);

  }); 
  it('pageChange', () => {
    const value = 'pageValue'
    component.pageChange(value);
    
  }); 
  it('should call getResultInitial', () => {
    component.paginationObject ={
      'noOfRecords': 0,
      "currentPage": 2,
      "pageSize": 50,
      "noOfPages": 0
    }
    const value = component.getResultInitial();
    expect(value).toEqual(51);
  }); 

  it('should call getResultEnd', () => {

    const value = component.getResultEnd();
    expect(value).toEqual(0);
  }); 
});
