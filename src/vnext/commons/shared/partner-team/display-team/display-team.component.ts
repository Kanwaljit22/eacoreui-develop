import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ProjectStoreService } from "vnext/project/project-store.service";
import { ConstantsService } from "vnext/commons/services/constants.service";
import { ProjectService } from 'vnext/project/project.service';
import { EaStoreService } from 'ea/ea-store.service';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';

@Component({
  selector: 'app-display-team',
  templateUrl: './display-team.component.html',
  styleUrls: ['./display-team.component.scss']
})
export class DisplayTeamComponent implements OnInit {


  showExpandAll = true;
  //isPartnerExpand = false;
  //isDistiExpand = false;
  @Input() isExpand = false;
  @Input() teamMembers =  [];
  @Input() header: '';
  @Input() teamType: '';
  @Input() partnerCompany: ''; // set to show partner company beside partner/disti
  @Input() distiDetaiForCiscoDealPresent = false; // set if distidetail present in referrerQuotes for cisco deal flow
  @Input() disableWebexTeams = false; // set if partner(1T/2T/Disti) logged in to sfdc deals 
  
  @Output() checkboxSelection = new EventEmitter<object>();
  @Output() deleteTeam = new EventEmitter<object>();


  constructor(public projectStoreService: ProjectStoreService,public constantsService:ConstantsService, public projectService: ProjectService, public eaStoreService: EaStoreService, public eaService: EaService, public dataIdConstantsService: DataIdConstantsService) { }

  ngOnInit() {
  }


  expand() {
    this.isExpand = !this.isExpand;
  }


  expandAll() {

    this.showExpandAll = false;
    this.isExpand = true;
    //  this.partnerArr.forEach((row) =>  row.expand = true);
  }

  selectTeamCheckbox(team,notification) {

    this.checkboxSelection.emit({updatedTeam:team,type:this.teamType,notificationType:notification});
  }

  deleteTeamMember(team) {

    this.deleteTeam.emit({userID:team.userId,type:this.teamType, teamData: team})
  }

}
