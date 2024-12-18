import { EventEmitter } from '@angular/core';
import { FiltersActionsComponent } from "./filters-actions.component";
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LocaleService } from '@app/shared/services/locale.service';
import { FiltersService } from '../filters.service';
import { ProductSummaryService } from '@app/dashboard/product-summary/product-summary.service';
import { ViewAppliedFiltersComponent } from '@app/modal/view-applied-filters/view-applied-filters.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";



fdescribe('FiltersActionsComponent', () => {
    let component: FiltersActionsComponent;
    let fixture: ComponentFixture<FiltersActionsComponent>;

class MockNgbModel{
  open(data){};
 
}
class MockFilterService{
  getFiltersState(){};

}
class MockProductSummaruService{

}



beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAppliedFiltersComponent, FiltersActionsComponent ],
      providers:[LocaleService,{provide: FiltersService, useClass: MockFilterService}, {provide:ProductSummaryService, useClass: MockProductSummaruService},{provide:NgbModal, useClass: MockNgbModel}],
      imports: [HttpClientTestingModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  
  it('should call windowclass', () => {
    const spy = fixture.debugElement.injector.get(NgbModal);
    const locale = jest.spyOn(spy, "open");
    component.ngOnInit();
    component.openViewAppliedFiltersModal();
    expect(component).toBeTruthy();
    expect(locale).toHaveBeenCalled();
    
  });
});
