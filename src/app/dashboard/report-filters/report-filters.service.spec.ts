import {  TestBed, waitForAsync } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { AppDataService } from "@app/shared/services/app.data.service";
import { ReportFiltersService } from "./report-filters.service";


describe('ReportFiltersService', () => {
  let service: ReportFiltersService;
  let httpTestingController: HttpTestingController;
  const url = "https://localhost:4200/";


  class MockAppDataService{
   get getAppDomain(){
        return url;
      }
      userInfo ={
        userId:"123"
      }
  }
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        ReportFiltersService,
        { provide: AppDataService, useClass:MockAppDataService }

      ],
      imports: [HttpClientTestingModule],

    })
      .compileComponents();
    service = TestBed.inject(ReportFiltersService);
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  it('should call getDefaultFilters', () => {
    service.defaultFilters =[];
    const result = service.getDefaultFilters();
    expect(result).toEqual([]);
  });

  it('should call getFilters', () => {
    service.filters =[];
    const result = service.getFilters();
    expect(result).toEqual([]);
  });

  it('should call getAppliedFilters', () => {
    service.updatedFilters =[];
    const result = service.getAppliedFilters();
    expect(result).toEqual([]);
  });

  it('should call applyFilters', () => {
     service.applyFilters([]);
    expect(service.appliedFilters).toEqual([]);
  });

  it('should call getFiltersState', () => {
    service.showFilters = true;
    const result = service.getFiltersState();
    expect(result).toBeTruthy();
  });

  it('should call applyFilters', () => {
    service.showFilters = true;
    service.activePanelsMap = [1];
    service.activePanels = [];
    jest.spyOn(service.activePanels,'push')
    service.toggleFiltersState('');

   expect(service.showFilters).toBeFalsy();
   expect(service.activePanels).toEqual([1]);

 });

 it('should call getFiltersCount', () => {
    service.updatedFilterMap = [1,2,3];
    service.count = 0;
    const result = service.getFiltersCount();
    expect(result).toBe(3);
  });

  it('should call clearSalesLevelArray', () => {
    service.defaultFilters = [{
        filters:[{name:'salesLevel'}],
        filteredLevels:[],
        selected:[],
        levels_name:[1]
    }];
    jest.spyOn(service.defaultFilters , 'forEach')
     service.clearSalesLevelArray();
    expect(service.defaultFilters.forEach).toBeCalled();
  });

  it('should call toggleFilters', () => {
    service.showHideFilters =false;
    service.toggleFilters();
    expect(service.showHideFilters).toBeTruthy();
  });

  it('should call hideFilters', () => {
    service.activePanelsMap = [1];
    service.activePanels = [];
    service.hideFilters();
    expect(service.activePanels).toEqual([1]);
  });

});