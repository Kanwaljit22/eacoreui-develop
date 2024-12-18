import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchLocateComponent } from './search-locate.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Renderer2 } from '@angular/core';
import { SearchLocateService } from './search-locate.service';
import { IbSummaryService } from '../../ib-summary/ib-summary.service';
import { LocaleService } from '@app/shared/services/locale.service';

describe('SearchLocateComponent', () => {
  let component: SearchLocateComponent;
  let fixture: ComponentFixture<SearchLocateComponent>;
  let mockSearchService: Partial<SearchLocateService>;
  let mockIbSummaryService: Partial<IbSummaryService>;
  let mockActiveModal: Partial<NgbActiveModal>;
  let renderer: Renderer2;

  beforeEach(() => {
    mockSearchService = {
      searchSalesOrder: true,
      searchContract: false,
      searchInstall: false,
      searchSerial: false,
      searchSubscription: false,
    };

    mockIbSummaryService = {
      locateData: [],
      searchColumnName: 'SALES_ORDER_NUMBER',
    };

    mockActiveModal = {
      close: jest.fn(),
      dismiss: jest.fn(),
    };

    TestBed.configureTestingModule({
      declarations: [SearchLocateComponent],
      providers: [
        { provide: SearchLocateService, useValue: mockSearchService },
        { provide: IbSummaryService, useValue: mockIbSummaryService },
        { provide: NgbActiveModal, useValue: mockActiveModal },
        Renderer2,
        LocaleService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchLocateComponent);
    component = fixture.componentInstance;
    renderer = TestBed.inject(Renderer2);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize values correctly on ngOnInit', () => {
    component.ngOnInit();
    expect(component.salesOrder).toBe('');
    expect(component.installSite).toBe('');
    expect(component.searchSalesOrder).toBe(true);
    expect(component.searchContract).toBe(false);
    expect(component.searchInstall).toBe(false);
  });

  it('should close the active modal with locateData on locate()', () => {
    component.modelArr = ['data1', 'data2'];
    component.locate();
    expect(mockActiveModal.close).toHaveBeenCalledWith({ locateData: ['data1', 'data2'] });
  });

  it('should clear all data on clearAll()', () => {
    component.modelArr = ['data1', 'data2'];
    component.clearAll();
    expect(component.modelArr.length).toBe(0);
    expect(mockIbSummaryService.locateData.length).toBe(0);
  });

  it('should dismiss the active modal on cancel()', () => {
    component.cancel();
    expect(component.modelArr.length).toBe(0);
    expect(mockActiveModal.dismiss).toHaveBeenCalledWith('Cross click');
  });

  it('should remove selected item from modelArr', () => {
    component.modelArr = ['data1', 'data2'];
    component.removeSelected('data1');
    expect(component.modelArr).toEqual(['data2']);
  });

  //it('should focus on appropriate input field based on search type', () => {
    //jest.spyOn(renderer, 'selectRootElement').mockReturnValue({ focus: jest.fn() });
    //component.searchSalesOrder = true;
    //component.inputFocus();
    //expect(renderer.selectRootElement).toHaveBeenCalledWith('#salesOrder');
 // });

  it('should add value to modelArr on keyUp with valid input', () => {
    const mockEvent = { keyCode: 188, which: 0, key: 'Enter' };
    component.keyUp(mockEvent, 'value1');
    expect(component.modelArr).toContain('value1');
  });

  //it('should prevent invalid keyDown input based on searchColumnName', () => {
   // const mockEvent = { keyCode: 65, preventDefault: jest.fn(), shiftKey: false };
   //component.keyDown(mockEvent);
   // expect(mockEvent.preventDefault).toHaveBeenCalled();
  //});

  it('should allow valid keyDown input', () => {
    const mockEvent = { keyCode: 8, preventDefault: jest.fn(), shiftKey: false };
    component.keyDown(mockEvent);
    expect(mockEvent.preventDefault).not.toHaveBeenCalled();
  });

  //it('should reset input values when modelArr exceeds 250 items on keyUp', () => {
  //  component.modelArr = new Array(249).fill('value');
   // component.keyUp({ keyCode: 188, key: 'Enter' }, 'newValue');
   // expect(component.modelArr.length).toBe(250);
   // expect(component.salesOrder).toBe("");
 /// });

  //it('should handle pasted input on keyUp correctly', () => {
   // const mockEvent = { ctrlKey: true, which: 86, key: 'v' };
   // component.keyUp(mockEvent, '123,456,789');
   // expect(component.modelArr).toEqual(['123', '456', '789']);
  //});
});