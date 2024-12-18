import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FiltersActionsComponent } from "./filters-actions.component";
import { LocaleService } from "@app/shared/services/locale.service";
import { FiltersService } from "../filters.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ProductSummaryService } from "@app/dashboard/product-summary/product-summary.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ViewAppliedFiltersComponent } from "@app/modal/view-applied-filters/view-applied-filters.component";

describe('FiltersActionsComponent', () => {
    let component: FiltersActionsComponent;
    let fixture: ComponentFixture<FiltersActionsComponent>;


    class MockProductSummaryService {
        sortColumnname = "test";
        sortOrder = "dummy";
    }
    
    const mockFiltersService = {
        getFiltersState:jest.fn()
    }

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [FiltersActionsComponent,ViewAppliedFiltersComponent],
            providers: [LocaleService,
                {provide:FiltersService, useValue:mockFiltersService},NgbModal,
                {provide:ProductSummaryService, useClass:MockProductSummaryService}],
            imports:[HttpClientTestingModule],
            schemas:[NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));


    beforeEach(() => {
        fixture = TestBed.createComponent(FiltersActionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy()
    })

    it('should call ngOnInit', () => {
        component.ngOnInit();
    })

    it('should call openViewAppliedFiltersModal', () => {
        const modal  = fixture.debugElement.injector.get(NgbModal)
        const mck = jest.spyOn(modal,'open')
        component.openViewAppliedFiltersModal();
        expect(mck).toHaveBeenCalledWith(ViewAppliedFiltersComponent, { windowClass: 'applied-filters-modal' });
    });
    
});