
import { Component, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GridOptions } from 'ag-grid-community';
import { TcoConfigurationService } from '../tco-configuration.service';
import { MessageService } from '../../../../shared/services/message.service';

@Component({
  selector: 'app-cumulative-cost',
  templateUrl: './cumulative-cost.component.html',
  styleUrls: ['./cumulative-cost.component.scss']
})
export class CumulativeCostComponent implements OnInit, OnChanges {

  lineData: any;
  public gridOptions: GridOptions;
  public showGrid: boolean;
  public rowData: any;
  public columnDefs: any;
  columnHeaderList = [];
  active = false;
  constructor(private http: HttpClient, private tcoConfigurationService: TcoConfigurationService, private messageService: MessageService) {
    this.gridOptions = <GridOptions>{};
    this.createColumnDefs();
    this.gridOptions.headerHeight = 21;
  }

  ngOnInit() {
    //  this.getLineData();
    // this.tableData();
    this.getCumulativeCostComparisonData();
    this.tcoConfigurationService.regenerateGraphEmitter.subscribe(
      (graphType: string) => {
        if (graphType === 'showLineCumulative') {
          this.getCumulativeCostComparisonData();
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    // Add '${implements OnChanges}' to the class.

  }

  getLineData() {
    this.http.get('assets/data/tco-configuration/cisco-one/lineChartCumulative.json').subscribe((res) => {
      this.lineData = res;
    });
  }

  private createColumnDefs() {
    const thisInstance = this;
    this.http.get('assets/data/tco-configuration/cisco-one/yctable.json').subscribe((res) => {
      this.columnDefs = res;
      this.columnHeaderList = [];
      for (let i = 0; i < this.columnDefs.length; i++) {
        if (this.columnDefs[i].children) {
          for (let j = 0; j < this.columnDefs[i].children.length; j++) {
            this.columnDefs[i].children[j].headerClass = 'child-header';
            if (this.columnDefs[i].children[j].headerName) {
              this.columnHeaderList.push(this.columnDefs[i].children[j].headerName);
            }
            if (this.columnDefs[i].children[j].valueGetter === 'totalValue') {
              this.columnDefs[i].children[j].valueGetter = function aPlusBValueGetter(params) {
                const val = params.data.alc + params.data.bau + params.data.c1 + params.data.ea;
                return val;
              };
            }
          }
        } else {
          if (this.columnDefs[i].headerName) {
            this.columnHeaderList.push(this.columnDefs[i].headerName);
          }
        }
      }

    });
  }

  tableData() {
    this.http.get('assets/data/tco-configuration/cisco-one/yctableData.json').subscribe((res) => {
      this.rowData = res;
      if (this.gridOptions.api) {
        this.gridOptions.api.setRowData(this.rowData);
        this.gridOptions.api.sizeColumnsToFit();
      }
    });
  }



  /*
  * Defination need to write.
  */
  updateActive($event) {
  }


  /*
  * This method is use to get Cumulative Cost comparison data and prepare
  * data for graphs.
  */
  getCumulativeCostComparisonData() {
    this.rowData = new Array<any>();
    this.tcoConfigurationService.getCumulativeCostComparisonData().subscribe((res: any) => {
      if (res && !res.error) {
        try {
          const graphObject = this.tcoConfigurationService.prepareGraghAndTableData(res.data);
          if (this.gridOptions.api) {
            this.gridOptions.api.setRowData(graphObject.tableData);
            setTimeout(() => {
              this.gridOptions.api.sizeColumnsToFit();
            }, 200);
          }
          this.lineData = graphObject.graphData;
        } catch (error) {
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }


}
