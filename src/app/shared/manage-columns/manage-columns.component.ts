import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { AppDataService } from '../services/app.data.service';
import { CreditOverviewService } from '../credits-overview/credit-overview.service';
import { BlockUiService } from '../services/block.ui.service';
// import { ExceptionApprovalService } from '@app/support/admin/exception-approval/exception-approval.service';
// import { ManageComplianceHoldService } from '@app/support/admin/manage-compliance-hold/manage-compliance-hold.service';

@Component({
  selector: 'app-manage-columns',
  templateUrl: './manage-columns.component.html',
  styleUrls: ['./manage-columns.component.scss']
})
export class ManageColumnsComponent implements OnInit {

  @Input() public columnDefs: any;
  columnList = new Array<ManageColumnInterface>();

  displayManageColumns = false;
  selectAllColumns = true;
  selectedColumnCount = 0;

  constructor(public appDataService: AppDataService, private creditOverviewService: CreditOverviewService, private blockUiService: BlockUiService) { }

  ngOnInit() {
    this.blockUiService.spinnerConfig.customBlocker = false;
  }

  ngOnChanges(changes:SimpleChanges){
    if(changes['columnDefs']){
    if( !changes['columnDefs'].isFirstChange() ){
    this.prepareManageColumnData();
    }
    }
    
    
    }
  showHideManagerColumns() {
    this.displayManageColumns = !this.displayManageColumns;
    if (this.displayManageColumns) {
      //this.prepareManageColumnData();
    }
  }

  prepareManageColumnData() {
    this.columnList = new Array<ManageColumnInterface>();
    this.selectedColumnCount = 0;
    for (let i = 0; i < this.columnDefs.length; i++) {
      const columnDef = this.columnDefs[i];
      if (columnDef.children) {
        for (let j = 0; j < columnDef.children.length; j++) {
          this.selectedColumnCount++;
          const childCol = columnDef.children[j];
          const manageColObj: ManageColumnInterface = {
            'field': childCol.field,
            'colName': childCol.headerName,
            'checked': true
          };
          this.columnList.push(manageColObj);
        }
      } else {
        const manageColObj: ManageColumnInterface = {
          'field': columnDef.field,
          'colName': columnDef.headerName,
          'checked': true
        };
        this.selectedColumnCount++;
        this.columnList.push(manageColObj);
      }
    }
    if(this.columnList.length === this.selectedColumnCount){
      this.selectAllColumns = true;
    } else {
      this.selectAllColumns = false;
    }
  }

  public changeColumnStatus(col: ManageColumnInterface) {
    col.checked = !col.checked;
    if(col.checked){
      this.selectedColumnCount++;
    } else {
      this.selectedColumnCount--;
    }
    if(this.columnList.length === this.selectedColumnCount){
      this.selectAllColumns = true;
    } else {
      this.selectAllColumns = false;
    }
  }

  public changeSelectionOfAllColumns() {
    this.selectAllColumns = !this.selectAllColumns;
    if(this.selectAllColumns){
      this.selectedColumnCount = this.columnList.length;
    } else {
      this.selectedColumnCount = 0;
    }
    for (let j = 0; j < this.columnList.length; j++) {
      const col = this.columnList[j];
      col.checked = this.selectAllColumns;
    }

  }

  changeGridView() {
    this.displayManageColumns = false;
    this.creditOverviewService.manageColumnEmitter.emit(this.columnList);
  }

}

interface ManageColumnInterface {
  field: string;
  colName: string;
  checked: boolean;
}
