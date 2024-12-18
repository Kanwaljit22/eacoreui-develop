
import { AppDataService } from '@app/shared/services/app.data.service';
import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ManageSuitesService } from '../manage-suites.service';
import { PermissionService } from '@app/permission.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
@Component({
    selector: 'app-manage-group-cell',
    templateUrl: 'group-cell.component.html',
    styleUrls: ['./group-cell.component.scss']
})
export class ManageSuitesGroupCell implements ICellRendererAngularComp {
    public params: any;
    public style: string;
    public type: string;
    tierOptions = [];
    selectedTierValue = 'Select Tier';
    column: string;
    showDropdown = false;

    types: any = {
        GROUP: 'group',
        PINNED: 'pinned',
        DEFAULT: 'default'
    };

    isChecked = false;
    disableCheckBox = false;
    data: any; // to set entered value
    edited = false; // to make field editable/non-editable
    readOnlyMode = false; // to set readonly mode
    oldValue: any; // to set old value

    constructor(public manageSuitesService: ManageSuitesService, public permissionService: PermissionService,
        public appDataService: AppDataService, private utilitiesService: UtilitiesService, public proposalDataService: ProposalDataService) { }
    agInit(params: any): void {
        // console.log(params);
        this.params = params;
        if (params.node.rowPinned) {
            this.type = this.types.PINNED;
        } else if (params.node.group) {
            this.type = this.types.GROUP;
        } else {
            this.type = this.types.DEFAULT;
        }
        if (params.data.atos) {
            this.tierOptions = params.data.atos;
            for (let i = 0; i < this.tierOptions.length; i++) {
                if (this.tierOptions[i].selected) {
                    this.selectedTierValue = this.tierOptions[i].displayName;
                    this.params.data['selectedAto'] = this.tierOptions[i];
                }
            }
        }
        this.style = this.params.style;
        // to makle readonly mode(disable editing and styling) if proposal is completed or RO Super and not their proposal
        if ((this.appDataService.userInfo.roSuperUser && !this.appDataService.isReadWriteAccess) || this.appDataService.roadMapPath) {
            this.readOnlyMode = true;
        } else {
            this.readOnlyMode = false;
        }
    }

    refresh(): boolean {
        return false;
    }

    openModal() {
        const ngbModalOptionsLocal = this.params.ngbModalOptions;
        const modalRef = this.params.modalVar.open(this.params.modalComponent, { windowClass: 'discounts' });
        modalRef.result.then((result) => {
            console.log(result);
        }, (err) => {
            console.log(err);
        });
    }

    redirect(val){
        window.open(val);
    }


    selectTier(val) {
        this.selectedTierValue = val.displayName;
        this.params.data['selectedAto'] = val;
        for (let i = 0; i < this.params.data.atos.length; i++) {
            if (this.params.data.atos[i].atoProductName === val.atoProductName) {
                this.params.data.atos[i].selected = true;
            } else {
                this.params.data.atos[i].selected = false;
            }
        }
        this.params.node.setSelected(true);
        this.showDropdown = false;
        this.manageSuitesService.selectedAtoEmitter.emit();
    }

    tierOutside(event) {
        this.showDropdown = false;
    }

    selectCxsuite(params) {
        if (this.params.context) {
            this.params.context.parentChildIstance.selectCxSuite(params);
        } else {
            this.manageSuitesService.cxSuiteSelectionEmitter.emit({"selection": true});// emit to call selectCxSuite method
        }
    }

    // method to set the value in old and new attributes and enable editing when clicked on cell
    onClick(params) {
        this.oldValue = params;
        this.data = this.oldValue;
        if (!this.readOnlyMode) {
            this.edited = true;
        } else {
            this.edited = false;
        }
    }

    // method to set the value and trigger to check total cx rate 
    onClickedOutside(e, val, value) {
        if (this.edited) {
            if (!val) {
                val = 0;
            }
            this.edited = false;
            let val1 = this.data
            if (this.oldValue !== val1) {
                if (val1 > 100 || val1 <= 0) {
                    // console.log('error');
                } else {
                    // console.log(this.oldValue, +val1);
                }
            }
            val1 = (val1 === 0) ? 0.00 : +(this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(val1)))
            value = (val1);
            this.params.data.cxSuites[0].attachRate = value;
            // console.log(this.params.data)
            if (this.params.context) {
                this.params.context.parentChildIstance.checkCxAttachRateForSuites();
            } else {
                this.manageSuitesService.cxSuiteSelectionEmitter.emit({"selection": false}); // emit to check cxRate
            }
        }
    }


    // method to check key event and set cx rate
    keyUp(event, value) {
        if (!this.utilitiesService.isNumberKey(event)) {
            event.target.value = '';
        }
        if (event.target.value) {
            if (event.target.value > 100) {
                event.target.value = 100.00;
                this.data = value = 100.00;
            } else if (event.target.value < 0) {
                event.target.value = 0.00;
                this.data = value = 0.00;
            } else {
                this.data = value = +(this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(event.target.value)));
            }
        }
    }

    isEOSSuite(){
        let suiteIsEOS=false;
        let eoExDate;
        if(this.params.data.nonOrderableMessages && this.params.data.nonOrderableMessages.eoExtDate){
            eoExDate = new Date(this.params.data.nonOrderableMessages.eoExtDate);
        } else if(this.params.data.selectedAto && this.params.data.selectedAto.nonOrderableMessages && this.params.data.selectedAto.nonOrderableMessages[0].eoExtDate ){
            eoExDate = new Date(this.params.data.selectedAto.nonOrderableMessages[0].eoExtDate);
        }

         if(eoExDate && this.proposalDataService.currentDateFromServer) 
         {                         
                let currentDate = new Date(this.proposalDataService.currentDateFromServer);
                if(currentDate > eoExDate){
                    suiteIsEOS = true;
                }             
         }         
         return suiteIsEOS;
    }
}
