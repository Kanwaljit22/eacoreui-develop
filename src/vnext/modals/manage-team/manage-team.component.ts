import { Component, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IPartnerObject, ProjectStoreService } from 'vnext/project/project-store.service';
import { VnextService } from "vnext/vnext.service";
import { MessageService } from "vnext/commons/message/message.service";
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaRestService } from 'ea/ea-rest.service';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';

@Component({
  selector: 'app-manage-team',
  templateUrl: './manage-team.component.html',
  styleUrls: ['./manage-team.component.scss']
})
export class ManageTeamComponent implements OnInit {
  partnerObject : IPartnerObject  = { header: this.localizationService.getLocalizedString('common.PARTNER_TEAM_MEMBERS'), team:'partnerTeam',
  memeberType: 'Team',searchType :'Add Partner Team'};

  showTeam =  false;
  addRemove = false;
  constructor(public ngbActiveModal: NgbActiveModal,private eaRestService: EaRestService,private projectStoreService : ProjectStoreService, private messageService: MessageService, private vnextService: VnextService, public localizationService:LocalizationService, private eaService: EaService, public dataIdConstantsService: DataIdConstantsService) { }
  
  ngOnInit() {
    this.eaService.getLocalizedString('manage-team');
    // Setting lock flag as false to make manage team editable
    this.projectStoreService.lockProject =  false;
    this.showTeam =  false;
    this.getTeamData();   // Get cisco and partner team data 
  }

  close() {

    this.ngbActiveModal.close({
      continue: true,
      addRemove: this.addRemove
    });
 }

  ngOnDestroy(){

    // Setting back lock flag to original value after manage team close 
    this.projectStoreService.lockProject =  true;
  }

  // Get cisco and partner team data 
  getTeamData() {

    const url  =  'project/' + this.projectStoreService.projectData.objId
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response, true)) {
        this.projectStoreService.projectData = response.data;
        this.showTeam =  true;
      } else {
        // to show error messages if any
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

  isAddRemove(event) {
    if (event) {
      this.addRemove = true;
    }
  }
}
