import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalDismissReasons, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { ViewAppliedFiltersComponent } from './view-applied-filters.component';
import { FiltersService, SelectedFilterJson } from '../../dashboard/filters/filters.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


//test-covered
describe('ViewAppliedFiltersComponent', () => {
  let component: ViewAppliedFiltersComponent;
  let fixture: ComponentFixture<ViewAppliedFiltersComponent>;
  let mockActiveModal: Partial<NgbActiveModal>;
  let mockModal: Partial<NgbModal>;
  let mockFiltersService: Partial<FiltersService>;

  beforeEach(async () => {
    mockActiveModal = {
      close: jest.fn()
    };


    mockModal = {
      open: jest.fn()
    };

    mockFiltersService = {
      updatedFilterMap: [
        { displayName: 'Filter 1' },
        { displayName: 'Filter 2' },
        { displayName: 'Filter 3' }
      ],
      getFiltersCount: jest.fn().mockReturnValue(3)
    };

    await TestBed.configureTestingModule({
      declarations: [ViewAppliedFiltersComponent],
      providers: [
        { provide: NgbActiveModal, useValue: mockActiveModal },
        { provide: NgbModal, useValue: mockModal },
        { provide: FiltersService, useValue: mockFiltersService },
      ],
      imports: [HttpClientModule],
      schemas: [NO_ERRORS_SCHEMA]

    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAppliedFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize appliedFilters and getCount properties', () => {
    expect(component.appliedFilters).toEqual(mockFiltersService.updatedFilterMap);
    expect(component.getCount).toBe(3);
  });

  it('should call activeModal.close() with an empty object', () => {

    component.closeModal();
    expect(mockActiveModal.close).toHaveBeenCalledWith({});
  });

  it('should return the correct reason when dismissing the modal', () => {

    expect(component['getDismissReason'](ModalDismissReasons.ESC)).toBe('by pressing ESC');


    expect(component['getDismissReason'](ModalDismissReasons.BACKDROP_CLICK)).toBe('by clicking on a backdrop');


    expect(component['getDismissReason']('Custom Reason')).toBe('with: Custom Reason');
  });


  it('should clear applied filters', () => {

    component.isSaveDisabled = true;
    component.headerCategoryCheck = true;
    component.appliedFilters = [{}, {}];
    component.countFilter = 2;
    component.disableClear = false;
    component.disableHeaderCheck = false;


    component.clearApplied();


    expect(component.isSaveDisabled).toBe(false);
    expect(component.headerCategoryCheck).toBe(false);
    expect(component.countFilter).toBe(0);
    expect(component.disableClear).toBe(true);
    expect(component.disableHeaderCheck).toBe(true);
  });

  it('should not disable clear if countFilter is greater than 0', () => {

    component.isSaveDisabled = true;
    component.headerCategoryCheck = true;
    component.appliedFilters = [{}, {}];
    component.countFilter = 3;
    component.disableClear = false;
    component.disableHeaderCheck = false;


    component.clearApplied();


    expect(component.disableClear).toBe(false);
  });


});


