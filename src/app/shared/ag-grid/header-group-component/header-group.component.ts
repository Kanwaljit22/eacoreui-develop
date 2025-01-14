import { Component, OnDestroy } from '@angular/core';
import { IHeaderGroupParams } from 'ag-grid-community';
import { IHeaderGroupAngularComp } from 'ag-grid-angular/main';

@Component({
    moduleId: module.id,
    templateUrl: 'header-group.component.html',
    styleUrls: ['header-group.component.scss']
})
export class HeaderGroupComponent implements IHeaderGroupAngularComp, OnDestroy {
    public params: IHeaderGroupParams;
    public expanded: boolean;

    agInit(params: IHeaderGroupParams): void {
        this.params = params;
        this.params.columnGroup.getOriginalColumnGroup().addEventListener('expandedChanged', this.onExpandChanged.bind(this));
    }

    ngOnDestroy() {
        console.log(`Destroying HeaderComponent`);
    }


    expandOrCollapse() {
        this.params.setExpanded(!this.expanded);
    }

    onExpandChanged() {
        this.expanded = this.params.columnGroup.getOriginalColumnGroup().isExpanded();
    }
}
