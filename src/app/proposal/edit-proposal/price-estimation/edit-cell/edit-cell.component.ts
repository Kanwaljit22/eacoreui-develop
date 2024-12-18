import { ConstantsService } from '@app/shared/services/constants.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { PriceEstimationService } from '@app/proposal/edit-proposal/price-estimation/price-estimation.service';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-cell',
  templateUrl: './edit-cell.component.html'
})
export class EditCellComponent implements OnInit {
  params: any;
  data: any;
  edited = false;
  isAdvancedChanged = false;
  suiteId;
  lineItemId;
  oldValue: any;
  foundationEaQtyEdited = false;
  isAdvancedManuallyUpdated = false;
  focusedField = false;
  options = ['0', '1'];
  showDrop = false;
  showDropOptions = false;
  onlyBooleanAllowed = false;
  readOnlyMode = false;

  constructor(public appDataService: AppDataService, public constantsService: ConstantsService,
    private priceEstimationService: PriceEstimationService) { }

  agInit(params) {
    this.params = params;
    let value = params.value;
    this.suiteId = params.node.data.suiteId;
    this.lineItemId = params.node.data.lineItemId;
    // getting the flag and set to local
    if (params.node.data.onlyBooleanAllowed) {
      this.onlyBooleanAllowed = params.node.data.onlyBooleanAllowed;
    } else {
      this.onlyBooleanAllowed = false;
    }

    if (value) {
      value = (value + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,'); // Add commas to values
    }
    this.data = value;
    let fieldName = params.colDef.field;
    fieldName = fieldName + 'Editable';
    // show dropdown only if not readonlymode and  we have onlyBooleanAllowed = true in line level of every suite
    if (params.data[fieldName] && !this.readOnlyMode && this.onlyBooleanAllowed) {
      this.showDrop = true;
    } else {
      this.showDrop = false;
    }

  }

  ngOnInit() {
    // to makle readonly mode(disable editing and styling) if proposal is completed or RO Super and not their proposal
    if ((this.appDataService.userInfo.roSuperUser && !this.appDataService.isReadWriteAccess) || this.appDataService.roadMapPath) {
      this.readOnlyMode = true;
    } else {
      this.readOnlyMode = false;
    }
  }

  openDrop() {
    if (!this.readOnlyMode) {
      this.showDropOptions = !this.showDropOptions;
    }
  }

  onClick(e, params) {
    let fieldName = params.colDef.field;
    fieldName = fieldName + 'Editable';
    if (params.data[fieldName] && !this.readOnlyMode) {
      this.edited = true;
      this.focusedField = true;
      this.oldValue = params.value;
    }
    if (params.colDef.field === 'advancedEaQty') {
      // let x = params.colDef.field + 'ManuallyUpdated';
      params.data['advancedEaQtyManuallyUpdated'] = -1;
    }

    if (params.colDef.field === 'foundationEaQty' && params.data.advancedEaQtyManuallyUpdated > 0) {
      this.foundationEaQtyEdited = true;
    }
  }

  keyUpa(event, a) {
    const key = window.event ? event.keyCode : event.which;
    if (
      event.keyCode === 8 ||
      event.keyCode === 46 ||
      event.keyCode === 37 ||
      event.keyCode === 39 || (key < 48 && key > 57) || (key >= 96 && key <= 105)
    ) {
      return true;
    } else if (key < 48 || key > 57) {
      return false;
    }
  }

  onClickedOutside(e, val, suiteId, lineItemId) {
    if (this.edited) {
      if (!val) {
        val = 0;
      }
      this.data = (val + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,');
      this.edited = false;
      const val1 = this.data.replace(/,/g, '');
      // this.params.context.parentChildIstance.updateEQtyList(this.params);
      // this.isAdvancedChanged
      if (this.oldValue !== +val1) {
        this.params.context.parentChildIstance.updatehw(
          this.params.node.id,
          val1,
          this.params.colDef.field,
          this.params,
          this.isAdvancedChanged,
          suiteId,
          lineItemId
        );
      }
    }
    if (this.foundationEaQtyEdited) {
      this.params.context.parentChildIstance.updateAdvanced(
        this.params.data.suiteId,
        this.params.data.advancedEaQtyManuallyUpdated
      );
    }

    if (this.showDropOptions) {
      this.showDropOptions = false;
    }
  }

  onRowSelected() { }

  refresh(): boolean {
    return false;
  }

  expandAll(val) {
    if (val.node.level === 0) {
      if (val.node.expanded) {
        val.node.setExpanded(false);
        const grpnames = ['ADVANTAGE', 'Premier'];
        if (val.colDef.groupId === 'ADVANTAGE' || val.colDef.groupId === 'Premier') {
          grpnames.forEach(function (groupId) {
            val.columnApi.setColumnGroupOpened(groupId, false);
          });
        }
      } else {
        val.node.setExpanded(true);
      }
    }
  }

  changeSecurityExpantion(lineItemId, productTypeId, groupName, suiteId) {
    if (!this.readOnlyMode) {
      this.params.context.parentChildIstance.updateExpansionQty(lineItemId,
        productTypeId, groupName, suiteId, 0, false
      );
    }
  }


  checkAndUpdateMultipleSelections(lineItemId, productTypeId, groupName, suiteId) {
    const key = groupName + '-' + productTypeId + '-' + suiteId;
    if (this.priceEstimationService.selectedSuiteGroupLineItemMap.get(key)) {
      const selectedValues = this.priceEstimationService.selectedSuiteGroupLineItemMap.get(key);
      if (selectedValues > 1) {
        this.params.context.parentChildIstance.updateExpansionQty(lineItemId,
          productTypeId, groupName, suiteId, selectedValues, true
        );
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  checkForMultipleSelection(productTypeId, groupName, suiteId) {
    const key = groupName + '-' + productTypeId + '-' + suiteId;
    if (this.priceEstimationService.selectedSuiteGroupLineItemMap.get(key)) {
      const selectedValues = this.priceEstimationService.selectedSuiteGroupLineItemMap.get(key);
      if (selectedValues > 1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }

  }



  selectValue(val) {
    this.data = val;
  }
}
