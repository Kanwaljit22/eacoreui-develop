import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { HeaderRendererComponent } from "./header-renderer.component";
import { ProductSummaryService } from "../product-summary.service";

xdescribe('HeaderRendererComponent', () => {
    let component: HeaderRendererComponent;
    let fixture: ComponentFixture<HeaderRendererComponent>;


    class MockProductSummaryService {
        sortColumnname = "test";
        sortOrder = "dummy";
    }

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [HeaderRendererComponent],
            providers: [{ provide: ProductSummaryService, useClass: MockProductSummaryService }],
        }).compileComponents();
    }));


    beforeEach(() => {
        fixture = TestBed.createComponent(HeaderRendererComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy()
    })
    // it('should set the unSortIcon to false if the columnId matches the sortColumnname', () => {
    //     component.columnName = "test";
    //     component.agInit({ displayName: 'displayName', column: { colId: 'test' } });
    //     fixture.detectChanges();
    //     expect(component.unSortIcon).toBe(false);
    //     expect(component.sortIcon).toBe('dummy');
    // });

    // it('should call the setSorting method with the given sort and params', () => {
    //     const setSorting = jest.spyOn(component, 'setSorting');
    //     component.params = { context: { parentChildInstance: { updateRowDataOnSort: jest.fn() } } };
    //     component.setSorting('desc', { column: { colId: 'test' } });
    //     expect(setSorting).toBeCalledWith('desc', { column: { colId: 'test' } });
    // });


});