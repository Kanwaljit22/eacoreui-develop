import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageColumnsComponent } from './manage-columns.component';
import { AppDataService } from '../services/app.data.service';
import { CreditOverviewService } from '../credits-overview/credit-overview.service';
import { BlockUiService } from '../services/block.ui.service';
import { SimpleChange, SimpleChanges } from '@angular/core';

describe('ManageColumnsComponent', () => {
  let component: ManageColumnsComponent;
  let fixture: ComponentFixture<ManageColumnsComponent>;
  let appDataService: AppDataService;
  let creditOverviewService: CreditOverviewService;
  let blockUiService: BlockUiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageColumnsComponent ],
      providers: [
        { provide: AppDataService, useValue: {} },
        { provide: CreditOverviewService, useValue: { manageColumnEmitter: { emit: jest.fn() } } },
        { provide: BlockUiService, useValue: { spinnerConfig: { customBlocker: false } } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageColumnsComponent);
    component = fixture.componentInstance;
    appDataService = TestBed.inject(AppDataService);
    creditOverviewService = TestBed.inject(CreditOverviewService);
    blockUiService = TestBed.inject(BlockUiService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize spinnerConfig customBlocker to false on init', () => {
    component.ngOnInit();
    expect(blockUiService.spinnerConfig.customBlocker).toBe(false);
  });

  //it('should prepare column data on changes', () => {
    //const changes: SimpleChanges = {
    //  columnDefs: new SimpleChange(null, [{ field: 'test', headerName: 'Test' }], false)
    //};
    //component.ngOnChanges(changes);
    //expect(component.columnList.length).toBe(1);
   // expect(component.selectedColumnCount).toBe(1);
 // });

  it('should toggle displayManageColumns on showHideManagerColumns', () => {
    component.displayManageColumns = false;
    component.showHideManagerColumns();
    expect(component.displayManageColumns).toBe(true);
    component.showHideManagerColumns();
    expect(component.displayManageColumns).toBe(false);
  });

  it('should change column status', () => {
    const col = { field: 'test', colName: 'Test', checked: true };
    component.columnList = [col];
    component.selectedColumnCount = 1;
    component.changeColumnStatus(col);
    expect(col.checked).toBe(false);
    expect(component.selectedColumnCount).toBe(0);
    component.changeColumnStatus(col);
    expect(col.checked).toBe(true);
    expect(component.selectedColumnCount).toBe(1);
  });

  it('should change selection of all columns', () => {
    const col1 = { field: 'test1', colName: 'Test1', checked: true };
    const col2 = { field: 'test2', colName: 'Test2', checked: true };
    component.columnList = [col1, col2];
    component.selectedColumnCount = 2;
    component.changeSelectionOfAllColumns();
    expect(component.selectAllColumns).toBe(false);
    expect(component.selectedColumnCount).toBe(0);
    expect(col1.checked).toBe(false);
    expect(col2.checked).toBe(false);
    component.changeSelectionOfAllColumns();
    expect(component.selectAllColumns).toBe(true);
    expect(component.selectedColumnCount).toBe(2);
    expect(col1.checked).toBe(true);
    expect(col2.checked).toBe(true);
  });

  it('should emit column list on changeGridView', () => {
    const col = { field: 'test', colName: 'Test', checked: true };
    component.columnList = [col];
    component.changeGridView();
    expect(component.displayManageColumns).toBe(false);
    expect(creditOverviewService.manageColumnEmitter.emit).toHaveBeenCalledWith(component.columnList);
  });
});
