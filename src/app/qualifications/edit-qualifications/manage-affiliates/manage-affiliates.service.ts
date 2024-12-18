import { BlockUiService } from './../../../shared/services/block.ui.service';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MessageService } from '@app/shared/services/message.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { map } from 'rxjs/operators'



@Injectable()
export class ManageAffiliatesService {
  subsidiaryData: Array<any>;
  subsidiaryDataMap = new Map<String, any>();
  subsidiaryDataEmitter = new EventEmitter<Array<any>>();
  subsidiarySummaryDataEmitter = new EventEmitter<Array<any>>();
  architectureName: string;
  customerName: string;
  loadSubsidiaryRequest;
  excludedAffiliatesSet: any = new Set();
  excludedAffiliatesSetHQ: any = new Set();
  exclusions: any = new Map<any, Set<any>>();
  excludedGUs: any = [];
  excludedHQs: any = [];
  excludedPartys: any = [];
  affiliatesSaved = new EventEmitter<any>();
  getSubsdiary = false;
  showFlyoutView = false;
  selectedRow : any = {};
  selectedGu : any = {};
  smartViewClearSearchEmitter = new EventEmitter<Array<any>>();
  readOnlyMode = false;
  searchlabel = '';
  
  smartViewSearchString = '';
  clickedSubsidiaryObj:any;
  isAdvanceSearchApplied = false;

  constructor(private http: HttpClient, private appDataService: AppDataService, private qualService: QualificationsService
    , private messageService: MessageService, public blockUiService: BlockUiService) { }


  getSubsidiaryDataList(loadSubsidiaryDataJSON) {
    return this.http.post(this.appDataService.getAppDomain + 'api/qualification/listSubsidiaries', loadSubsidiaryDataJSON)
      .pipe(map(res => res));
  }

  saveAffilates(reqObject) {
    return this.http.put(this.appDataService.getAppDomain + 'api/qualification/subsidarySelection', reqObject)
      .pipe(map(res => res));
  }

  loadSubsidiaryData1(guId: string) {
    this.blockUiService.spinnerConfig.stopChainAfterThisCall();
    return this.http.get('/assets/data/subsidiaries/flat-view.json');
    /*.subscribe((res:any )=>{
      this.messageService.displayMessagesFromResponse(res);
      this.subsidiaryDataEmitter.emit(res);
    });
    */
  }

  loadSubsidiaryData(guId: string) {
    // this.blockUI = true;
    if (sessionStorage.getItem(AppDataService.USERINFO_SESSION_STORAGE)) {
      const userInfoJson = JSON.parse(sessionStorage.getItem(AppDataService.USERINFO_SESSION_STORAGE));
      this.appDataService.userInfo.userId = userInfoJson.userId;
    }
    this.subsidiaryData = new Array<any>();
    const loadSubsidiaryJson = {
      // 'userId': this.appDataService.userInfo.userId,
      'guId': guId,
      'hqId': null,
      'qualId': this.qualService.qualification.qualID
    };
    this.loadSubsidiaryRequest = loadSubsidiaryJson;

    this.getSubsidiaryDataList(loadSubsidiaryJson).subscribe((response: any) => {

      if (response) {
        if (response.messages && response.messages.length > 0) {
          this.messageService.displayMessagesFromResponse(response);
        }

        if (!response.error && response.data) {
          try {

            this.exclusions.clear();
            const subsidiaryData = response.data;
            for (let i = 0; i < subsidiaryData.length; i++) {
              const subsidiaryRow = subsidiaryData[i];
              const record = subsidiaryRow;
              // const record = { 'CUSTOMER_GU_NAME': subsidiaryRow.name,
              // 'children': [] };
              record['customerGuName'] = subsidiaryRow.name;
              record['selected'] = subsidiaryRow.exclusion;
              record['END_CUSTOMER_ID'] = subsidiaryRow.id;
              record['address'] = subsidiaryRow.address1;
              record['children'] = [];
              record['size'] = 0;
              record['zip'] = subsidiaryRow.postalCode;
              record['theater'] = subsidiaryRow.theaterName;

              // const colData = subsidiaryRow.column;
              // for (let j = 0; j < colData.length; j++) {
              //   const subsidiaryColData = colData[j];
              //   record[subsidiaryColData.name] = subsidiaryColData.value;
              // }

              const hqExcluded = new Set();

              this.subsidiaryData.push(record);
              loadSubsidiaryJson.guId = record['END_CUSTOMER_ID'];
              this.subsidiaryDataMap.set(record['END_CUSTOMER_ID'], record);
              if (subsidiaryRow.subsidaries) {
                const subsidiaryChildData = subsidiaryRow.subsidaries;
                if (subsidiaryChildData) {
                  record.children = new Array<any>();
                }
                for (let i = 0; i < subsidiaryChildData.length; i++) {
                  const subsidiarychildRow = subsidiaryChildData[i];
                  const childRecord = subsidiarychildRow;
                  childRecord['customerGuName'] = subsidiarychildRow.name;
                  childRecord['address'] = subsidiarychildRow.address1;
                  childRecord['selected'] = subsidiarychildRow.exclusion;
                  childRecord['children'] = [];
                  childRecord['END_CUSTOMER_ID'] = subsidiarychildRow.id;
                  childRecord['zip'] = subsidiarychildRow.postalCode;
                  childRecord['theater'] = subsidiarychildRow.theaterName;

                  if (subsidiarychildRow.exclusion) {
                    hqExcluded.add(subsidiarychildRow.id);
                  }

                  // const childRecord = { 'CUSTOMER_GU_NAME': subsidiarychildRow.name, 'children': [] };
                  // const childColData = subsidiarychildRow;
                  // for (let j = 0; j < childColData.length; j++) {
                  //   const subsidiaryChildColData = childColData[j];
                  //   childRecord[subsidiaryChildColData.name] = subsidiaryChildColData.value;
                  // }

                  if (!childRecord.children.length) {
                    childRecord.children.push({});
                  }
                  this.subsidiaryDataMap.set(childRecord['END_CUSTOMER_ID'], childRecord);
                  record.children.push(childRecord);
                  record.size = record.children.length;
                  // console.log(record);
                }
                delete this.subsidiaryData[0].subsidaries;
                this.exclusions.set(subsidiaryRow.id, hqExcluded);
              } else if (subsidiaryRow.exclusion) { // if standalon GU and excluded push it to exclusions
                this.exclusions.set(subsidiaryRow.id, new Set());
              }
            }
            this.subsidiaryDataEmitter.emit(this.subsidiaryData);

          } catch (error) {
            console.error(error.ERROR_MESSAGE);
            this.messageService.displayUiTechnicalError(error);
          }
        } else {
          this.messageService.displayMessagesFromResponse(response);
        }
        this.blockUiService.spinnerConfig.unBlockUI();
        this.blockUiService.spinnerConfig.stopChainAfterThisCall();
      } else {
        this.blockUiService.spinnerConfig.unBlockUI();
        this.blockUiService.spinnerConfig.stopChainAfterThisCall();
      }
    });
  }

  getSubsidiarySummaryData(paginationObject, selectedpartySearch, selectedGuObj, searchText, isSerachscenario,subsidiaryViewType) {
    this.blockUiService.spinnerConfig.stopChainAfterThisCall();
    let withinMyGU = 'Y';
    if(selectedpartySearch !== 'Within My GU'){
      withinMyGU = 'N';
    }
    const reqObj = {
      'withinGU':withinMyGU
    };
    let uri = 'api/qualification/subsidiaries/summary-view/' + this.qualService.qualification.qualID;
    if(selectedGuObj.guId) {
      uri = uri + '/' + selectedGuObj.guId;
     // reqObj['partyName'] = selectedGuObj.guName;
    }
    if(isSerachscenario){
      reqObj['partyName'] = searchText;
    }
    if(!this.smartViewSearchString){
       reqObj['page'] = {
        'pageSize':paginationObject.pageSize,
        'currentPage':paginationObject.page
      }
    }
    this.getSelectedSubsidairyTypeinReqObj(subsidiaryViewType,reqObj);
    return this.http.post(this.appDataService.getAppDomain + uri, reqObj)
    .pipe(map(res => res));
  }


  getSelectedSubsidairyTypeinReqObj(subsidiaryViewType,reqObj){
    if(subsidiaryViewType !== 'All Subsidiary'){
      if(subsidiaryViewType === 'Selected Subsidiary'){
        reqObj['selectedYorN'] = 'Y';
      } else {
        reqObj['selectedYorN'] = 'N';
      }
    }
  }

  getCountryListForSelectedRow(selectedpartySearch,guId,subsidiaryName) {
    this.blockUiService.spinnerConfig.stopChainAfterThisCall();
    let withinMyGU = 'Y';
    if(selectedpartySearch !== 'Within My GU'){
      withinMyGU = 'N';
    }
    const reqObj = {
      'withinGU':withinMyGU,
      'partyName':subsidiaryName
    };    
    let uri = 'api/qualification/subsidiaries/countryData/' + this.qualService.qualification.qualID;
    if(guId){
      uri = uri + '/' + guId;
    }
    return this.http.post(this.appDataService.getAppDomain + uri, reqObj)
    .pipe(map(res => res));
  }

  getSubsidiaryDataForFlatView(paginationObject,selectedGu,selectedpartySearch,searchText,isSerachscenario,subsidiaryViewType, advanceSearchPayload) {
    let withinMyGU = 'Y';
    if(selectedpartySearch !== 'Within My GU'){
      withinMyGU = 'N';
    }
    const reqObj = {
      'withinGU':withinMyGU
    };
    if(isSerachscenario){
      reqObj['partyName'] = searchText;
    }
    if(!this.smartViewSearchString && !this.isAdvanceSearchApplied){
      reqObj['page'] ={
        'pageSize':paginationObject.pageSize,
        'currentPage':paginationObject.page
      }
    }
  reqObj['advanceSearchPayload'] = advanceSearchPayload;
  this.getSelectedSubsidairyTypeinReqObj(subsidiaryViewType,reqObj);
    const qualId = this.qualService.qualification.qualID;
    const url = this.appDataService.getAppDomain + 'api/qualification/subsidiaries/customer-hierarchy/' + qualId + '/' + selectedGu.guId;
    //  let url = this.appDataService.getAppDomain + 'api/qualification/subsidiaries/affililates-details/4490/4460740';
    this.blockUiService.spinnerConfig.stopChainAfterThisCall();
    return this.http.post(url, reqObj)
      .pipe(map(res => res));
  }




  saveSmartSubsidaries(saveSubObj:SaveSmartSubsidiaryObj) {
    let withinMyGU = 'Y';
    if(saveSubObj.selectedpartySearchLabel !== 'Within My GU'){
      withinMyGU = 'N';
    }
    const reqObj = {};
    if(saveSubObj.isImplicitSave){ // This code is for implicit save and save button clicked
       this.prepareImplicitSaveRequest(reqObj,saveSubObj.rowData,saveSubObj.includedItemMap,saveSubObj.viewContextForSaveCall);
    } else if(saveSubObj.selectionType === 'whole Customer Hierarchy'){
        const guIds = new Array();
        saveSubObj.associatedGUObj.forEach(element => {
          guIds.push(element.guId);
      });
      if(saveSubObj.isSelected){
          reqObj['includedGUs'] = guIds;
      }else{
        reqObj['excludedGUs'] = guIds;
      }
    } else {
      if(saveSubObj.searchString || this.isAdvanceSearchApplied || saveSubObj.viewContextForSaveCall === 'NAMED_HIERARCHY_VIEW'){ //This if condition is for clicked on selected all check box in case of search senario.
            this.prepareReqForHeaderBoxClicked(reqObj,saveSubObj.rowData,saveSubObj.isSelected,saveSubObj.viewContextForSaveCall);
        } else {
          const guIds = [saveSubObj.guId];
          if(saveSubObj.isSelected){
              reqObj['includedGUs'] = guIds;
          } else {
              reqObj['excludedGUs'] = guIds;
          }
        }
    }
    reqObj['withinGU']  = withinMyGU;
    reqObj['viewContext']  = saveSubObj.viewContextForSaveCall;
    let uri = 'api/qualification/subsidiaries/saveDefineSubsidaries/' + this.qualService.qualification.qualID;
    if(saveSubObj.rowData && saveSubObj.rowData.guId){
     uri = uri + '/' + saveSubObj.rowData.guId;
    }else{
      uri = uri + '/' + saveSubObj.guId;
    }
    return this.http.put(this.appDataService.getAppDomain + uri, reqObj)
    .pipe(map(res => res));
  }

  prepareImplicitSaveRequest(reqObj,excludedPartiesMap,includedItemMap,viewContextForSaveCall){
    let allHqIds:Array<any>; 
    let allBranchesId:Array<any>; 
    let allGuId:Array<any>; 
     if(excludedPartiesMap.size > 0 ){
      allHqIds = new Array();
      allBranchesId = new Array();
      allGuId = new Array();
      this.prepareListItemsForRequest(excludedPartiesMap,allGuId,allHqIds,allBranchesId,viewContextForSaveCall);
      if(allGuId.length > 0){
        reqObj['excludedGUs'] = allGuId;
      }
      if(allHqIds.length > 0){
        reqObj['excludedHQs'] = allHqIds;   
      }
      if(allBranchesId.length > 0){
        reqObj['excludedPartys'] = allBranchesId;
      }
    }
    if(includedItemMap.size>0){
      allHqIds = new Array();
      allBranchesId = new Array();
      allGuId = new Array();
      this.prepareListItemsForRequest(includedItemMap,allGuId,allHqIds,allBranchesId,viewContextForSaveCall);
      if(allGuId.length > 0){
        reqObj['includedGUs'] = allGuId;
      }
      if(allHqIds.length > 0){
        reqObj['includedHQs'] = allHqIds;
      }
      if(allBranchesId.length > 0){
        reqObj['includedPartys'] = allBranchesId;
      }
    } 
  }

  prepareListItemsForRequest(partiesMap,guIdList:Array<any>,hqIdList:Array<any>,brIdList:Array<any>,viewContextForSaveCall){    
    if(viewContextForSaveCall === 'FLAT_VIEW' || viewContextForSaveCall === 'NAMED_HIERARCHY_VIEW'){
    partiesMap.forEach((obj: any, key: string) => {
      if(obj.nodeType === 'BR'){
        brIdList.push(obj.partyId);
      }else if(obj.nodeType === 'HQ'){
        hqIdList.push(obj.partyId);
      } else{
        guIdList.push(obj.partyId);
      }
   });
  }else{
    let hqIdArray = new Array();
    let brIdArray = new Array();
    partiesMap.forEach((obj: any, key: string) => {
      if(obj.availableCrHqCount > 0){
        hqIdArray = obj.availableCrHQIds.split(',');
        hqIdArray.forEach(hqId => {
          hqIdList.push(parseInt(hqId));
        });
      }
      if(obj.availableCrBranchesCount > 0){
          brIdArray = obj.availableCrBranchIds.split(',');
          brIdArray.forEach(brId => {
            brIdList.push(parseInt(brId));
          });
      }
    });
  }
  }


  prepareReqForHeaderBoxClicked(reqObj,rowListObj,isSelected,viewContextForSaveCall){

    const allHqIds = new Array();
    const allBranchesId = new Array();
    if(viewContextForSaveCall === 'FLAT_VIEW' || viewContextForSaveCall === 'NAMED_HIERARCHY_VIEW'){
      const allGuId = new Array();
      rowListObj.forEach(element => {
         if(element.nodeType === 'BR'){
          allBranchesId.push(element.partyId);
         }else if(element.nodeType === 'HQ'){
          allHqIds.push(element.partyId);
         } else{
          allGuId.push(element.partyId);
         }
      });
      if(!isSelected){ 
        if(allGuId.length > 0){
          reqObj['excludedGUs'] = allGuId;
        }
        if(allHqIds.length > 0){
          reqObj['excludedHQs'] = allHqIds;   
        }
        if(allBranchesId.length > 0){
          reqObj['excludedPartys'] = allBranchesId;
        }
      } else {
        if(allGuId.length > 0){
          reqObj['includedGUs'] = allGuId;
        }
        if(allHqIds.length > 0){
          reqObj['includedHQs'] = allHqIds;
        }
        if(allBranchesId.length > 0){
          reqObj['includedPartys'] = allBranchesId;
        }
      }
    }else {
    
    let hqIdArray = new Array();
    let brIdArray = new Array();
    rowListObj.forEach(element => {
      if(element.availableCrHqCount > 0){
        hqIdArray = element.availableCrHQIds.split(',');
        hqIdArray.forEach(hqId => {
          allHqIds.push(parseInt(hqId));
        });
      }
      if(element.availableCrBranchesCount > 0){
          brIdArray = element.availableCrBranchIds.split(',');
          brIdArray.forEach(brId => {
            allBranchesId.push(parseInt(brId));
          });
      }
    });
    if(isSelected){
        if(allHqIds.length > 0){
          reqObj['includedHQs'] =  allHqIds;
        }
        if(allBranchesId.length > 0 ){
          reqObj['includedPartys'] = allBranchesId;
        }
    } else {
        if(allHqIds.length > 0){
            reqObj['excludedHQs'] =  allHqIds;
        }
        if(allBranchesId.length > 0 ){
          reqObj['excludedPartys'] = allBranchesId;
        }
    }
  }
  }

  saveRequestForSummaryView(reqObj,rowData,isSelected){
    if(!isSelected){     
      if(rowData.availableCrHqCount > 0){
        reqObj['excludedHQs'] = rowData.availableCrHQIds.split(',');
        reqObj['excludedHQs'] =  reqObj['excludedHQs'].map(el=>parseInt(el))
      }
      if(rowData.availableCrBranchesCount > 0){
        reqObj['excludedPartys'] = rowData.availableCrBranchIds.split(',');
        reqObj['excludedPartys'] =  reqObj['excludedPartys'].map(el=>parseInt(el))
      }
    } else {
      if(rowData.availableCrHqCount > 0){
        reqObj['includedHQs'] = rowData.availableCrHQIds.split(',');
        reqObj['includedHQs'] =  reqObj['includedHQs'].map(el=>parseInt(el))
      }
      if(rowData.availableCrBranchesCount > 0){
        reqObj['includedPartys'] = rowData.availableCrBranchIds.split(',');
        reqObj['includedPartys'] =  reqObj['includedPartys'].map(el=>parseInt(el))
      }
    }
  }

  saveRequestForFlatAndFlyoutView(reqObj,rowData,isSelected){
   
    if(!isSelected){ 
      if(rowData.guId && rowData.nodeType === 'GU'){
        reqObj['excludedGUs'] = [rowData.guId];
      }
      if(rowData.partyId && rowData.nodeType === 'HQ'){
        reqObj['excludedHQs'] = [rowData.partyId];       
      }
      if(rowData.partyId && rowData.nodeType === 'BR'){
        reqObj['excludedPartys'] = [rowData.partyId]; 
      }
    } else {
      if(rowData.guId && rowData.nodeType === 'GU'){
        reqObj['includedGUs'] = [rowData.guId];
      }
      if(rowData.partyId && rowData.nodeType === 'HQ'){
        reqObj['includedHQs'] = [rowData.partyId];
      }
      if(rowData.partyId && rowData.nodeType === 'BR'){
        reqObj['includedPartys'] = [rowData.partyId];
      }
    }
  }

  
  getFlatViewData(requestPayload) {
    // return this.http.get('/assets/data/subsidiaries/getAffiliateDetailsAndSearch.json');
    const guId = this.selectedRow.guId;
    const qualId = this.qualService.qualification.qualID;
    if(this.showFlyoutView) {
      const url = this.appDataService.getAppDomain + 'api/qualification/subsidiaries/affililates-details/' + qualId + '/' + guId;
      this.blockUiService.spinnerConfig.stopChainAfterThisCall();
      return this.http.post(url, requestPayload)
        .pipe(map(res => res));
    } else {
      const url = this.appDataService.getAppDomain + 'api/qualification/subsidiaries/customer-hierarchy/' + qualId + '/' + this.selectedGu.guId;
    //  let url = this.appDataService.getAppDomain + 'api/qualification/subsidiaries/affililates-details/4490/4460740';
    this.blockUiService.spinnerConfig.stopChainAfterThisCall();
    return this.http.post(url, requestPayload)
      .pipe(map(res => res));

    }


  }

  getFlatViewCountries(countryReqPayload) {
    const guId = this.selectedRow.guId;
    countryReqPayload.partyName = this.selectedRow.subsidiaryName;
    const qualId = this.qualService.qualification.qualID;           
    const url = this.appDataService.getAppDomain + 'api/qualification/subsidiaries/country/'+qualId+'/'+guId;
    if(!this.showFlyoutView){
    this.blockUiService.spinnerConfig.stopChainAfterThisCall();
    } else {
      this.blockUiService.spinnerConfig.startChain();
      this.blockUiService.spinnerConfig.pageContainGrid();
    }
    return this.http.post(url, countryReqPayload)
    .pipe(map(res => res));


  }
  
  getAffiliateDetailList(flyoutSelectedRowData){
    let reqPayload: any = {};
    reqPayload ={};
    const guId = flyoutSelectedRowData.guId;
    const qualId = this.qualService.qualification.qualID;
    const hqId = flyoutSelectedRowData.partyId;
    const url = this.appDataService.getAppDomain + 'api/qualification/subsidiaries/affililates-under-hq/'+qualId+'/'+guId+'/'+hqId;
    this.blockUiService.spinnerConfig.stopChainAfterThisCall();
    return this.http.post(url, reqPayload)
    .pipe(map(res => res));
  }


  // api to export affiliates for smart/flat view 
  exportAffiliates(selectedView, reqObj, paginationObject, selectedpartySearch, selectedGuObj, searchText, isSerachscenario,advancedSearch){
    let withinMyGU = 'Y';
    if(selectedpartySearch !== 'Within My GU'){
      withinMyGU = 'N';
    }

    if(!advancedSearch){
      reqObj = {
        // 'page':{
        //   'pageSize':paginationObject.pageSize,
        //   'currentPage':paginationObject.page
        // },
        'withinGU':withinMyGU
      };
    } else {
     reqObj['withinGU'] = withinMyGU
    }

    if(isSerachscenario){
      reqObj['partyName'] = searchText;
    } else {
      reqObj['partyName'] = "";
    }

    //if(selectedView === 'flat'){
      let url = this.appDataService.getAppDomain +  'api/qualification/subsidiaries/customer-hierarchy-download/' + this.qualService.qualification.qualID;
      if(selectedGuObj.guId) {
        url = url + '/' + selectedGuObj.guId;
      }
      return this.http.post(url, reqObj, { observe: 'response', responseType: 'blob' as 'json' });
    //} else {
    //  const url = this.appDataService.getAppDomain +  'api/qualification/subsidiaries/summary-view/' + this.qualService.qualification.qualID;
    //  return this.http.post(url, reqObj, { observe: 'response', responseType: 'blob' as 'json' });
    //}
  }
}


export interface SaveSmartSubsidiaryObj{
  rowData?:any;
  isSelected:boolean;
  selectedpartySearchLabel?:string;
  viewContextForSaveCall?:string;
  selectionType?:string;
  associatedGUObj:any;
  guId:number;  
  searchString?:string;
  isImplicitSave?:boolean;
  includedItemMap?: any;
}
