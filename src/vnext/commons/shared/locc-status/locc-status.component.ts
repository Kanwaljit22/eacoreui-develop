import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EaRestService } from 'ea/ea-rest.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { LoccModalComponent } from 'vnext/modals/locc-modal/locc-modal.component';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { ProjectService } from 'vnext/project/project.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { VnextService } from 'vnext/vnext.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaService } from 'ea/ea.service';
import { EaStoreService } from 'ea/ea-store.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';

@Component({
  selector: 'app-locc-status',
  templateUrl: './locc-status.component.html',
  styleUrls: ['./locc-status.component.scss']
})
export class LoccStatusComponent implements OnInit {

  showLoccDrop = false;
  @ViewChild('downloadZipLink', { static: false }) private downloadZipLink: ElementRef; 
  constructor(public projectService: ProjectService, public projectStoreService: ProjectStoreService, private proposalStoreService: ProposalStoreService, public localizationService: LocalizationService,
     private utilitiesService: UtilitiesService, private vnextService: VnextService, private modalVar: NgbModal, public vnextStoreService: VnextStoreService, private eaRestService: EaRestService,
     public eaService: EaService, private eaStoreService: EaStoreService, public dataIdConstantsService: DataIdConstantsService) { }

  ngOnInit() {

    // check and set loccDetail from project data if not present in vnextstore
    if (!Object.keys(this.vnextStoreService.loccDetail).length && this.projectStoreService.projectData.loccDetail) {
      this.vnextStoreService.loccDetail = this.projectStoreService.projectData.loccDetail
    }
  }

  // method to show locc for not signed/ penidng signature status
  showLocc() {
    // show locc only if projectinProgress or proposalObjId is present

    this.projectService.showLocc = (this.eaStoreService.pageContext === this.eaStoreService.pageContextObj.CREATE_PROJECT || this.proposalStoreService.proposalData.objId) ? true : false;
    
    // if proposal open locc modal
    if (this.proposalStoreService.proposalData.objId){
      this.openLoccModal()
    }
  }

  // to show dropdown for locc signed
  showDropDown(){
    if (!this.vnextStoreService.loccDetail.loccSigned){
      this.showLocc();
    } else {
      this.showLoccDrop = !this.showLoccDrop;
    }
  }

  // to downlaod locc file
  downloadLoccFile(){
    this.vnextService.downloadLocc(this.downloadZipLink);
  }

  // open locc modal for all proposal pages
  openLoccModal(){
    const modalRef = this.modalVar.open(LoccModalComponent, { windowClass: 'lg' });
    modalRef.result.then((result) => {
    });
  }
}
