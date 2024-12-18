import { SubsidiariesStoreService } from './../subsidiaries/subsidiaries.store.service';
import { VnextService, PaginationObject } from 'vnext/vnext.service';

import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ProjectService } from '../project.service';
import { MessageService } from 'vnext/commons/message/message.service';
import { ProjectStoreService } from "vnext/project/project-store.service";
import { EaRestService } from 'ea/ea-rest.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaService } from 'ea/ea.service';

@Component({
  selector: 'app-view-sites',
  templateUrl: './view-sites.component.html',
  styleUrls: ['./view-sites.component.scss'],
  providers: [MessageService]
})
export class ViewSitesComponent implements OnInit, OnDestroy {

  siteDetailsArray:any;
  paginationObject: PaginationObject;

  reqObject = {
     "data": {
       "page": {
         "pageSize": 50,
         "currentPage": 1
       }
     }
   };

  constructor(public projectService: ProjectService,public subsidiariesStoreService:SubsidiariesStoreService, public renderer: Renderer2, private eaService: EaService,
    private vnextService:VnextService, private messageService: MessageService,public projectStoreService:ProjectStoreService,private eaRestService: EaRestService, public localizationService:LocalizationService) { }

  ngOnInit() {
    this.getSiteDetails();
    this.renderer.addClass(document.body, 'position-fixed');
  }



  private getSiteDetails() { 

   const url = 'project/'+this.projectStoreService.projectData.objId+'/cav/' + this.subsidiariesStoreService.subsidiariesData[0].cavId + '/bu/' +  this.subsidiariesStoreService.buId+'/parties';
      this.eaRestService.postApiCall(url,this.reqObject).subscribe((response: any) => {
        this.messageService.clear();
        if (this.vnextService.isValidResponseWithData(response)) {
        this.siteDetailsArray = response.data.partyDetails;
        // response.data.page.currentPage++;
        this.paginationObject = response.data.page;
        this.projectService.setSiteSelction(this.subsidiariesStoreService.bu, this.siteDetailsArray, response.data)
      } else {
        this.messageService.displayMessagesFromResponse(response)
      }
    });
  }


  closeAllSites() {
    this.projectService.showSitesAssociated = false;
  }

  public getCompleteAddress(partyObject){
      return this.projectService.getCompleteAddressforParty(partyObject);
  }

  paginationUpdated(event){
     this.reqObject = {
      "data": {
        "page": {
          "pageSize": event.pageSize,
          "currentPage": event.currentPage
        }
      }
    };
    this.getSiteDetails();
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'position-fixed')
  }
}
