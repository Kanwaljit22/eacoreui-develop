import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { EaRestService } from 'ea/ea-rest.service';
import { EaStoreService } from 'ea/ea-store.service';
import { EaService } from 'ea/ea.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
@Component({
  selector: 'app-ea-dashboard',
  templateUrl: './ea-dashboard.component.html',
  styleUrls: ['./ea-dashboard.component.scss']
})
export class EaDashboardComponent implements OnInit, OnDestroy {

  constructor(public eaStoreService: EaStoreService, public eaService: EaService, public localizationService: LocalizationService, public eaRestService: EaRestService, public dataIdConstantsService: DataIdConstantsService, private constantService: ConstantsService) { }
  selectedTab = 'deals';
  isPartnerLoggedIn = false;
  filterMetaData: any = []; // to set filter metdata for showing in filters
  filters: any = [];
  ngOnInit() {
    if(this.eaStoreService.isValidationUI){
      this.eaService.navigateToVui()
    }
    if (!this.eaStoreService.maintainanceObj.underMaintainance){
       this.loadData();
    }
  }

  loadData() {
    this.eaStoreService.isFromDashboard = true;
    this.getExpetionApprover();
    if (this.eaService.isPartnerUserLoggedIn()){
      this.isPartnerLoggedIn = true;
    } else {
      this.isPartnerLoggedIn = false;
    }
    this.getFilterMetaData(); // get filters metadata
  }
  selectTabToShow(type){
    if (this.selectedTab !== type){
      this.selectedTab = type;
    //  this.eaService.clearFilterSelection.next(this.selectedTab);
     // if(this.selectedTab === 'deals'){
        this.getFilterMetaData(); // get filters metadata
     // }
    }
  }

  ngOnDestroy(){
    this.eaStoreService.isUserApprover = false;
    this.eaStoreService.selectedDealData = {};
    this.eaStoreService.showProposalsFromDeal = false;
    this.eaStoreService.isExceptionApprover = false;
  }

  getExpetionApprover() {
    const request = {
      "searchCriteriaList" : [{"searchKey" : "APPROVALS","searchValue":"ALL"},{"searchKey": "BUYINGPROGRAM","searchValue": "3.0,spna"}]
    };
    const url = 'home/exceptionspendingapprovals';
    this.eaRestService.postApiCall(url, request).subscribe((response: any) => {
      if (response && response.data && response.data.responseApproverList?.length && !response.error){
          this.eaStoreService.isExceptionApprover = true;
        } else {
          this.eaStoreService.isExceptionApprover = false;
        }
      });
    }

  // to get filters metadata for dashboard
  getFilterMetaData(){
    const url = 'assets/vnext/ea_dashboard_filter.json';
    this.eaRestService.getApiCallJson(url).subscribe((response: any) => {
      if (response && !response.error){
          this.filterMetaData = response.data;
          this.filters = response.data;
          this.filterMetaData.forEach(element => {
            element.showFilters = true;
          });
          if (this.selectedTab === 'pendingApprovals') {
            this.filterMetaData = this.filters.filter(element => element.type === 'BUYINGPROGRAM')
          }
          if (!this.eaService.features.SPNA_REL || !this.eaService.features.SPNA_BP_ENABLEMENT_REL) {
            this.createFilters();
          }
      }
    });  
  }

  createFilters () {
    let filter;
    this.filters.forEach(element => {
      if (element.type === this.constantService.BUYINGPROGRAM) {
       filter = element.filters.filter(ele => ele.id !== this.constantService.SPNA);
       element.filters = filter
      }
    });
  }

  selectedPendingListView(event) {
    let data;
    for (let i = 0; i < this.filterMetaData.length; i++) {
      if (this.filterMetaData[i].name === 'Creator'){
        this.filterMetaData[i].filters.forEach(filter => {
          if (filter.id === 'createdByMe'){
            filter.selected = true;
          } else {
            filter.selected = false;
          }
        });
      } else {
        this.filterMetaData[i].filters.forEach(filter => {
          filter.selected = true;
        });
      }
    }
    if (!event) {
      data = this.filters.filter(element => element.type === 'BUYINGPROGRAM')
    } else {
      data = this.filters.filter(element => element.type === 'BUYINGPROGRAM' || element.type === 'DISPLAYFILTER')
    }
    this.filterMetaData = data;
  }
}
