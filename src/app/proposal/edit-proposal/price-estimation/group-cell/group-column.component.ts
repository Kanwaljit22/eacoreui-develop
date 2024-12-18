import { ConstantsService } from './../../../../shared/services/constants.service';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { DiscountsModalComponent } from '../../../../../app/modal/discounts/discounts.component';
import { PricingParameterComponent } from '../../../../../app/modal/pricing-parameter/pricing-parameter.component';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { RequestAdjustmentComponent } from '@app/modal/request-adjustment/request-adjustment.component';
import { AppDataService } from '@app/shared/services/app.data.service';
import { ChangeServiceLevelComponent } from '@app/modal/change-service-level/change-service-level.component';
import { QualificationsService } from '@app/qualifications/qualifications.service';

@Component({
    selector: 'app-group-cell',
    templateUrl: './group-column.component.html'
})
export class GroupColumnComponent implements ICellRendererAngularComp {
    @ViewChild('suiteName', { static: false }) public valueContainer: ElementRef;
    public params: any;
    public style: string;
    public type: string;
    column: string;
    showDropdown = false;
    is2tPartner = false;
    ngbModalOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false

    };

    types: any = {
        GROUP: 'group',
        PINNED: 'pinned',
        DEFAULT: 'default'
    };

    tierOptions = [{ 'value': 'Essentials', 'description': 'Cisco EA 2.0 Choice - Security Suites - AMP for Endpoints Essentials' },
    { 'value': 'Advantage', 'description': 'Cisco EA 2.0 Choice - Security Suites - AMP for Endpoints Advantage' }];
    selectedTierValue = 'Select';

    constructor( public qualService: QualificationsService,public appDataService: AppDataService, public constantsService: ConstantsService, public el: ElementRef) { }

    agInit(params: any): void {
        this.params = params;
        if (params.node.rowPinned) {
            this.type = this.types.PINNED;
        } else if (params.node.group) {
            this.type = this.types.GROUP;
        } else {
            this.type = this.types.DEFAULT;
        }
        this.style = this.params.style;
        this.column = params.colDef.field;

        this.is2tPartner = this.appDataService.isTwoTierUser(this.qualService.buyMethodDisti);
    }



    refresh(): boolean {
        return false;
    }

    openModal() {
        if (this.params.node.data.subscriptionFlag || this.appDataService.archName === this.constantsService.SECURITY) {
            // let suiteId = this.params.node.data.suiteId;
            const initialState = {
                suiteId: this.params.node.data.suiteId,
                suiteData: this.params.data
            };
            this.params.bsModalRef = this.params.modalService.show(DiscountsModalComponent, { initialState, ignoreBackdropClick: true });
            this.params.context.parentChildIstance.mouseleave(event);
        } else {
            let suiteId = this.params.node.data.suiteId;
            const initialState = {
                suiteId: this.params.node.data.suiteId,
                suiteData: this.params.data
            };
            // this.params.bsModalRef = this.params.modalService.show(PricingParameterComponent, Object.assign({initalState: this.params}, { class: 'modal-sm' }));
            this.params.bsModalRef = this.params.modalService.show(PricingParameterComponent, { initialState });
        }
        this.params.bsModalRef.content.closeBtnName = 'Close';
    }
    openRequest() {
        const initialState = {
            suiteId: this.params.node.data.suiteId
        };
        this.params.bsModalRef = this.params.modalService.show(RequestAdjustmentComponent, { initialState, class: 'req-adjustment' });
    }

    openService() {
        const initialState = {
            selectedServiceLevel: this.params.data.serviceLevel,
            serviceLevels: this.params.data.serviceLevels,
            suiteData: this.params.data
        };
        this.params.bsModalRef = this.params.modalService.show(ChangeServiceLevelComponent, { initialState, class: 'change-service' });
    }

    selectTier(val) {
        this.selectedTierValue = val.value;
        this.showDropdown = false;
    }

    tierOutside(event) {
        this.showDropdown = false;
    }

    displaySuiteInf(params) {
        this.params.context.parentChildIstance.displaySuiteInfo(params.data.suite);
    }

    showTooltip(tooltip, params) {
        if (params.node.level > 0) {
            const e = this.valueContainer.nativeElement;
            const element = this.el.nativeElement.closest('.ag-group-value');
            if (e.offsetWidth < e.scrollWidth) {
                tooltip.open();
            }
        }
    }
    redirect(val){
        window.open(val);
    }
}
