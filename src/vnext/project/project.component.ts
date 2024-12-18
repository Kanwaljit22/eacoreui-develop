import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { ProjectRestService } from './project-rest.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProjectService } from './project.service';
import { ProjectStoreService } from './project-store.service';
import { LookupDealidComponent } from 'vnext/modals/lookup-dealid/lookup-dealid.component';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { VnextService } from 'vnext/vnext.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EaStoreService } from 'ea/ea-store.service';
import { EaRestService } from 'ea/ea-rest.service';
import { EaService } from 'ea/ea.service';
import { LocalizationEnum } from 'ea/commons/enums/localizationEnum';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  dealId = '';
  projectName = '';
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };




  constructor(public projectService: ProjectService, private activatedRoute: ActivatedRoute, private router: Router,
    private projectStoreService: ProjectStoreService, private modalVar: NgbModal, private vnextService:VnextService, public vnextStoreService:VnextStoreService, private eaRestService: EaRestService,
    private eaStoreService: EaStoreService, private eaService: EaService
  ) { }

  ngOnInit() {
    //this.getProjectDetailsByDeal();
   
    if(this.eaStoreService.userInfo.userId){
      this.dealId = this.activatedRoute.snapshot.queryParamMap.get('did');
      this.projectName = this.activatedRoute.snapshot.queryParamMap.get('projectName');
    if (this.dealId) {
      this.getProjectDetailsByDealId(this.dealId);
    } else {
      this.openDealLookup();
    }
    }    
  }


  getProjectDetailsByDealId(dealId) {//get project details when user landes on vnext -- Punch in from SFDC
    let requestObj:any = {};
    if (Object.keys(this.eaStoreService.smartaccountReqObj).length){
      requestObj = this.eaStoreService.smartaccountReqObj;
    } else {
      requestObj = {
        data: {
          dealIdEnc: dealId
        }
      }
      if(this.projectName){
        requestObj.data.name =  this.projectName;
      }
    }
    const url = 'project';
    this.eaRestService.postApiCall(url, requestObj).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) {
        this.projectStoreService.projectData = response.data;
        this.eaStoreService.smartaccountReqObj = {};
        this.redirectToProject();
      }
    });
  }

  getProjectDetailsByDeal() {//get project details when user landes on vnext -- Punch in from SFDC
    let requestObj = {};
    if (Object.keys(this.eaStoreService.smartaccountReqObj).length){
      requestObj = this.eaStoreService.smartaccountReqObj;
    } 
    const url = 'project';
    this.eaRestService.postApiCall(url, requestObj).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) {
        this.projectStoreService.projectData = response.data;
        this.eaStoreService.smartaccountReqObj = {};
        this.redirectToProject();
      }
    });
  }


  openDealLookup() {
    const ngbModalOptionsLocal = this.ngbModalOptions;
    ngbModalOptionsLocal.windowClass = 'md vNextlookup-modal';
    ngbModalOptionsLocal.backdropClass = 'modal-backdrop-vNext';

    const modalRef = this.modalVar.open(LookupDealidComponent, ngbModalOptionsLocal);
    // modalRef.result.then((result) => {
    //   this.dealId = result;
    //   this.redirectToProject();
    // });
  }

  redirectToProject() {
    this.router.navigate(['ea/project/' + this.projectStoreService.projectData.objId]);
  }
}


