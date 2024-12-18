import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EaRestService } from 'ea/ea-rest.service';
import { EaStoreService } from 'ea/ea-store.service';
import { EaService, PaginationObject } from 'ea/ea.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';

@Component({
  selector: 'app-dashboard-project-list',
  templateUrl: './dashboard-project-list.component.html',
  styleUrls: ['./dashboard-project-list.component.scss']
})
export class DashboardProjectListComponent implements OnInit {

  constructor(private eaRestService: EaRestService, private router: Router, private eaService: EaService, private eaStoreService: EaStoreService, public localizationService: LocalizationService, public dataIdConstantsService: DataIdConstantsService, private constantsService: ConstantsService) { }

  projectsListData: any = [];
  paginationObject: PaginationObject;
  request = {
    "data": {
      "createdByMe": true,
      "page": {
        "pageSize": 10,
        "currentPage": 0
      }
    }
  }
  isPartnerLoggedIn = false;
  selectedView = this.localizationService.getLocalizedString('ea_dashboard.CREATED_BY_ME');
  viewOptions = [this.localizationService.getLocalizedString('ea_dashboard.CREATED_BY_ME'), this.localizationService.getLocalizedString('ea_dashboard.SHARED_WITH_ME')]; 
  openDrop = false;
  searchParam = '';
  displayGrid = false;
  isSearchedData =  false;
  ngOnInit() {
    this.paginationObject = { noOfRecords: 50, currentPage: 1, pageSize: 50, noOfPages: 1 };
    if (this.eaService.isPartnerUserLoggedIn()){
      this.isPartnerLoggedIn = true;
    }
    this.getProjectListData()
  }


  getProjectListData(){
    this.isSearchedData = false;
    const url ='project/list';
    if (this.isSearchedData){
      this.isSearchedData = false;
      this.request.data.page.currentPage = 0;
      this.request.data.page.pageSize = 10;
    }
    this.projectsListData = [];
    this.eaRestService.postApiCall(url, this.request).subscribe((response: any)=> {
      if (response && response.data && !response.error){
        this.displayGrid = true
        this.eaStoreService.isUserApprover = response.data.approver ? true : false;
        this.projectsListData = response.data.projects;
        this.paginationObject = response.data.page;
        this.paginationObject.currentPage++ ;
      } else {
        this.projectsListData = [];
      }
    })
  }

  goToProject(project){
    let index;
    let routeUrl;
    index = window.location.href.lastIndexOf(this.constantsService.EA);
    routeUrl = window.location.href.substring(0, index)
    
   // const index =  window.location.href.lastIndexOf(this.constantsService.EA)
    const url  = routeUrl
    if (project.buyingProgram === 'EA 3.0' || project.buyingProgram === 'SPNA 3.0'){
      this.eaService.updateDetailsForNewTab();
     //this.router.navigate(['ea/project/' + project.objId])
     window.open(url + 'ea/project/' + project.objId);
    } else {
      //this.router.navigate(['qualifications/' + project.id])
      window.open(url + 'qualifications/' + project.objId);
    }
  }

  paginationUpdated(event){
    this.request.data.page.pageSize = event.pageSize;
    this.request.data.page.currentPage = event.currentPage - 1;
    if (this.searchParam && this.isSearchedData){
      this.searchProjects();
    } else {
      this.searchParam = '';
      this.getProjectListData();
    }
 }

  selectedCreatedBy(value) {
    if (value === this.localizationService.getLocalizedString('ea_dashboard.CREATED_BY_ME')) {
      this.request.data.createdByMe = true;
    } else {
      this.request.data.createdByMe = false;
    }
    this.selectedView = value;
    this.openDrop = false;
    this.searchParam = '';
    this.request.data.page.currentPage = 0;
    this.request.data.page.pageSize = 10;
    this.getProjectListData();
  }

 searchProjects() {
  if (!this.searchParam || !this.searchParam.trim().length){
    return;
  }
  this.searchParam = this.searchParam.trim();
   const reqJson = {
     "type": "project",
     "createdByMe" : this.request.data.createdByMe,
     "page": { 
       "pageSize": this.request.data.page.pageSize, 
       "currentPage": this.request.data.page.currentPage 
      }, 
     "searchrequest": {
      "name": this.searchParam,
      "dealId": this.searchParam,
      "customerName": this.searchParam
     }
   }
  const url = 'home/search';
  this.eaRestService.postApiCall(url, reqJson).subscribe((response: any) => {
    this.isSearchedData =  true;
    if (response && response.data && !response.error) {
      // this.isSearchedData =  true;
      this.projectsListData = response.data.projects;
      this.paginationObject = response.data.page;
      this.paginationObject.currentPage++;
    } else {
      this.projectsListData = [];
    }
  });
}

}
