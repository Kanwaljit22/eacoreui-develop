
import { Injectable } from '@angular/core';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextResolversModule } from 'vnext/vnext-resolvers.module';
import { ISuiteAndLineInfoForGrid } from '../price-estimate-store.service';
import { EaService } from 'ea/ea.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';

@Injectable({
  providedIn: VnextResolversModule
})
export class AdjustDesiredQtyService {
  ADVANTAGE = 0
  PREMIER = 0
  ADD_ON = 0
  D2OPS = 0;
  PREMIUM = 0;
  ENTERPRISE = 0;
  GENERAL = 0;
  PRO = 0;
  ADVANCED = 0;
  PEAK = 0;
  ESSENTIAL = 0;
  CONTROLLER = 0;
  ROUTING_HYBRID_WORKER = 0;
  display_ADVANTAGE = false;
  display_PREMIER = false;
  display_ADD_ON = false;
  display_D2OPS = false;
  display_PREMIUM = false;
  display_ENTERPRISE = false;
  display_GENERAL = false;
  display_PRO = false;
  display_ADVANCED = false;
  display_PEAK = false;
  display_ESSENTIAL = false;
  display_CONTROLLER = false;
  display_ROUTING_HYBRID_WORKER = false;
  qtyCount = 0;
  selectedSupportPid: ISuiteAndLineInfoForGrid = {};
  totalIbQty = 0;
  totalQty = 0;
  totalConsumedQtyForSuite = 0; // set totalConsumedQty of suite
  displayMsgForAdjDesiredQty = false; // set if any error present in adjdesiresQty
  totalLowerTierPidQty = 0;
  desiredQtyColumnsData: any = []; // to set columns type and name other than general and basic support

  constructor(private utilitiesService: UtilitiesService, private eaService: EaService, private constantsService: ConstantsService) { } 
  mapValuesForLine(pids, selectedSuite) {
    this.qtyCount = 0;
    this.totalConsumedQtyForSuite = 0;
    pids.forEach(pid => {
      if (pid.dtls) {
        pid.dtls.forEach(element => {
          const line = selectedSuite.childs?.find(line => line.id === element.mappedLineId);
          if (line) {
            line['pidName' + pid.type] = pid.name;
            if(!this['display_' + pid.type] && this['display_' + pid.type] !== undefined){
              this['display_' + pid.type] = true;
              this.qtyCount++;
            }
            if(element.qty){
              this[pid.type] = this[pid.type] + element.qty
              line[pid.type] = element.qty
            } else {
              line[pid.type] = '0';
            }
            if(!line['ibQty']){
              line['ibQty'] = 0;
            }

            if(element.ibQty){
              line['ibQty'] = line['ibQty'] + element.ibQty;
              this.totalIbQty =  this.totalIbQty + element.ibQty
            }
            
            if(element.totalConsumedQty){
              line['totalConsumedQty'] = line['totalConsumedQty'] + element.totalConsumedQty;
              this.totalConsumedQtyForSuite =  this.totalConsumedQtyForSuite + element.totalConsumedQty;
            }
           
          }
          if(element.maxQty) {
            line['maxQty'] = element.maxQty
          }
        });
      }
    });
    if(this.qtyCount === 1 && this.display_GENERAL){
      this.qtyCount = 0
    }
  }

  // to map values for lines for validation UI
  mapValuesForLineForValidationUI(pids, selectedSuite) {
    this.qtyCount = 0;
    this.totalConsumedQtyForSuite = 0;
    this.setPidColumnData(pids);
    this.qtyCount = this.desiredQtyColumnsData.length;
    pids.forEach(pid => {
      if (pid.dtls) {
        pid.dtls.forEach(element => {
          const line = selectedSuite.childs?.find(line => line.id === element.mappedLineId);
          let pidTypeColumn = this.desiredQtyColumnsData.find(columnData => columnData.type === pid.type);
          if (this.eaService.features.FIRESTORM_REL && ((!this.eaService.features?.SPA_PID_TYPE && pid.type === 'CX_HW_SUPPORT') || (this.eaService.features?.SPA_PID_TYPE && pid?.type === this.utilitiesService.replaceSpacesWithUnderscores(this.constantsService.HW_PRODUCTS)))) {
            line['singleColumn'] = true;
            line['hwSupportQty'] = (pid?.cxIbQty?.total) ? pid.cxIbQty.total : 0;
          }
          if(pidTypeColumn && line){
            line['pidName' + pid.type] = pid.name;
            if(element.qty){
              pidTypeColumn.displayValue = pidTypeColumn.displayValue + element.qty;
              line[pid.type] = element.qty;
            } else {
              line[pid.type] = '0';
            }

            if(!line['ibQty']){
              line['ibQty'] = 0;
            }

            if(element.ibQty){
              line['ibQty'] = line['ibQty'] + element.ibQty;
              this.totalIbQty =  this.totalIbQty + element.ibQty
            }
            
            if(element.totalConsumedQty){
              line['totalConsumedQty'] = line['totalConsumedQty'] + element.totalConsumedQty;
              this.totalConsumedQtyForSuite =  this.totalConsumedQtyForSuite + element.totalConsumedQty;
            }
            // if(pid.commitInfo?.ibQtyThreshold){
            //   line['commitInfo'] = pid.commitInfo;
            // }
          }
          if (line && !pidTypeColumn) {
            line['pidName' + pid.type] = pid.name;
            if(!this['display_' + pid.type] && this['display_' + pid.type] !== undefined){
              this['display_' + pid.type] = true;
              this.qtyCount++;
            }
            if(element.qty){
              this[pid.type] = this[pid.type] + element.qty
              line[pid.type] = element.qty
            } else {
              line[pid.type] = '0';
            }
            if(!line['ibQty']){
              line['ibQty'] = 0;
            }

            if(element.ibQty){
              line['ibQty'] = line['ibQty'] + element.ibQty;
              this.totalIbQty =  this.totalIbQty + element.ibQty
            }
            
            if(element.totalConsumedQty){
              line['totalConsumedQty'] = line['totalConsumedQty'] + element.totalConsumedQty;
              this.totalConsumedQtyForSuite =  this.totalConsumedQtyForSuite + element.totalConsumedQty;
            }
          }
          // if(element.maxQty) {
          //   line['maxQty'] = element.maxQty
          // }
          if(element.maxQty || element.maxQty === 0) {
            line[pid.type + '_maxQty'] = element.maxQty
          }
        });
      }
    });
    if(this.qtyCount === 1 && this.display_GENERAL){
      this.qtyCount = 0
    }
  }

  // check and set column names and value for pids
  setPidColumnData(pids){
    this.desiredQtyColumnsData = [];
    let pidColumnDataMap = new Map<string, IPidsColumnsObj>();
    pids.forEach(pid => {
      if(pid.dtls){
        if(this.eaService.features?.SPA_PID_TYPE){
          pid.type = this.utilitiesService.replaceSpacesWithUnderscores(pid.type);
          // replacing BASIC_SUPPORT with SW PRODUCTS, CX_HW_SUPPORT with HW PRODUCTS, added new tyoe ALL PRODUCTS
          if(!pidColumnDataMap.has(pid.type) && pid.type !== 'GENERAL' && pid.type !== this.utilitiesService.replaceSpacesWithUnderscores(this.constantsService.SW_PRODUCTS) && pid.type !== this.utilitiesService.replaceSpacesWithUnderscores(this.constantsService.HW_PRODUCTS) && pid.type !== this.utilitiesService.replaceSpacesWithUnderscores(this.constantsService.ALL_PRODUCTS)){
            pidColumnDataMap.set(pid.type, {type: pid.type, displayName: pid?.typeDesc ? pid.typeDesc : '', displaySeq : (pid?.typeDisplaySeq) ? pid.typeDisplaySeq : -1  , displayValue: 0, displayVisible: true, displayId: pid?.typeDesc ? pid.typeDesc.toLowerCase() : ''});
          }
        } else {
          if(!pidColumnDataMap.has(pid.type) && pid.type !== 'BASIC_SUPPORT' && pid.type !== 'GENERAL' && pid.type !== 'CX_HW_SUPPORT' && pid.type !== this.utilitiesService.replaceSpacesWithUnderscores(this.constantsService.ALL_PRODUCTS)){
            pidColumnDataMap.set(pid.type, {type: pid.type, displayName: pid?.typeDesc ? pid.typeDesc : '', displaySeq : (pid?.typeDisplaySeq) ? pid.typeDisplaySeq : -1  , displayValue: 0, displayVisible: true, displayId: pid?.typeDesc ? pid.typeDesc.toLowerCase() : ''});
          }
        }
      }
    });
    this.desiredQtyColumnsData = Array.from(pidColumnDataMap.values());
    this.utilitiesService.sortArrayByDisplaySeq(this.desiredQtyColumnsData);  
  }

  updateQty(lineItem, type, updatedPidsArray, updatedQty) {
    const pid = updatedPidsArray.find(pid => pid.name === lineItem['pidName' + type]);
    if (pid) {
      const mappedLineIdToUpdate = pid.dtls.find(dtl => dtl.mappedLineId === lineItem.id);
      if (mappedLineIdToUpdate) {
        mappedLineIdToUpdate.qty = updatedQty
      } else {
        pid.dtls.push({
          "mappedLineId": lineItem.id,
          "qty": updatedQty ? updatedQty : '0'
        })
      }
    } else {
      const pidObj = {
        type: this.utilitiesService.replaceUnderscoresWithSpaces(type),
        name: lineItem['pidName' + type],
        dtls: [{
          "mappedLineId": lineItem.id,
          "qty": updatedQty ? updatedQty : '0'
        }]
      }
      updatedPidsArray.push(pidObj)
    }
  }

  updateQtyForPid(pidItem,type, updatedPidsArray, updatedPidValue){
    const pid = updatedPidsArray.find(pid => pid.name === pidItem.pidName);
    if (pid) {
      pid.dtls[0].qty= updatedPidValue ? updatedPidValue : '0'
    } else {
      const pidObj = {
        type: this.utilitiesService.replaceUnderscoresWithSpaces(type),
        name: pidItem.pidName,
        dtls: [{
          "qty": updatedPidValue ? updatedPidValue : '0'
        }]
      }
      updatedPidsArray.push(pidObj)
    }
  } 
 
  getSelectedSupportPid(pids){
    this.selectedSupportPid = {};
    this.totalIbQty = 0;
    this.totalQty = 0;
    this.totalConsumedQtyForSuite = 0;
    this.totalLowerTierPidQty = 0;
    pids.forEach(pid => {
      if(pid.supportPid && pid.desiredQty === 1){
        this.selectedSupportPid = pid;
      }
      if(pid.ibQty){
        this.totalIbQty = this.totalIbQty + pid.ibQty;
      }
      if(pid.lowerTierPidTotalQty){
        this.totalLowerTierPidQty = this.totalLowerTierPidQty + pid.lowerTierPidTotalQty;
      }

      if(!pid.supportPid && pid.desiredQty){
        this.totalQty = this.totalQty + pid.desiredQty;
      }
      
      if(pid.totalConsumedQty){
        this.totalConsumedQtyForSuite = this.totalConsumedQtyForSuite + pid.totalConsumedQty;
      }
    });
  }

  selectSupport(pidItem,updatedPidsArray){
    const pid = updatedPidsArray.find(pid => pid.name === this.selectedSupportPid.pidName);
    const pidObj = {
      type: pidItem.pidType,
      name: pidItem.pidName,
      dtls: [{
        "qty": 1
      }]
    }
    if (pid) {
      pid.dtls[0].qty = 0;
    } 
    updatedPidsArray.push(pidObj)
    
   this.selectedSupportPid =  pidItem;
  }
}

export interface IPids {
  dtls :IDtls[],
  type?: string;
  name?: string;
}

export interface IDtls {
  mappedLineId?: number;
  qty?: number;
  ibQty?: number;
}

export interface IPidsColumnsObj {
  type?: string;
  displayName?: string;
  displayValue?: number;
  displayVisible?: boolean
  displaySeq?:number;
  displayId?: string;
}
