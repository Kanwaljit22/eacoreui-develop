import { Component, ViewChild, ElementRef } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { LocaleService } from '@app/shared/services/locale.service';

@Component({
    selector: 'app-deal-cell',
    templateUrl: './deal-cell.component.html'
})
export class DealCellComponent implements ICellRendererAngularComp {
    public params: any;
    @ViewChild('downloadZipLink', { static: false }) public downloadZipLink: ElementRef;

    constructor(public localeService : LocaleService ) { }

    agInit(params) {
        this.params = params;
    }

    refresh(): boolean {
        return false;
    }

    download(data) {
        this.params.context.parentChildIstance.downloadLoccDoc(data, this.downloadZipLink, 'grid');
    }

    goToEaQual(data) {
        // console.log(data)
        this.params.context.parentChildIstance.getQualListForDeal(data);
    }
}
