import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ProjectService } from '../project.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { ProjectStoreService } from '../project-store.service';
import { SubsidiariesStoreService } from '../subsidiaries/subsidiaries.store.service';
import { EaRestService } from 'ea/ea-rest.service';
import { VnextService } from 'vnext/vnext.service';
import { MessageService } from 'vnext/commons/message/message.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { EaService } from 'ea/ea.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';

@Component({
  selector: 'app-bp-id-details',
  templateUrl: './bp-id-details.component.html',
  styleUrls: ['./bp-id-details.component.scss']
})
export class BpIdDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('downloadZipLink', { static: false }) private downloadZipLink: ElementRef;
  showPortFolios = true;
  cavDetails:any;
  showDownload = false;
  subscriptionData = [];
  isSubscExpiring = false;

  constructor(public projectService: ProjectService, public dataIdConstantsService: DataIdConstantsService, public localizationService: LocalizationService, private renderer: Renderer2, public projectStoreService: ProjectStoreService, public subsidiariesStoreService: SubsidiariesStoreService, private eaRestService: EaRestService, private vNextService: VnextService, private messageService: MessageService, private utilitiesService: UtilitiesService, public eaService: EaService, private constantsService: ConstantsService) {

  }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'position-fixed');
    if (this.eaService.features?.RENEWAL_SEPT_REL) {
      this.getSubscriptions();
    }
    // this.cavDetails = this.subsidiariesStoreService.subsidiariesData[0];
    this.getCavDetails()
  }

  getSubscriptions() {
    const url = this.constantsService.URL_EAID_SUBSCRIPTION_PROJECT + this.projectStoreService.projectData.objId + this.constantsService.URL_WITH_EAID + this.projectStoreService.currentBpId?.eaIdSystem;
    this.eaRestService.getApiCall(url).subscribe((res: any) => {
      this.messageService.modalMessageClear();
      if(this.vNextService.isValidResponseWithoutData(res)){
        if (res.data) {
          this.subscriptionData = res.data;
          this.subscriptionData.forEach((subs)=> {
            if(subs.type === 'ON_TIME_FOLLOWON' && subs.statusDesc !== 'Overdue') { 
              this.isSubscExpiring = true;
            }
          })
        }
      }else {
        this.messageService.displayMessagesFromResponse(res);
      }
    })
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'position-fixed')
  }

  close() {
    this.projectService.showBpIdDetails = false;
    this.projectStoreService.currentBpId = undefined;
    }


    getCavDetails(){
      const url = 'project/' + this.projectStoreService.projectData.objId + '/cav?eaid=' + this.projectStoreService.currentBpId?.eaIdSystem;
      this.eaRestService.getApiCall(url).subscribe((res: any) => {
        this.messageService.modalMessageClear();
        if(this.vNextService.isValidResponseWithData(res)){
          this.cavDetails = res.data;
        }else {
          this.messageService.disaplyModalMsg = true;
          this.messageService.displayMessagesFromResponse(res);
        }
      })
    }

    downloadExcel() {
      const url ='project/'+ this.projectStoreService.projectData.objId + '/parties/download?eaid=' + this.projectStoreService.currentBpId?.eaIdSystem;
      this.eaRestService.downloadDocApiCall(url).subscribe((response: any) => {
        if (this.vNextService.isValidResponseWithoutData(response, true)) { 
          this.utilitiesService.saveFile(response, this.downloadZipLink);
        }
      });
    }
}
