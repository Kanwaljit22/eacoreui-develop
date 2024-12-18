import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GridOptions } from 'ag-grid-community';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ParameterFeatureComponent } from '../../../../modal/parameter-features/parameter-features.component';
import { FeatureGroupComponent } from '@app/proposal/edit-proposal/tco-configuration/paramter-table/group-cell/feature-group.component';
import { TcoConfigurationService } from '../tco-configuration.service';
import { MessageService } from '@app/shared/services/message.service';
import { HwgroupComponent } from './hwgroup/hwgroup.component';
import { UtilitiesService } from '../../../../shared/services/utilities.service';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';

@Component({
    selector: 'app-parameter-table',
    templateUrl: './parameter-table.component.html',
    styleUrls: ['./parameter-table.component.scss']
})

export class ParameterComponent implements OnInit {
    public gridOptions: GridOptions;
    public showGrid: boolean;
    public rowData: any;
    public columnDefs: any;
    domLayout;
    chartData: any;
    stackedData: any;
    stackedDataSh = false;
    active: Array<any> = [];
    columnHeaderList = [];
    getRowId: any;
    ngbModalOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false
    };

    constructor(private http: HttpClient, private modalVar: NgbModal, private tcoConfigurationService: TcoConfigurationService
        , private messageService: MessageService, private utilitiesService: UtilitiesService,
        private blockUiService: BlockUiService, private proposalDataService: ProposalDataService) {
        this.gridOptions = <GridOptions>{};
        this.createColumnDefs();
        this.gridOptions.headerHeight = 42;
        this.domLayout = 'autoHeight';

        this.gridOptions.frameworkComponents = {
            featureGroup: <{ new(): FeatureGroupComponent }>(
                FeatureGroupComponent
            ),
            hwGroup: <{ new(): HwgroupComponent }>(
                HwgroupComponent
            )
        };

        this.gridOptions.context = {
            parentChildIstance: this,
        };
        this.gridOptions.getRowClass = (params) => {
            if (params.node.level === 0) {
                return 'editable-rows';
            }
        };
    }

    ngOnInit() {
        this.rowData = new Array();

        this.gridData();

        this.gridOptions.getRowNodeId = function (data) {
            return data.id;
        };
    }

    private createColumnDefs() {
        const thisInstance = this;
        this.http.get('assets/data/tco-configuration/parameterColumn.json').subscribe((res) => {
            this.columnDefs = res;
            this.columnHeaderList = [];
            for (let i = 0; i < this.columnDefs.length; i++) {
                if (this.columnDefs[i].children) {
                    for (let j = 0; j < this.columnDefs[i].children.length; j++) {
                        this.columnDefs[i].children[j].headerClass = 'child-header';
                        if (this.columnDefs[i].children[j].headerName) {
                            this.columnHeaderList.push(this.columnDefs[i].children[j].headerName);
                        }
                        if (this.columnDefs[i].children[j].cellRenderer === 'iconRenderer') {
                            this.columnDefs[i].children[j].cellRenderer = this.iconRenderer;
                        }
                    }
                } else {
                    if (this.columnDefs[i].headerName) {
                        this.columnHeaderList.push(this.columnDefs[i].headerName);
                    }
                    if (this.columnDefs[i].cellRenderer === 'iconRenderer') {
                        this.columnDefs[i].cellRenderer = this.iconRenderer;
                    }
                    if (this.columnDefs[i].cellClass === 'cellClassValue') {
                        this.columnDefs[i].cellClass = this.cellClassValue;
                    }
                }
            }

        });
    }


    currencyFormat(params, thisInstance) {
        return thisInstance.utilitiesService.formatValue(params.value);
    }

    cellClassValue(params) {
        if (params.value) {
            return 'dollar-align';
        }
    }


    public onModelUpdated() {
        // console.log('onModelUpdated');
        this.calculateRowCount();
    }

    public onReady($event) {
        // console.log('onReady');
        this.calculateRowCount();
    }

    private calculateRowCount() {
        if (this.gridOptions.api && this.rowData) {
            const model = this.gridOptions.api.getModel();
            const totalRows = this.rowData.length;
            const processedRows = model.getRowCount();
            //  this.rowCount = processedRows.toLocaleString() + ' / ' + totalRows.toLocaleString();
        }
    }




    public onCellValueChanged($event) {
        // console.log('onCellValueChanged: ' + $event.oldValue + ' to ' + $event.newValue);
    }

    public onCellDoubleClicked($event) {
        // console.log('onCellDoubleClicked: ' + $event.rowIndex + ' ' + $event.colDef.field);
    }

    public onCellContextMenu($event) {
        // console.log('onCellContextMenu: ' + $event.rowIndex + ' ' + $event.colDef.field);
    }

    public onCellFocused($event) {
        // console.log('onCellFocused: (' + $event.rowIndex + ',' + $event.colIndex + ')');
    }

    public onRowSelected($event) {
        // taking out, as when we 'select all', it prints to much to the console!!
        // console.log('onRowSelected: ' + $event.node.data.name);
    }

    public onSelectionChanged() {
        // console.log('selectionChanged');
    }

    public onBeforeFilterChanged() {
        // console.log('beforeFilterChanged');
    }

    public onAfterFilterChanged() {
        // console.log('afterFilterChanged');
    }

    public onFilterModified() {
        // console.log('onFilterModified');
    }

    public onBeforeSortChanged() {
        //  console.log('onBeforeSortChanged');
    }

    public onAfterSortChanged() {
        // console.log('onAfterSortChanged');
    }

    public onVirtualRowRemoved($event) {
        // because this event gets fired LOTS of times, we don't print it to the
        // console. if you want to see it, just uncomment out this line
        // console.log('onVirtualRowRemoved: ' + $event.rowIndex);
    }

    public onRowClicked($event) {
        //  console.log('onRowClicked: ' + $event.node.data.name);
    }

    public onQuickFilterChanged($event) {
        this.gridOptions.api.setQuickFilter($event.target.value);
    }

    // here we use one generic event to handle all the column type events.
    // the method just prints the event name
    public onColumnEvent($event) {
        // console.log('onColumnEvent: ' + $event);
    }
    gridData() {
        if (!this.tcoConfigurationService.growthParameterLoaded) {
            this.blockUiService.spinnerConfig.startChain();
        }
        this.tcoConfigurationService.getGrowthParameter().subscribe((res: any) => {
            if (res && !res.error) {
                try {
                    this.fillTableGrid(res);
                } catch (error) {
                    this.messageService.displayUiTechnicalError(error);
                }
            } else {
                this.messageService.displayMessagesFromResponse(res);
            }
        });
    }

    fillTableGrid(res) {
        this.tcoConfigurationService.regenerateGraphEmitter.emit('totalPriceDataCalculation');
        this.rowData = this.prepareGrowthParameterData(res.data);
        for (let i = 0; i < this.rowData.length; i++) {
            this.rowData[i]['id'] = i.toString();
            if (this.rowData[i]['children']) {
                for (let j = 0; j < this.rowData[i]['children'].length; j++) {
                    this.rowData[i]['children'][j].id = i.toString() + '.' + j.toString();
                }
            }
        }
        this.tcoConfigurationService.growthParameterLoaded = false;
        if (this.gridOptions.api) {
            this.gridOptions.api.setRowData(this.rowData);
            this.gridOptions.api.sizeColumnsToFit();
        }
    }


    getNodeChildDetails(rowItem) {
        if (rowItem.children) {
            return {
                group: true,
                children: rowItem.children,
                key: rowItem.group
            };
        } else {
            return null;
        }
    }

    updateRow(val, i) {
        const x = this.gridOptions.api.getRowNode(i);
        x.setDataValue('features', val);
    }

    iconRenderer(params) {
        let flag: string;
        if (params && params.data && params.data.subscriptionSuiteFlag) {
            flag = `<span class="disabledLink">Feature(s) not Applicable</span>`;
        } else {
            flag = `<a href="javascript:void(0);" class="features">Select Feature(s)</span>`;
        }
        return flag;
    }

    onCellClicked($event) {
        this.getRowId = $event.data.id;
        if ($event.colDef.field === 'parameterIcon' && $event.data.featuresForModel) {
            const classValue = $event.event.target.classList.value;
            const isIconClick = classValue.search('features');
            if (isIconClick > -1) {
                const ngbModalOptionsLocal = this.ngbModalOptions;
                ngbModalOptionsLocal.windowClass = '';
                //  console.log($event.data);
                // tslint:disable-next-line:max-line-length
                const modalRef = this.modalVar.open(ParameterFeatureComponent, { windowClass: 'add-specialist' });
                modalRef.result.then((result) => {
                    result = result.locateData;
                    if (result) {
                        this.fillTableGrid(result);
                    }
                });

                modalRef.componentInstance.listOfFeatures = $event.data.featuresForModel;
                modalRef.componentInstance.suiteName = $event.data.suite_Name;
                modalRef.componentInstance.suiteId = $event.data.suiteId;
                modalRef.componentInstance.hardwareDiscount = $event.data.hwDiscount;
                modalRef.componentInstance.hardwareServiceDiscount = $event.data.hwServiceDiscount;
                modalRef.componentInstance.yearlyGrowthRate = $event.data.tcoGrowthRate;
                if ($event.data.suiteItem) {
                    modalRef.componentInstance.suiteItem = true;
                } else {
                    modalRef.componentInstance.suiteItem = false;
                }

                if (modalRef.componentInstance.out) {
                    modalRef.componentInstance.out.subscribe(($e) => {
                        this.updated(this.getRowId, $e);
                    });
                }
            }
        }
    }


    updated(index, excludedFeaturesArray) {

        // console.log("here");
        const x = this.gridOptions.api.getRowNode(index);
        const featuresForModal = x.data.featuresForModel;
        const size = excludedFeaturesArray.length;
        const updatedFeatureArray = new Array<string>();
        for (const key in featuresForModal) {
            featuresForModal[key] = true;
            updatedFeatureArray.push(key);
            if (index.length !== 1 && x.data.features) {
                if (x.data.features.indexOf(key) === -1) {
                    x.data.features.push(key);
                }
            }
        }
        if (index.length === 1) {

            for (let i = 0; i < size; i++) {
                const featureItem = excludedFeaturesArray[i];
                featuresForModal[featureItem] = false;
            }
        } else {
            const featuresArray = x.data.features;
            for (let i = 0; i < size; i++) {
                const featureItem = excludedFeaturesArray[i];
                featuresForModal[featureItem] = false;
                const j = updatedFeatureArray.indexOf(featureItem);
                updatedFeatureArray.splice(j, 1);
            }
            x.setDataValue('features', updatedFeatureArray);
        }
        console.log(excludedFeaturesArray);
    }



    /*
    * This method will prepare the growth parameter data from service API to 
    *  display on UI.
    */

    prepareGrowthParameterData(growthDataArray: any) {
        const growthDataJsonArray = new Array<any>();
        if (growthDataArray) {
            const size = growthDataArray.length;
            for (let i = 0; i < size; i++) {
                const growthData = growthDataArray[i];
                const growthDataJson = this.prepareGrowthDataRow(growthData);
                growthDataJsonArray.push(growthDataJson);
                if (growthData.lineItems) {
                    const lineItems = growthData.lineItems;
                    const lineItemsSize = lineItems.length;
                    const lineItemJsonArray = new Array<any>();
                    for (let j = 0; j < lineItemsSize; j++) {
                        const lineItemJson = this.prepareLineItemJson(lineItems[j], growthData.hardwareDiscount,
                            growthData.hardwareServiceDiscount, growthData.yearlyGrowthRate, growthData.suiteId);
                        lineItemJson['subscriptionSuiteFlag'] = growthDataJson.subscriptionSuiteFlag;
                        lineItemJsonArray.push(lineItemJson);
                    }
                    growthDataJson['children'] = lineItemJsonArray;
                }
            }

        }
        return growthDataJsonArray;
    }


    prepareGrowthDataRow(growthRow: any) {
        let featuresArray = null;
        if (growthRow.features) {
            const features = growthRow.features;
            featuresArray = new Array();
            for (let key in features) {
                if (key) { // this condition is for checking the value of feature if it is true then need to add.
                    featuresArray.push(key);
                }

            }
        }
        const growthRowJson = {
            'suite_Name': growthRow.suiteName,
            'hwDiscount': growthRow.hardwareDiscount,
            'hwServiceDiscount': growthRow.hardwareServiceDiscount,
            'tcoGrowthRate': growthRow.yearlyGrowthRate,
            // 'features': featuresArray,
            'featuresForModel': growthRow.features,
            'suiteId': growthRow.suiteId,
            'suiteItem': true,
            'subscriptionSuiteFlag': growthRow.subscriptionSuiteFlag
        }
        return growthRowJson;
    }


    prepareLineItemJson(lineItem: any, hardwareDiscount, hardwareServiceDiscount, yearlyGrowthRate, suiteId) {
        let featuresArray = null;
        if (lineItem.features) {
            const features = lineItem.features;
            featuresArray = new Array();
            for (let key in features) {
                if (features[key]) { // this condition is for checking the value of feature if it is true then need to add.
                    featuresArray.push(key);
                }

            }
        }
        const lineItemJson = {
            'suite_Name': lineItem.lineItemId,
            'hwDiscount': hardwareDiscount,
            'hwServiceDiscount': hardwareServiceDiscount,
            'tcoGrowthRate': yearlyGrowthRate,
            'features': featuresArray,
            'featuresForModel': lineItem.features,
            'suiteId': suiteId
        }
        return lineItemJson;
    }


    updatehw(index, value, field, intialValue, suiteId) {

        let apiRequired = false;
        value = this.utilitiesService.getFloatValue(value);
        const x = this.gridOptions.api.getRowNode(index);
        const dataObject = {
            'suiteId': x.data.suiteId,
        };

        if (index.length === 1) {
            if (field === 'hwServiceDiscount') {
                if (value !== intialValue) {
                    dataObject['hardwareDiscount'] = x.data.hwDiscount;
                    dataObject['hardwareServiceDiscount'] = value;
                    dataObject['yearlyGrowthRate'] = x.data.tcoGrowthRate;
                    apiRequired = true;
                }
            } else if (field === 'hwDiscount') {
                if (value !== intialValue) {
                    dataObject['hardwareDiscount'] = value;
                    dataObject['hardwareServiceDiscount'] = x.data.hwServiceDiscount;;
                    dataObject['yearlyGrowthRate'] = x.data.tcoGrowthRate;
                    apiRequired = true;
                }
            } else if (field === 'tcoGrowthRate') {
                if (value !== intialValue) {
                    dataObject['hardwareDiscount'] = x.data.hwDiscount;;
                    dataObject['hardwareServiceDiscount'] = x.data.hwServiceDiscount;;
                    dataObject['yearlyGrowthRate'] = value;
                    apiRequired = true;
                }
            }

            if (apiRequired) {
                this.tcoConfigurationService.growthParameterSave(dataObject, true).subscribe((res: any) => {
                    if (res && !res.error) {
                        try {
                            for (let i = 0; i < x.childrenAfterGroup.length; i++) {
                                const dummyIndex = index + '.' + i.toString();
                                const y = this.gridOptions.api.getRowNode(dummyIndex);
                                x.setDataValue(field, value);
                                y.setDataValue(field, value);
                                this.tcoConfigurationService.enableRegenerateGraph = true;
                            }
                        } catch (error) {
                            this.messageService.displayUiTechnicalError(error);
                        }
                    } else {
                        this.messageService.displayMessagesFromResponse(res);
                    }
                });
            }

        }
    }

}
