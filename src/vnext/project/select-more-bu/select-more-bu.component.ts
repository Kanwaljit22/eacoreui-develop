import { ProjectStoreService } from 'vnext/project/project-store.service';
import { Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { PaginationObject, VnextService } from 'vnext/vnext.service';
import { ProjectService } from '../project.service';
import { SubsidiariesStoreService } from '../subsidiaries/subsidiaries.store.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaRestService } from 'ea/ea-rest.service';
import { EaService } from 'ea/ea.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdvancePartySearchComponent } from 'vnext/modals/advance-party-search/advance-party-search.component';
import { MissingIdComponent } from 'vnext/modals/missing-id/missing-id.component';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
@Component({
  selector: 'app-select-more-bu',
  templateUrl: './select-more-bu.component.html',
  styleUrls: ['./select-more-bu.component.scss']
})
export class SelectMoreBuComponent implements OnInit, OnDestroy {
  @ViewChild('downloadZipLink', { static: false }) private downloadZipLink: ElementRef;
  subsidiariesData = [];
  associatedSiteArr = []; // store partiesData from api
  showAssociatedSites = false;
  toggle = true;
  allCustomerCheck = true;
  allSitesCheck = false;
  selectedBu: any = {}; // to set selected Bu
  advanceSearchApplied = false;
  missingPartyIds = []
  totalIdSearched = 0;
  documentId = 0;
  paginationObject: PaginationObject;
  viewSitesRequested = false;
  reqObject = {
    "data": {
      "page": {
        "pageSize": 200,
        "currentPage": 1
      }
    }
  };
  initiallySelectedBuArr = []; // store alreadySelectedBu's from api
  selectedBuMap = new Map<number, boolean>(); // to map bu's and selection
  partiesSelectionMap = new Map<string,boolean>(); //This map is use to store use action on party selections.
  viewSitesForBu: any = {};
  pageChangeRequested = false;
  //isPartialBuPresent = false;
  searchDropdownArray = [
    {
      "id": "partyName",
      "name": "Party Name"
    },
    {
      "id": "partyId",
      "name": "Party ID"
    }
  ];
  searchPlaceHolder = this.localizationService.getLocalizedString('create-project.SEARCH_PARTIES');
  isSearchedApplied = false;
  exactSearch = false;
  exactSearchValue = ''
  searchReqObj =  {
    "data": {
      "searchCriteria" : { 'partyName' : '', 'partyIds' : []}
    }
  };
  isUserClickedSave = false; // set if user clicked on save and continue
  selectEntireBu = false;
  displayMessage = false;
  partyFilter = '';
  advancePartySearchIds = [];
  isSelectOnlyThese = false
  isAnyBuSelected = false; // set if atlease one bu selected
  isPartnerUserLoggedIn = false;
  constructor(public projectService: ProjectService,  private modalVar: NgbModal,private subsidiariesStoreService: SubsidiariesStoreService, public vnextService: VnextService,
    public projectStoreService:ProjectStoreService,private eaRestService: EaRestService,public eaService:EaService,
    public localizationService:LocalizationService,private renderer:Renderer2, private vnextStoreService: VnextStoreService, public dataIdConstantsService: DataIdConstantsService, private utilitiesService: UtilitiesService, public elementIdConstantsService: ElementIdConstantsService
    ) { }

  ngOnInit(): void {
    this.subsidiariesData = this.subsidiariesStoreService.subsidiariesData[0].bus; // store subsidiaries data
    let defaultBU;
    // check and set to show parties for first selected bu on initial load
    if(this.projectService.isNewEaIdCreatedForProject){
      for (let i = 0; i < this.subsidiariesData.length; i++) {
        if (this.subsidiariesData[i]?.selected) {
          defaultBU = this.subsidiariesData[i]
          this.subsidiariesData.splice(i, 1);
          break; 
        }
      }
      // set to show parties for first selected bu on initial load
      if(defaultBU){
        this.subsidiariesData.unshift(defaultBU);
        this.showSites(defaultBU);
      }
    } else {
      for (let i = 0; i < this.subsidiariesData.length; i++) {
        // if(this.subsidiariesData[i].selected === 'P'){
        //   this.isPartialBuPresent = true;
        // }
        if (this.subsidiariesData[i].dealCrPartyBU) {
          defaultBU = this.subsidiariesData[i]
          this.subsidiariesData.splice(i, 1);    
          break; 
        }
  
        // if(defaultBU && this.isPartialBuPresent){
        //   break;
        // }
      }
      this.subsidiariesData.unshift(defaultBU);
      this.showSites(this.subsidiariesData[0]);
    }
    // this.setSelectedBuArr(this.subsidiariesData); // check and set selectedBu's from api into array and map
    if (this.projectService.enableSubsidiariesMeraki === this.localizationService.getLocalizedString('select-more-bu.MERAKI')) {
      this.toggle = false;
    } else {
      this.toggle = true;
    }
    // check and set if atleast one bu selected for a new eaid project
    if(this.projectService.isNewEaIdCreatedForProject){
      this.setIsAnyBuChecked();
    }
    if (this.eaService.isPartnerUserLoggedIn()) {
      this.isPartnerUserLoggedIn = true
    }
  }

  // check and set if atleast one bu selected
  setIsAnyBuChecked(){
    this.isAnyBuSelected = this.subsidiariesData.filter(bu => bu?.checked).length ? true : false;
  }
  showSites(val) {
    this.resetAdvanceSearch()
    this.subsidiariesData.forEach((element) => {
      if (element.showSites && val.buId === element.buId) {
        element.showSites =  true;
      } else {
        element.showSites =  false;
      }
    })
    if(this.selectedBuMap.size){
      if (val.buId !== this.selectedBu.buId) { 
        this.showAssociatedSites = true;
      }
      this.viewSitesRequested = true;
      // val.showSites = true;
      this.selectedBu = val;
      this.saveBuSelection();
    } else {
      if(this.partiesSelectionMap.size){
        this.savePartiesSelections(true)
      }
      if (val.buId !== this.selectedBu.buId) { // check selected Bu
        val.showSites = true;
        this.selectedBu = val;
        
        this.showAssociatedSites = true;
        // call api to load associated Sites data
        this.reqObject.data.page = {
          "pageSize": 200,
          "currentPage": 1
        }
        this.getSitesDetails(val, this.reqObject);
      }
    }
   this.projectService.clearSearchInput.next(true);
  }

  selectAllCustomerBu() {
    this.allCustomerCheck = !this.allCustomerCheck
    // check for new eaid project and allow to check dealcrpartybu as well
    this.subsidiariesData.forEach((row) => {
      if ((!row.dealCrPartyBU || (row.dealCrPartyBU && this.projectService.isNewEaIdCreatedForProject && this.eaService.features.EAID_REL)) && !row.disabled && row.checked !== this.allCustomerCheck){
        row.checked = this.allCustomerCheck ? true : false;
        this.selectedBuMap.set(row.buId, row);
      }
    })
    // check and set if atleast one bu selected
    if(this.projectService.isNewEaIdCreatedForProject){
      this.setIsAnyBuChecked();
    }
  }


  selectAllSites() {
    this.allSitesCheck = !this.allSitesCheck
    this.associatedSiteArr.forEach((row) => {
      
      if (!this.projectService.checkAndSetSelectedCrPartyFromDeal(this.selectedBu, row)){
        this.changePartyStatus(row,this.allSitesCheck)
        row.selected = this.allSitesCheck ? true : false

      }
    });

  }

  // method to check and set parties selected from seletced Bu
  setSiteSelction(subsidiary, sitesArr, sitesData){
    this.selectedBu.showSites = true;
    if (subsidiary.selected === 'F'){ // if full selection, make default selection to all parties
      for (let data of sitesArr){
        data.selected = true;
      }
    } else if (sitesData.selectedParties || this.partiesSelectionMap.size) { // if partial selection, check selectedParties and make selection to parties
      for (let data of sitesArr){
        if (sitesData.selectedParties.includes(data.CR_PARTY_ID) || this.partiesSelectionMap.has(data.CR_PARTY_ID)) {
          data.selected = true;
        }
      }
    }
    this.checkAllSitesSelected(sitesArr);
  }

  // check to set header selection of bu's selected
  checkAllBusSelected(subsidiariesData){
    this.allCustomerCheck = true;
    for (let data of subsidiariesData){
      if (!data.checked){
        this.allSitesCheck = false;
        break;
      }
    }
  }

  // check to set header selection of parties
  checkAllSitesSelected(sitesArr){
    this.allSitesCheck = true;
    for (let data of sitesArr){
      if (!data.selected){
        this.allSitesCheck = false;
        break;
      }
    }
  }

  // call api to get selectedBu's site details
  getSitesDetails(val, request){
    request.data.type = this.partyFilter ? this.partyFilter : undefined;
    if(this.advanceSearchApplied && this.advancePartySearchIds.length){
      request.data.searchCriteria = {partyIds: this.advancePartySearchIds}
    }
    if(this.advanceSearchApplied && this.documentId){
      request.data['documentId'] = this.documentId
    }
    //const url = 'assets/vnext/cav-bu-sites-details.json';
    this.pageChangeRequested = false;
    this.viewSitesRequested = false;
      const url = 'project/'+this.projectStoreService.projectData.objId+'/cav/' + this.subsidiariesStoreService.subsidiariesData[0].cavId + '/bu/' + val.buId+'/parties';
      this.eaRestService.postApiCall(url,request).subscribe((response: any) => {
        if (this.vnextService.isValidResponseWithData(response)) {
          this.associatedSiteArr = response.data.partyDetails;
          this.paginationObject = response.data.page;
          this.viewSitesForBu = val;
          this.setSiteSelction(val, this.associatedSiteArr, response.data)
        }
      });
  } 


  isBuSelected(bu) {
    if (bu.checked) {
      return true;
    } else {
      this.allCustomerCheck = false;
      return false;
    }
  }

  

  changePartyStatus(party, event) {
    if (party.selected !== event || this.isSelectOnlyThese) {
      party.checked = event;
      party.selected = event;
      party.buId = this.selectedBu.buId
      if (this.partiesSelectionMap.has(party.CR_PARTY_ID)) {
        this.partiesSelectionMap.delete(party.CR_PARTY_ID);
      } else {
        this.partiesSelectionMap.set(party.CR_PARTY_ID, party);
      }
    }
  }  
  

  changeBuStatus(bu,event) {
    bu.checked = event.target.checked;
    if(this.selectedBuMap.has(bu.buId)){
        this.selectedBuMap.delete(bu.buId);
    } else{
        this.selectedBuMap.set(bu.buId,bu);
    }  
    
    if(this.selectedBu.buId === bu.buId){
      if(!bu.checked){
        this.showAssociatedSites = false;
      }else {
        this.showAssociatedSites = true;
      }
    }
    // check and set if atleast one bu selected
    if(this.projectService.isNewEaIdCreatedForProject){
      this.setIsAnyBuChecked();
    }
  }  
  // for pagination
  paginationUpdated(event) {
    let reqObj;
    if(this.isSearchedApplied) {
      reqObj = {
        "data": {
          "searchCriteria" : this.searchReqObj.data.searchCriteria,
          "page": {
            "pageSize": event.pageSize,
            "currentPage": event.currentPage
          }
        }
      }
    } else {
      reqObj = {
        "data": {
          "page": {
            "pageSize": event.pageSize,
            "currentPage": event.currentPage
          }
        }
      };
      if(this.documentId){
        reqObj.data['documentId'] = this.documentId
      }
      this.reqObject = reqObj;
    }

    if (this.partiesSelectionMap.size || this.selectedBuMap.size) {
      this.pageChangeRequested = true;
      this.save();
    } else {
      this.getSitesDetails(this.selectedBu, reqObj);
    }
  }

  // method to set already selectedBu to arr and map all the bu's and selection
//  setSelectedBuArr(buDataArr){
//   for (let bu of buDataArr){
//     if (bu.checked){
//       this.initiallySelectedBuArr.push(bu.buId)
//     }
//     this.selectedBuMap.set(bu.buId, bu.checked ? true: false)
//   }
//  }

 // set map for bu's selected/deselected
 checkAndSetCheckedBu(bu){
  this.selectedBuMap.set(bu.buId, bu.checked)
 }

  save(userclick?) {
    if (userclick) { // is user clicks, set it to true
      this.isUserClickedSave = true;
    } else {
      this.isUserClickedSave = false;
    }
   if(this.selectedBuMap.size){
    this.saveBuSelection()
   }
   if(this.partiesSelectionMap.size && this.selectedBuMap.size === 0){
    this.savePartiesSelections()
   }
 }

 //method to save Bu selection/deselection
 saveBuSelection() {
    const includedBu = [];
    const excludedBu = [];    
    this.selectedBuMap.forEach((value: any, key: any) => {
      if (value.checked) {
        includedBu.push(key);       
      } else  {
        excludedBu.push(key);
      }
    });
    const reqObject = {
      "data":{
      "bus": {
        "excluded": excludedBu,
        "included": includedBu
      }
    }
    }
    const url = 'project/' + this.projectStoreService.projectData.objId + '/cav/' + this.subsidiariesStoreService.subsidiariesData[0].cavId;
     this.eaRestService.putApiCall(url, reqObject).subscribe((response: any) => {
       if(this.vnextService.isValidResponseWithoutData(response)){
        this.displayMessage = true;
        if(excludedBu.length){  // to remove/add selected variable to deselected/selected Bu
          this.checkAndChangeBuSelection();
        }
        if(this.viewSitesRequested){
          this.selectedBu.selected = 'F'
        }
        if(includedBu.length > 1){
          includedBu.forEach((bu) => {
            const updatedBu = this.subsidiariesData.find(value => value.buId === bu);
            if(updatedBu){
              updatedBu['selected'] = 'F'
            }
          })
        }
        if(this.partiesSelectionMap.size){
          this.savePartiesSelections()
        } else{
          this.selectedBuMap.clear();
          // if(this.viewSitesRequested){
          //   this.selectedBu.selected = 'F'
          // }
          this.checkForPageUpdate();
        }
       }
     });
  }


  //method to save Bu selection/deselection
 savePartiesSelections(onlySave?) {
  const includedBu = [];
  const excludedBu = [];    
  this.partiesSelectionMap.forEach((value: any, key: any) => {
   if(this.isBuSelectedForParties(value.buId)){
    if (value.checked) {
      includedBu.push(key);       
    } else  {
      excludedBu.push(key);
    }
  }
  });
  const reqObject = {
    "data": {
      "previousFullBUSelected": this.viewSitesForBu.selected === 'F' ? true : false,
      "parties": {
        "excluded": excludedBu,
        "included": includedBu
      }
    }
  }
  if(this.documentId){
    reqObject.data.parties = undefined;
    reqObject.data['documentId'] = this.documentId
    reqObject.data['type'] = this.partyFilter ? this.partyFilter: undefined
  }
  const buIdForUpdatedParties = this.viewSitesForBu.buId
  let url = 'project/' + this.projectStoreService.projectData.objId + '/cav/' + this.subsidiariesStoreService.subsidiariesData[0].cavId + '/bu/'+ this.viewSitesForBu.buId;
  if(this.isSelectOnlyThese){
    url = url + '?a=SELECT-ONLY'
  }
   this.eaRestService.putApiCall(url, reqObject).subscribe((response: any) => {
     if(this.vnextService.isValidResponseWithoutData(response)){
      this.displayMessage = true;
      // this.viewSitesForBu.selected = '';
      if (buIdForUpdatedParties !== this.viewSitesForBu.buId) {
        const updatedBu = this.subsidiariesData.find(value => value.buId === buIdForUpdatedParties);
        // if(updatedBu && updatedBu['selected'] === 'F' && excludedBu.length){
        //   updatedBu['selected'] = 'P'
        // }
        if(response.data?.selected && updatedBu){
          updatedBu['selected'] = response.data.selected;
         }
       } else {
        //  if (this.viewSitesForBu.selected === 'F' && excludedBu.length) {
        //    this.viewSitesForBu.selected = 'P'
        //  }
         if(response.data?.selected){
          this.viewSitesForBu.selected = response.data.selected;
         }
       }
      this.partiesSelectionMap.clear();
      this.selectedBuMap.clear();
      if(!onlySave){
        this.checkForPageUpdate();
      }
     }
   });
}

checkForPageUpdate(){
  if (this.isUserClickedSave){
    this.vnextStoreService.toastMsgObject.isSelectedBuSaved = true;
    this.isUserClickedSave = false;
  setTimeout(() => {
    this.vnextStoreService.cleanToastMsgObject();
  }, 5000);
  }
  if(this.pageChangeRequested || this.viewSitesRequested){
    this.getSitesDetails(this.selectedBu, this.reqObject);
   } else {
    this.backToProject();
   }
}


isBuSelectedForParties(buId){
  if(this.selectedBuMap.has(buId)){
        const bu = this.selectedBuMap.get(buId);
        if(!this.selectedBuMap.get(buId)){
            return false;
        }
  } 
      return true;
}

 // close flyout and clear map
  backToProject(closeWithoutSave?) {
    if((!this.partiesSelectionMap.size && !this.selectedBuMap.size) || closeWithoutSave){
       this.projectService.selectMoreBuId = false;
    }
  }

  // to remove/add selected variable to deselected/selected Bu after api
  checkAndChangeBuSelection(){
    for(let data of this.subsidiariesData){
      if (!data.checked && data.selected){
        data.selected = '';
      }
    }
  }

  // check and select crparty from deal default and disable it
  checkAndSetSelectedCrPartyFromDeal(bu, party){
    if (bu.dealCrPartyBU && this.projectStoreService.projectData.dealInfo.crPartyId && (party.CR_PARTY_ID === this.projectStoreService.projectData.dealInfo.crPartyId)){
      return true;
    }
    return false;
  }

  
  // Redirect to customer service hub
  redirectToCustomerServiceHub() {
    if(!this.projectStoreService.projectEditAccess){
      return;
    }
    const url = 'service-registry/url?track=CSH&service=CUSTOMER_SERVICE';
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) {
        window.open(response.data);
      }
    })
  }

  ngOnDestroy() {
    this.projectService.selectMoreBuId = false; 
    this.isUserClickedSave = false;
    // this.vnextStoreService.cleanToastMsgObject();
    this.projectStoreService.showHideFilterMenu = false;
    this.renderer.removeClass(document.body, 'position-fixed');
  }

  showFilters() {
    this.projectStoreService.showHideFilterMenu = true;
    this.renderer.addClass(document.body, 'position-fixed');
  }

  searchParties(event) {
    let requestObj
    if (!event) {
      this.isSearchedApplied = false;
      this.exactSearchValue = ''
      requestObj = this.reqObject;
    } else {
      this.isSearchedApplied = true;
      if(event.key === 'partyName') {
        requestObj = {
         "data" : {
           "searchCriteria" : { 'partyName' : event.value, 'exactSearch': this.exactSearch ? this.exactSearch: undefined }
           }
       }
       if(this.exactSearch){
        this.exactSearchValue = event.value
       }
     } else {
        requestObj = {
         "data" : {
           "searchCriteria" : { 'partyIds' : [event.value]}
           }
       }
     }
      this.searchReqObj = requestObj;
    }
   this.getSitesDetails(this.selectedBu, requestObj);
   this.selectEntireBu = false;
  }

  downloadExcel() {
    const url ='project/'+ this.projectStoreService.projectData.objId + '/parties/download';
    this.eaRestService.downloadDocApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithoutData(response, true)) { 
        this.utilitiesService.saveFile(response, this.downloadZipLink);
       // this.vnextStoreService.toastMsgObject.isBuExcelRequested = true;
        // setTimeout(() => {
        //   this.vnextStoreService.cleanToastMsgObject();
        // }, 10000);
      }
    });
  }

  updateSiteList() {
    const request = {
      'data': {
        'searchCriteria': this.searchReqObj.data.searchCriteria,
        'page': this.reqObject.data.page
      }
    }
    request.data.page.currentPage = 1;
    this.displayMessage = true;
    this.getSitesDetails(this.selectedBu, request)
  }

  selectDeselectEntireBU() {
    this.selectEntireBu = true;
    this.searchReqObj.data["selection"] = this.selectEntireBu;
    const url = 'project/' + this.projectStoreService.projectData.objId + '/cav/' + this.subsidiariesStoreService.subsidiariesData[0].cavId + '/bu/' + this.selectedBu.buId + '/parties?a=SELECT-ALL';
    this.eaRestService.postApiCall(url,this.searchReqObj).subscribe(response => {
      if (this.vnextService.isValidResponseWithoutData(response)) {
        this.displayMessage = true;
      }
    });
  }
  openAdvanceSearch(){
    this.projectStoreService.showHideAdvanceSearch = true;
    this.renderer.addClass(document.body, 'position-fixed');
    // const modalRef = this.modalVar.open(AdvancePartySearchComponent, { windowClass: 'md', backdropClass: 'modal-backdrop-vNext' });
    // modalRef.componentInstance.cavId = this.subsidiariesStoreService.subsidiariesData[0].cavId;
    // modalRef.componentInstance.buId = this.viewSitesForBu.buId;
    // modalRef.componentInstance.filterType = this.partyFilter;
    // modalRef.result.then(result => {
    //    if(result){
    //     if(result.searchIds){
    //       this.advancePartySearch(result.searchIds)
    //      } else if(result.excelSearchResponse){
    //       this.advanceSearchWithExcel(result.excelSearchResponse)
    //      }
    //    }
    // });
  }

  searchPartyIds($event) {
    if($event.searchIds){
      this.advancePartySearch($event.searchIds)
    } else if($event.excelSearchResponse){
      this.advanceSearchWithExcel($event.excelSearchResponse)
    }
  }

  advancePartySearch(searchIds) {//API call to advance search
    //const url = 'assets/vnext/cav-bu-sites-details.json';
    this.partyFilter = ''//reset filter to all for advance search.
    this.pageChangeRequested = false;
    this.viewSitesRequested = false;
    this.partiesSelectionMap.clear();
    this.selectedBuMap.clear();
    this.totalIdSearched = searchIds.length
    this.advancePartySearchIds = searchIds
    const request = {
      "data": {
       // "type": this.partyFilter ? this.partyFilter : undefined,
        "searchCriteria" : {partyIds: searchIds},
        "page": {
          "pageSize": 200,
          "currentPage": 1
        }
      }
    }
    const url = 'project/'+this.projectStoreService.projectData.objId+'/cav/' + this.subsidiariesStoreService.subsidiariesData[0].cavId + '/bu/' + this.viewSitesForBu.buId+'/parties';
      this.eaRestService.postApiCall(url,request).subscribe((response: any) => {
        if (this.vnextService.isValidResponseWithData(response)) {
          this.advanceSearchApplied = true;
          this.associatedSiteArr = response.data.partyDetails;
         // this.setMissingPartyId(searchIds);
          this.paginationObject = response.data.page;
          this.setSiteSelction(this.viewSitesForBu, this.associatedSiteArr, response.data)
        }
      })

  }

  advanceSearchWithExcel(response){
    this.partyFilter = ''//reset filter to all for advance search.
    this.advanceSearchApplied = true;
    this.associatedSiteArr = response.data.partyDetails;
    this.paginationObject = response.data.page;
    this.documentId = response.data.documentId;
    this.totalIdSearched = response.data.totalRecordsInExcel;
    this.setSiteSelction(this.viewSitesForBu, this.associatedSiteArr, response.data)
  }

  useExactSearch(){
    this.exactSearch = !this.exactSearch
    if(this.exactSearch){
      this.searchDropdownArray.pop()
    } else if(this.searchDropdownArray.length === 1){
      this.searchDropdownArray.push( {
        "id": "partyId",
        "name": "Party ID"
      })
    }
  }

  clearAdvanceSearch(){
    this.resetAdvanceSearch()
    this.getSitesDetails(this.selectedBu,this.reqObject)
  }
  resetAdvanceSearch(){
    if(this.reqObject.data?.['searchCriteria']?.partyIds){
      this.reqObject.data['searchCriteria'] = undefined
    }
    if(this.advanceSearchApplied){
      this.partiesSelectionMap.clear(); 
    }
    this.isSelectOnlyThese = false
    if(this.reqObject.data?.['documentId']){
      this.reqObject.data['documentId'] = undefined
    }
    this.partyFilter = ''//reset filter to all after clearing advance search.
    this.advancePartySearchIds = []
    this.missingPartyIds = []
    this.advanceSearchApplied = false;
    this.totalIdSearched = 0
    this.documentId = 0;
  }

  updatePartyFilter(tab) {
    if (this.partyFilter !== tab) {
      this.partyFilter = tab
      if(this.isSearchedApplied) {
      this.getSitesDetails(this.selectedBu, this.searchReqObj)
      } else {
        this.getSitesDetails(this.selectedBu, this.reqObject)
      }
    }
  }
  addToExisting(){
    if(this.advancePartySearchIds.length){
      this.associatedSiteArr.forEach((row) => {
          this.changePartyStatus(row,true)
          row.selected = true
      });

      this.save(true)
    } else if(this.documentId){
      this.savePartiesSelections(false)
    }
  }
  selectOnlyThese(){
    this.isSelectOnlyThese = true;
    this.addToExisting()
  }
}
