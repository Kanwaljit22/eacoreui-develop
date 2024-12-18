
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GridOptions } from 'ag-grid-community';
import { TcoConfigurationService } from '@app/proposal/edit-proposal/tco-configuration/tco-configuration.service';
import { MessageService } from '../../../../shared/services/message.service';

@Component({
  selector: 'app-yearly-cost',
  templateUrl: './yearly-cost.component.html',
  styleUrls: ['./yearly-cost.component.scss']
})
export class YearlyCostComponent implements OnInit {

  lineData: any;
  public gridOptions: GridOptions;
  private gridApi;
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
    // this.getLineData();
    // this.tableData();
    this.getYearlyChartData();
    this.tcoConfigurationService.regenerateGraphEmitter.subscribe(
      (graphType: string) => {
        if (graphType === 'showLine') {
          this.getYearlyChartData();
        }
      });
  }

  getLineData() {
    this.http.get('assets/data/tco-configuration/cisco-one/lineChart.json').subscribe((res) => {
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
  getYearlyChartData() {
    this.rowData = new Array<any>();
    this.tcoConfigurationService.getYearlyChartData().subscribe((res: any) => {
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

  // Total row on top
  onGridReady(params) {
    this.gridApi = params.api;
    this.setTopPinedData();
  }

  setTopPinedData() {
    const result = {
      days: 'Grand Total',
      alc: 0,
      bau: 0,
      c1: 0,
      ea: 0,
    };
    this.gridApi.forEachNode((node) => {
      const data = node.data;
      if (typeof data.alc === 'number') {
        result.alc += data.alc;
      }
      if (typeof data.bau === 'number') {
        result.bau += data.bau;
      }
      if (typeof data.c1 === 'number') {
        result.c1 += data.c1;
      }
      if (typeof data.ea === 'number') {
        result.ea += data.ea;
      }
    });
    this.gridOptions.api.setPinnedTopRowData([result]);
  }

}
