import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EaRestService } from 'ea/ea-rest.service';
import { EaService, PaginationObject } from 'ea/ea.service';
import { MessageService } from 'vnext/commons/message/message.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { EaidStoreService } from 'vnext/eaid/eaid-store.service';
import { EaidService } from 'vnext/eaid/eaid.service';
import { AdvancePartySearchComponent } from 'vnext/modals/advance-party-search/advance-party-search.component';
import { CancelScopeChangeComponent } from 'vnext/modals/cancel-scope-change/cancel-scope-change.component';
import { DownloadCustomerScopeComponent } from 'vnext/modals/download-customer-scope/download-customer-scope.component';
import { ReviewChangeScopeSummaryComponent } from 'vnext/modals/review-change-scope-summary/review-change-scope-summary.component';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { ProjectService } from 'vnext/project/project.service';
import { SubsidiariesStoreService } from 'vnext/project/subsidiaries/subsidiaries.store.service';
import { VnextService } from 'vnext/vnext.service';

@Component({
  selector: 'app-cav-id-details',
  templateUrl: './cav-id-details.component.html',
  styleUrls: ['./cav-id-details.component.scss']
})
export class CavIdDetailsComponent implements OnInit, OnDestroy {
  @Input() subsidiariesData = [];
  isAnyBuSelected = false; // set if atlease one bu selected
  @Input() isEaidFlow = false
  associatedSiteArr = []; 
  showAssociatedSites = false;
  toggle = true;
  allCustomerCheck = true;
  // selectedBuMap = new Map<number, boolean>(); // to map bu's and selection
  // partiesSelectionMap = new Map<string,boolean>(); //This map is use to store use action on party selections.
  isUserClickedSave = false; // set if user clicked on save and continue
  pageChangeRequested = false;
  documentId = 0;
  @ViewChild('downloadZipLink', { static: false }) private downloadZipLink: ElementRef;
  isSearchedApplied = false;
  searchReqObj =  {
    "data": {
      "searchCriteria" : { 'partyName' : '', 'partyIds' : []}
    }
  };
  displayMessage = false;
  advancePartySearchIds = [];
  selectEntireBu
  totalIdSearched = 0;
  allSitesCheck = false;
  selectedBu: any = {};
  advanceSearchApplied = false;
  isSaveAndContinueRequested = false
  missingPartyIds = [];
  paginationObject: PaginationObject;
  viewSitesRequested = false;
  viewSitesForBu: any = {};
  isSelectOnlyThese = false;
  downloadVersionData = [];
  reqObject = {
    "data": {
      "page": {
        "pageSize": 200,
        "currentPage": 1
      }
    }
  };
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
  exactSearch = false;
  exactSearchValue = '';
  searchPlaceHolder = 'Search By Party Name';
  partyFilter = '';
  @Output() moveToNextStep = new EventEmitter();
  subscribers: any = {};

  constructor(private subsidiariesStoreService: SubsidiariesStoreService,private modalVar: NgbModal, 
    public projectService: ProjectService, public dataIdConstantsService: DataIdConstantsService, private eaidService: EaidService,
    public localizationService: LocalizationService, private renderer: Renderer2, public projectStoreService: ProjectStoreService,
     private eaRestService: EaRestService, public vnextService: VnextService, public eaService: EaService, public utilitiesService: UtilitiesService, private constantService: ConstantsService,
     private vnextStoreService: VnextStoreService, public eaIdStoreService: EaidStoreService, public messageService: MessageService) {

  }

  ngOnInit(): void {

    this.showPartiesForSelectedBu();

    this.subscribers.saveEaidDetails = this.eaidService.saveEaidDetails.subscribe((value:boolean) => {
      this.isSaveAndContinueRequested = (value) ? true: false ;
      if(this.eaIdStoreService.selectedBuMap.size){
        this.saveBuSelection()
      } else if(this.eaIdStoreService.partiesSelectionMap.size){
        this.savePartiesSelections(true)
      } else {
        this.moveToListPage()
      }
    })

    this.subscribers.scopeChangeRequest = this.eaidService.scopeChangeRequest.subscribe((value:boolean) => {
      this.setBusSelectedDefault(this.subsidiariesData);
    })
  }

  showPartiesForSelectedBu(){
    if(this.subsidiariesData?.length){
      this.setBusSelectedDefault(this.subsidiariesData);
      // const selectedbus = this.subsidiariesData.filter(bu => (bu?.selected === 'F' || bu?.selected === 'P'))
      // this.showSites(selectedbus[0]);
      let defaultBU;
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
        this.showSites(defaultBU, true);
      }
      // check and set if atleast one bu selected
      if(this.isEaidFlow){
        this.eaIdStoreService.isAnyBuSelected = false;
        this.setIsAnyBuChecked();
      }
    }
  }

  moveToListPage(){
    if(this.isSaveAndContinueRequested){
      this.moveToNextStep.emit();
     }
  }
  // to set bu's checked
  setBusSelectedDefault(data) {
    for (let bu of data) {
      // check for new eaid project check dealcrparty bu if selected
      if (bu.selected === 'P' || bu.selected === 'F') {
        bu.checked = true;
      }
      bu.showSites = false;

      if(this.isEaidFlow){
        if(this.eaIdStoreService.eaIdData?.overlapBuData?.overlapBus?.length && this.eaIdStoreService.eaIdData?.overlapBuData?.overlapBus.includes(bu.buId) && !bu?.checked){
          bu.disableForOverlapping = true
        }
      }
    }
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

  isBuSelected(bu) {
    if (bu.checked) {
      return true;
    } else {
      this.allCustomerCheck = false;
      return false;
    }
  }

  showSites(val, initialLoad?) {
    this.reqObject.data.page = {
      "pageSize": 200,
      "currentPage": 1
    }
    if(this.isEaidFlow){ 
      this.resetAdvanceSearch()
      this.isSearchedApplied = false;
    this.subsidiariesData.forEach((element) => {
      if (element.showSites && val.buId === element.buId) {
        element.showSites =  true;
      } else {
        element.showSites =  false;
      }
    })
    if(this.eaIdStoreService.selectedBuMap.size){
      if (val.buId !== this.selectedBu.buId) { 
        this.showAssociatedSites = true;
      }
      this.viewSitesRequested = true;
      // val.showSites = true;
      this.selectedBu = val;
      this.saveBuSelection();
    } else {
      if(this.eaIdStoreService.partiesSelectionMap.size){
        this.savePartiesSelections(true)
      }
      if ((val.buId !== this.selectedBu.buId) || initialLoad) { // check selected Bu
        val.showSites = true;
        this.selectedBu = val;
        
        this.showAssociatedSites = true;
        // call api to load associated Sites data 
        this.getSitesDetails(val, this.reqObject);
      }
    }
   this.projectService.clearSearchInput.next(true);
    } else {
      this.subsidiariesData.forEach((element) => {
        if (element.showSites && val.buId === element.buId) {
          element.showSites =  true;
        } else {
          element.showSites =  false;
        }
      })
      this.getSitesDetails(val, this.reqObject);
      this.showAssociatedSites = true;
      this.selectedBu = val;
    }
    
  }
    // for pagination
    paginationUpdated(event) {
      if(this.isEaidFlow){
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
    
        if (this.eaIdStoreService.partiesSelectionMap.size || this.eaIdStoreService.selectedBuMap.size) {
          this.pageChangeRequested = true;
          this.save();
        } else {
          this.getSitesDetails(this.selectedBu, reqObj);
        }
      } else {
        let reqObj;
        reqObj = {
          "data": {
            "page": {
              "pageSize": event.pageSize,
              "currentPage": event.currentPage
            }
          }
        };
  
        this.getSitesDetails(this.selectedBu, reqObj);
      }
    }
    // method to check and set parties selected from seletced Bu
    setSiteSelction(subsidiary, sitesArr, sitesData){
      this.selectedBu.showSites = true;
      if (subsidiary.selected === 'F'){ // if full selection, make default selection to all parties
        for (let data of sitesArr){
          data.selected = true;
        }
      } else if (sitesData.selectedParties || this.eaIdStoreService.partiesSelectionMap.size) { // if partial selection, check selectedParties and make selection to parties
        for (let data of sitesArr){
          if (sitesData.selectedParties.includes(data.CR_PARTY_ID) || this.eaIdStoreService.partiesSelectionMap.has(data.CR_PARTY_ID)) {
            data.selected = true;
          }
        }
      }
      this.checkAllSitesSelected(sitesArr);
    }

  // setSiteSelction(subsidiary, sitesArr, sitesData){
  //   this.selectedBu.showSites = true;
  //   if (subsidiary.selected === 'F'){ // if full selection, make default selection to all parties
  //     for (let data of sitesArr){
  //       data.selected = true;
  //     }
  //   } else if (sitesData.selectedParties) { // if partial selection, check selectedParties and make selection to parties
  //     for (let data of sitesArr){
  //       if (sitesData.selectedParties.includes(data.CR_PARTY_ID)) {
  //         data.selected = true;
  //       }
  //     }
  //   }
  //   this.checkAllSitesSelected(sitesArr);
  // }

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
    if(this.isEaidFlow){
    request.data.type = this.partyFilter ? this.partyFilter : undefined;
    if(this.advanceSearchApplied && this.advancePartySearchIds.length){
      request.data.searchCriteria = {partyIds: this.advancePartySearchIds}
    }
    if(this.advanceSearchApplied && this.documentId){
      request.data['documentId'] = this.documentId
    }
    this.pageChangeRequested = false;
    this.viewSitesRequested = false;
      const url = 'project/cav/' + this.subsidiariesStoreService.subsidiariesData[0].cavId + '/bu/' + val.buId+'/parties?eaid=' + this.eaIdStoreService.encryptedEaId;
      this.eaRestService.postApiCall(url,request).subscribe((response: any) => {
        if (this.vnextService.isValidResponseWithData(response)) {
          this.associatedSiteArr = response.data.partyDetails;
          this.paginationObject = response.data.page;
          this.viewSitesForBu = val;
          this.setSiteSelction(val, this.associatedSiteArr, response.data)
        }
      });
    } else {
      const url = 'project/'+this.projectStoreService.projectData.objId+'/cav/' + this.subsidiariesStoreService.subsidiariesData[0].cavId + '/bu/' + val.buId+'/parties?eaid=' + this.projectStoreService.currentBpId?.eaIdSystem;
      this.eaRestService.postApiCall(url,request).subscribe((response: any) => {
        if (this.vnextService.isValidResponseWithData(response)) {
          this.associatedSiteArr = response.data.partyDetails;
          this.paginationObject = response.data.page;
          this.viewSitesForBu = val;
          this.setSiteSelction(val, this.associatedSiteArr, response.data)
        }
      });
    }
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
  // openAdvanceSearch(){
  //   const modalRef = this.modalVar.open(AdvancePartySearchComponent, { windowClass: 'md', backdropClass: 'modal-backdrop-vNext' });
  //   modalRef.componentInstance.cavId = '';
  //   modalRef.componentInstance.buId = '';
  //   modalRef.componentInstance.filterType = this.partyFilter;
  // }

  openAdvanceSearch(){
    this.projectStoreService.showHideAdvanceSearch = true;
    this.renderer.addClass(document.body, 'position-fixed');
    // const modalRef = this.modalVar.open(AdvancePartySearchComponent, { windowClass: 'md', backdropClass: 'modal-backdrop-vNext' });
    // modalRef.componentInstance.cavId = this.subsidiariesStoreService.subsidiariesData[0].cavId;
    // modalRef.componentInstance.buId = this.viewSitesForBu.buId;
    // modalRef.componentInstance.isEditEaidFlow = true;
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


  // check and set if atleast one bu selected
  setIsAnyBuChecked(){
    this.isAnyBuSelected = this.subsidiariesData.filter(bu => bu?.checked).length ? true : false;
    if(this.isEaidFlow){
      this.eaIdStoreService.isAnyBuSelected =  this.isAnyBuSelected;
    }
  }


  selectAllCustomerBu() {
    this.allCustomerCheck = !this.allCustomerCheck
    // check for new eaid project and allow to check dealcrpartybu as well
    this.subsidiariesData.forEach((row) => {
      if ((!row.dealCrPartyBU || (row.dealCrPartyBU && ((this.projectService.isNewEaIdCreatedForProject && this.eaService.features.EAID_REL) || this.isEaidFlow))) && !row.disabled && row.checked !== this.allCustomerCheck){
        row.checked = this.allCustomerCheck ? true : false;
        this.eaIdStoreService.selectedBuMap.set(row.buId, row);
      }
    })
    // check and set if atleast one bu selected
    if(this.projectService.isNewEaIdCreatedForProject || this.isEaidFlow){
      this.setIsAnyBuChecked();
    }
  }


  selectAllSites() {
    this.allSitesCheck = !this.allSitesCheck
    this.associatedSiteArr.forEach((row) => {
      this.changePartyStatus(row,this.allSitesCheck)
        row.selected = this.allSitesCheck ? true : false
      // if (!this.projectService.checkAndSetSelectedCrPartyFromDeal(this.selectedBu, row)){
      //   this.changePartyStatus(row,this.allSitesCheck)
      //   row.selected = this.allSitesCheck ? true : false

      // }
    });

  }



  changePartyStatus(party, event) {
    if (party.selected !== event || this.isSelectOnlyThese) {
      party.checked = event;
      party.selected = event;
      party.buId = this.selectedBu.buId
      if (this.eaIdStoreService.partiesSelectionMap.has(party.CR_PARTY_ID)) {
        this.eaIdStoreService.partiesSelectionMap.delete(party.CR_PARTY_ID);
      } else {
        this.eaIdStoreService.partiesSelectionMap.set(party.CR_PARTY_ID, party);
      }
    }
  }  
  

  changeBuStatus(bu,event) {
    bu.checked = event.target.checked;
    if(this.eaIdStoreService.selectedBuMap.has(bu.buId)){
        this.eaIdStoreService.selectedBuMap.delete(bu.buId);
    } else{
        this.eaIdStoreService.selectedBuMap.set(bu.buId,bu);
    }  
    
    if(this.selectedBu.buId === bu.buId){
      if(!bu.checked){
        this.showAssociatedSites = false;
      }else {
        this.showAssociatedSites = true;
      }
    }
    // check and set if atleast one bu selected
    if(this.projectService.isNewEaIdCreatedForProject || this.isEaidFlow){
      this.setIsAnyBuChecked();
    }
  } 


 // set map for bu's selected/deselected
 checkAndSetCheckedBu(bu){
  this.eaIdStoreService.selectedBuMap.set(bu.buId, bu.checked)
 }

  save(userclick?) {
    if (userclick) { // is user clicks, set it to true
      this.isUserClickedSave = true;
    } else {
      this.isUserClickedSave = false;
    }
   if(this.eaIdStoreService.selectedBuMap.size){
    this.saveBuSelection()
   }
   if(this.eaIdStoreService.partiesSelectionMap.size && this.eaIdStoreService.selectedBuMap.size === 0){
    this.savePartiesSelections()
   }
 }

 //method to save Bu selection/deselection
 saveBuSelection() {
    const includedBu = [];
    const excludedBu = [];    
    this.eaIdStoreService.selectedBuMap.forEach((value: any, key: any) => {
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
      },
      "eaid": this.eaIdStoreService.encryptedEaId
    }
    }
    const url = this.constantService.URL_PROJECT_CAV + this.subsidiariesStoreService.subsidiariesData[0].cavId;
     this.eaRestService.putApiCall(url, reqObject).subscribe((response: any) => {
       if(this.vnextService.isValidResponseWithoutData(response)){
        this.displayMessage = true;
        if(excludedBu.length){  // to remove/add selected variable to deselected/selected Bu
          this.checkAndChangeBuSelection();
        }
        if(this.viewSitesRequested){
          //this.selectedBu.selected = 'F'
        }
        if(includedBu.length){
          includedBu.forEach((bu) => {
            const updatedBu = this.subsidiariesData.find(value => value.buId === bu);
            if(updatedBu){
              updatedBu['selected'] = 'F'
            }
          })
        }
        if(this.eaIdStoreService.partiesSelectionMap.size){
          this.savePartiesSelections()
        } else{
          this.eaIdStoreService.selectedBuMap.clear();
          this.moveToListPage();
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
  this.eaIdStoreService.disableContinue = false;
  this.eaIdStoreService.partiesSelectionMap.forEach((value: any, key: any) => {
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
      },
      "eaid": this.eaIdStoreService.encryptedEaId
    }
  }
  if(this.documentId){
    reqObject.data.parties = undefined;
    reqObject.data['documentId'] = this.documentId
    reqObject.data['type'] = this.partyFilter ? this.partyFilter: undefined
  }
  const buIdForUpdatedParties = this.viewSitesForBu.buId
  let url = this.constantService.URL_PROJECT_CAV + this.subsidiariesStoreService.subsidiariesData[0].cavId + this.constantService.URL_BU + this.viewSitesForBu.buId;
  if(this.isSelectOnlyThese){
    url = url + '?a=SELECT-ONLY'
  }
   this.eaRestService.putApiCall(url, reqObject).subscribe((response: any) => {
     if(this.vnextService.isValidResponseWithoutData(response)){
      this.displayMessage = true;
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
      this.eaIdStoreService.partiesSelectionMap.clear();
      this.eaIdStoreService.selectedBuMap.clear();
      this.resetFlags();
      if((response.data.message && response.data.message?.hasError) || response.data?.overlapBuData?.overlapBu){
        if(response.data.message?.hasError){
          this.eaIdStoreService.disableContinue = true;
        }
        this.messageService.pessistErrorOnUi = true;
        if (response.data.message && response.data.message?.messages?.length) {
          this.messageService.displayMessages(response.data.message?.messages);
        }
        if(response.data?.overlapBuData?.overlapBu){
          this.eaIdStoreService.isShowBuOverlapMessage = true;
          this.eaIdStoreService.disableContinue = true;
        } 
      } else {
        this.moveToListPage();
        if(!onlySave){
          this.checkForPageUpdate();
        }
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
  if(this.eaIdStoreService.selectedBuMap.has(buId)){
        const bu = this.eaIdStoreService.selectedBuMap.get(buId);
        if(!this.eaIdStoreService.selectedBuMap.get(buId)){
            return false;
        }
  } 
      return true;
}

 // close flyout and clear map
  backToProject(closeWithoutSave?) {
    if((!this.eaIdStoreService.partiesSelectionMap.size && !this.eaIdStoreService.selectedBuMap.size) || closeWithoutSave){
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
    const url = 'service-registry/url?track=CSH&service=CUSTOMER_SERVICE';
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) {
        window.open(response.data);
      }
    })
  }

  ngOnDestroy() {
    this.eaIdStoreService.selectedBuMap.clear();
    this.eaIdStoreService.partiesSelectionMap.clear();
    this.projectService.selectMoreBuId = false; 
    this.isUserClickedSave = false;
    // this.vnextStoreService.cleanToastMsgObject();
    this.projectStoreService.showHideFilterMenu = false;
    this.renderer.removeClass(document.body, 'position-fixed');
    this.eaIdStoreService.isAnyBuSelected = false;
    if (this.subscribers.saveEaidDetails){
      this.subscribers.saveEaidDetails.unsubscribe();
    }
    this.eaIdStoreService.disableContinue = false;
    if (this.subscribers.scopeChangeRequest){
      this.subscribers.scopeChangeRequest.unsubscribe();
    }
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
    const url = this.constantService.URL_PROJECT_CAV + this.subsidiariesStoreService.subsidiariesData[0].cavId + this.constantService.URL_BU + this.selectedBu.buId + this.constantService.URL_PARTIES_SELECTALL + this.constantService.URL_EAID + this.eaIdStoreService.encryptedEaId;
    this.eaRestService.postApiCall(url,this.searchReqObj).subscribe(response => {
      if (this.vnextService.isValidResponseWithoutData(response)) {
        this.displayMessage = true;
      }
    });
  }


  advancePartySearch(searchIds) {//API call to advance search
    //const url = 'assets/vnext/cav-bu-sites-details.json';
    this.partyFilter = ''//reset filter to all for advance search.
    this.pageChangeRequested = false;
    this.viewSitesRequested = false;
    this.eaIdStoreService.partiesSelectionMap.clear();
    this.eaIdStoreService.selectedBuMap.clear();
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
    const url = this.constantService.URL_PROJECT_CAV + this.subsidiariesStoreService.subsidiariesData[0].cavId + this.constantService.URL_BU + this.viewSitesForBu.buId+ this.constantService.URL_PARTIES +  this.constantService.URL_EAID + this.eaIdStoreService.encryptedEaId;
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



  clearAdvanceSearch(){
    this.resetAdvanceSearch()
    this.getSitesDetails(this.selectedBu,this.reqObject)
  }
  resetAdvanceSearch(){
    if(this.reqObject.data?.['searchCriteria']?.partyIds){
      this.reqObject.data['searchCriteria'] = undefined
    }
    if(this.advanceSearchApplied){
      this.eaIdStoreService.partiesSelectionMap.clear(); 
    }
    this.isSelectOnlyThese = false
    if(this.reqObject.data?.['documentId']){
      this.reqObject.data['documentId'] = undefined
    }
    this.partyFilter = ''//reset filter to all after clearing advance search.
    this.advancePartySearchIds = []
    this.missingPartyIds = []
    this.advanceSearchApplied = false;
    this.totalIdSearched = 0;
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

  restoreOriginal() {
    const modal =  this.modalVar.open(CancelScopeChangeComponent, {windowClass: 'cancel-reason-modal'});
    modal.componentInstance.isCancelScope = false;
    modal.result.then((result) => { 
      if (result.continue) {
         const url ='project/restore-scope?eaid=' + this.eaIdStoreService.encryptedEaId;
          this.eaRestService.getApiCall(url).subscribe((response: any) => {
            if (this.vnextService.isValidResponseWithData(response)) { 
              // this.eaIdStoreService.eaIdData = response.data;
              this.subsidiariesData = response.data.cavs ? response.data.cavs[0].bus : response.data[0].bus; 
              this.subsidiariesStoreService.subsidiariesData = response.data.cavs ? response.data.cavs : response.data;
              this.resetFlags();
              if(response.data?.overlapBuData){
                this.eaIdStoreService.eaIdData.overlapBuData = response.data.overlapBuData;
                if(response.data.overlapBuData?.overlapBu){
                  this.messageService.pessistErrorOnUi = true;
                  this.eaIdStoreService.isShowBuOverlapMessage = true;
                  this.eaIdStoreService.disableContinue = true;
                }
              }
              this.showPartiesForSelectedBu();
            }
        });
      }
    });
  }

  // reset all the flags set in eaidstoreserivce
  resetFlags() {
    this.messageService.pessistErrorOnUi = false;
    this.eaIdStoreService.isShowBuOverlapMessage = false;
    this.eaIdStoreService.disableContinue = false;
  }

  downloadScopeExcel() {
    const url = 'project/scope-versions?eaid=' + this.eaIdStoreService.encryptedEaId;
    // Fetch scope versions from the API
    this.eaRestService.getApiCall(url).subscribe((res: any) => {
      if (this.vnextService.isValidResponseWithData(res, true)) {
        // Open the modal and pass the fetched data
        const modalRef = this.modalVar.open(DownloadCustomerScopeComponent, {
          windowClass: 'download-scope-change',
          backdropClass: 'modal-backdrop-vNext',
        });

        // Pass the fetched version data to the modal
        modalRef.componentInstance.downloadVersionData = res.data;
        
        // Handle the modal's result when it closes
        modalRef.result.then((result) => {
          if (result?.selectedVersion?.id) {
            // Prepare the request object for the selected version
            const reqObj = { data: { id: result.selectedVersion.id } };
            const postUrl = 'project/scope-versions';

            // Trigger a download for the selected version
            this.eaRestService.downloadPostApiCall(postUrl, reqObj).subscribe((response: any) => {
              if (this.vnextService.isValidResponseWithoutData(response, true)) {
                this.utilitiesService.saveFile(response, this.downloadZipLink);
              }
            });
          }
        });
      } else {
        if (res.error) {
          this.messageService.disaplyModalMsg = true;
          this.messageService.displayMessagesFromResponse(res);
        } else if (!res.data) {
           // If no data is found, trigger an alternate download per MW
          const reqObj = { data: { eaid: this.eaIdStoreService.encryptedEaId } };
          const postUrl = 'project/scope-versions';
          this.eaRestService.downloadPostApiCall(postUrl, reqObj).subscribe((response: any) => {
            if (this.vnextService.isValidResponseWithoutData(response, true)) {
              // Save the downloaded file
              this.utilitiesService.saveFile(response, this.downloadZipLink);
            }
          });
        }
      }
    });
  }

  reviewChanges() {
    const modalRef = this.modalVar.open(ReviewChangeScopeSummaryComponent, { windowClass: 'review-change-scope', backdropClass: 'modal-backdrop-vNext' });
    modalRef.componentInstance.cavId = '';
    modalRef.result.then((result) => {
      if (result.continue) {
        const url ='project/download-review-scope-changes?eaid=' + this.eaIdStoreService.encryptedEaId;
        this.eaRestService.downloadDocApiCall(url).subscribe((response: any) => {
          if (this.vnextService.isValidResponseWithoutData(response, true)) { 
            this.utilitiesService.saveFile(response, this.downloadZipLink);
          } 
          // else {
          //   this.messageService.displayMessagesFromResponse(response);
          // }
        });
      }
    })
  }
  searchPartyIds($event) {
    if($event.searchIds){
      this.advancePartySearch($event.searchIds)
    } else if($event.excelSearchResponse){
      this.advanceSearchWithExcel($event.excelSearchResponse)
    }
  }
}
