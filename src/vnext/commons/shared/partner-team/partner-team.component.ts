import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ProjectStoreService, ISearchTeam, IContacts } from "vnext/project/project-store.service";
import { ProjectService } from "vnext/project/project.service";
import { ProjectRestService } from "vnext/project/project-rest.service";
import { MessageService } from "vnext/commons/message/message.service";
import { ConstantsService } from "vnext/commons/services/constants.service";
import { VnextService } from "vnext/vnext.service";
import { EaRestService } from 'ea/ea-rest.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaStoreService } from 'ea/ea-store.service';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';

@Component({
  selector: 'app-ng-partner-team',
  templateUrl: './partner-team.component.html',
  styleUrls: ['./partner-team.component.scss'],
  providers: [MessageService]
})
export class PartnerTeamComponent implements OnInit, OnDestroy {

  partnerArr = [];
  showExpandAll = false;
  selectAllEmailCheck = false;
  allWebexCheck = false;
  allWelcomeKitCheck = false;
  teamMemberFilter =  [this.constantsService.PARTNER_TEAM,this.constantsService.DISTI_TEAM];
  selectedTeam =  this.constantsService.PARTNER_TEAM;
  @Input() teamData: any;
  showTeamDropdown = false;
  searchTeam:ISearchTeam = {userId:'',webexNotification:true,notifyByWelcomeKit:true, beGeoId : 0};
  selectedPartner:any = {} 
  subscribers: any = {};
  @Input() enableManageTeamEdit = true;
  @Output() addRemove = new EventEmitter();
  isDistiSelected = false; // to set if disti selected
  multiplePartnerContactsMap: Map<string, IContacts[]> = new Map(); // to set multiple partner begeoname(key) and partners data (value)
  multipleDistiContactsMap: Map<string, IContacts[]> = new Map();  // to set multiple disti bename(key) and dsiti data (value)
  showSearchDrop = false;
  searchTeamByOptions = [];
  selectedSearchType: any = {} ;
  distiDetaiForCiscoDealPresent = false; // set if distidetail present in referrerQuotes for cisco deal flow
  isPartnerLoggedInSfdcDeal = false; // set if Partner Logged In to SfdcDeal
  allowWebexTeamSelection = true; // set to false if isPartnerLoggedInSfdcDeal or sfdc deal 
  constructor(public projectStoreService: ProjectStoreService, private projectService: ProjectService,private eaRestService: EaRestService, private projectRestService : ProjectRestService, private messageService: MessageService,public constantsService:ConstantsService,private vnextService: VnextService,public localizationService:LocalizationService, public eaStoreService: EaStoreService, public eaService: EaService, public dataIdConstantsService: DataIdConstantsService, public elementIdConstantsService: ElementIdConstantsService ) { }
  
  ngOnInit() {
    if(!this.projectStoreService.projectData.dealInfo?.partnerDeal && this.projectStoreService.projectData.referrerQuotes && this.projectStoreService.projectData.referrerQuotes.length){
      this.distiDetaiForCiscoDealPresent = true;
    }

    // check and set if Partner Logged In to SfdcDeal
    if(!this.projectStoreService.projectData.dealInfo?.partnerDeal && this.eaService.isPartnerUserLoggedIn()){
      this.isPartnerLoggedInSfdcDeal = true;
      this.searchTeam.webexNotification = false;
    }

    // check and set if sfdc deal
    if(!this.projectStoreService.projectData.dealInfo?.partnerDeal){
      this.allowWebexTeamSelection = false;
      this.searchTeam.webexNotification = false;
    }

    // in not sfdc deal set maps and check for header checkbox setting
    if (!this.isPartnerLoggedInSfdcDeal) {
      this.setMultiplePartnerContactMap();// check and set multiple partners
      this.setMultipleDistiContactMap();// check and set multiple disti
      // <!--Start Disti flow for sept release-->
      // <!--End Disti flow for sept release-->

      //for updating header checkbox in table
      this.manageSelectAllHeaderCheckbox();
    }
   //This method is used to update next option
   this.updateNextOption();
   this.getPartners();
   this.subscribers.updateProjectstatusSubject = this.projectService.updateProjectstatusSubject.subscribe((action: any) => {
    this.messageService.clear()
  });
  this.subscribers.manageTeams = this.projectService.manageTeams.subscribe((action: any) => {
    this.manageSelectAllHeaderCheckbox();
  });
  }

  // if cisco deal check and set for multiple partners from partnerContact in partnerTeam data
  setMultiplePartnerContactMap() {
    // this.eaService.isResellerOpty = false;
    if (!this.eaService.isDistiOpty && !this.eaService.isResellerOpty && !this.projectStoreService.projectData.dealInfo?.partnerDeal && this.projectStoreService.projectData.partnerTeam?.partnerContacts && this.projectStoreService.projectData.partnerTeam?.partnerContacts?.length) {
      this.multiplePartnerContactsMap.clear();
      for (let partner of this.projectStoreService.projectData.partnerTeam.partnerContacts) {
        if (!this.multiplePartnerContactsMap.has(partner.beGeoName)) {
          this.multiplePartnerContactsMap.set(partner.beGeoName, [partner]);
        } else {
          const partnerArr = this.multiplePartnerContactsMap.get(partner.beGeoName);
          partnerArr.push(partner);
          this.multiplePartnerContactsMap.set(partner.beGeoName, partnerArr);
        }
      }
    }
  }

  checkAndSetDistiNameFromDetail(){
    for(let data of this.projectStoreService.projectData.referrerQuotes){
      let distiData = data.distiDetail;
      for(let disti of this.projectStoreService.projectData.partnerTeam.distiContacts){
        if(distiData.beId === disti.beId){
          disti.beName = distiData.name;
        }
      }
    }
  }

  // if cisco deal check and set for multiple Disti from distiContact in partnerTeam data
  setMultipleDistiContactMap() {
    // check and set disti company name from referrerquotes to disticontacts list
    if(this.distiDetaiForCiscoDealPresent && this.projectStoreService.projectData.partnerTeam.distiContacts && this.projectStoreService.projectData.partnerTeam?.distiContacts?.length) {
      this.checkAndSetDistiNameFromDetail();
      this.multipleDistiContactsMap.clear();
      for (let disti of this.projectStoreService.projectData.partnerTeam.distiContacts) {
        if (!this.multipleDistiContactsMap.has(disti.beName)) {
          this.multipleDistiContactsMap.set(disti.beName, [disti]);
        } else {
          const distiArr = this.multipleDistiContactsMap.get(disti.beName);
          distiArr.push(disti);
          this.multipleDistiContactsMap.set(disti.beName, distiArr);
        }
      }
    }
  }

  ngOnDestroy() {
    if (this.subscribers.updateProjectstatusSubject) {
      this.subscribers.updateProjectstatusSubject.unsubscribe();
    }
    if (this.subscribers.manageTeams) {
      this.subscribers.manageTeams.unsubscribe();
    }
  }

  getPartners() { // This method is use to fetch Partners details.
    const url = this.vnextService.getAppDomainWithContext + 'project/' + this.projectStoreService.projectData.objId + '/partners';
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithoutData(response)) {
        if (response.data){
          this.partnerArr = response.data;
          // <!--Start Disti flow for sept release-->
          // set partner type and disti type
          if (this.partnerArr.length) {
            this.partnerArr.forEach(partner => {
              partner.type = this.constantsService.PARTNER_TEAM
            });
          }
          this.checkAndSetDistiInPartnersList();
        } else {
          this.partnerArr = [];
          if(this.isPartnerLoggedInSfdcDeal){
            this.selectedTeam = this.constantsService.DISTI_TEAM;
            this.checkAndSetDistiInPartnersList();
          }
        }
      }
    });
  }

  checkAndSetDistiInPartnersList() {
    if (this.distiDetaiForCiscoDealPresent) {
      for (let disti of this.projectStoreService.projectData.referrerQuotes) {
        if (disti.distiDetail.sourceProfileId > 1) {
          this.partnerArr.push(this.setDitiDataObj(disti.distiDetail));
        }
      }
      this.searchTeam.webexNotification = false;
      this.partnerArr = [...new Map(this.partnerArr.map(value => [value.beGeoName, value])).values()]
    } else if (this.eaService.isDistiOpty || this.eaService.isResellerOpty) {
      this.partnerArr.push(this.setDitiDataObj(this.projectStoreService.projectData.dealInfo?.distiDetail));
      this.searchTeam.webexNotification = false;
    }
    // check if partner logged in to sfdc deal, filter partner/ disti contacts based on userid
    if (this.isPartnerLoggedInSfdcDeal) {
      this.checkAndSetPartnerforSfdcLogin();
    }
    // <!--End Disti flow for sept release-->
    if (this.partnerArr.length) {
      this.selectedPartner = this.partnerArr[0];
      if (this.selectedPartner?.type === this.constantsService.PARTNER_TEAM) {
        this.searchTeamByOptions = [
          {
            "id": 1,
            "name": this.localizationService.getLocalizedString('common.CCO_ID')
          },
          {
            "id": 2,
            "name": this.localizationService.getLocalizedString('common.EMAIL')
          }
        ]
        this.selectedTeam = this.constantsService.PARTNER_TEAM;
      } else {
        this.searchTeamByOptions = [
          {
            "id": 1,
            "name": this.localizationService.getLocalizedString('common.CCO_ID')
          }
        ]
        this.selectedTeam = this.constantsService.DISTI_TEAM;
      }
      this.selectedSearchType = this.searchTeamByOptions[0];
    }
  }


  // check if partner logged in to sfdc deal, filter partner/ disti contacts based on userid
  checkAndSetPartnerforSfdcLogin() {
    this.searchTeam.webexNotification = false; // set webexteam selection to false
    const loggedInUserId = this.eaStoreService.userInfo.userId;  // 'mariar';
    let distiObj;
    let partnerObj;
    // find logged in partner details from partnercontact
    if (this.projectStoreService.projectData.partnerTeam?.partnerContacts) {
      partnerObj = this.projectStoreService.projectData.partnerTeam?.partnerContacts?.find(data => data.userId === loggedInUserId);
    } else if (!this.eaStoreService.userInfo?.distiUser && this.eaStoreService.userInfo?.beoGeoId){
      partnerObj= {beGeoId: this.eaStoreService.userInfo.beoGeoId};
    }
    // find logged in disti details fromd isticontact
    if (this.projectStoreService.projectData.partnerTeam?.distiContacts) {
      distiObj = this.projectStoreService.projectData.partnerTeam?.distiContacts?.find(data => data.userId === loggedInUserId);
    } else if (this.eaStoreService.userInfo?.distiUser && this.eaStoreService.userInfo?.beId){
      distiObj = {'beId': this.eaStoreService.userInfo.beId.toString()};
    }

    if (this.partnerArr.length) {
      // check and show only loggedin partner company contacts and details 
      if (this.eaStoreService.userInfo.distiUser && distiObj) {
        this.partnerArr = this.partnerArr.filter(partner => partner.beId === distiObj.beId);
        this.projectStoreService.projectData.partnerTeam.distiContacts = this.projectStoreService.projectData.partnerTeam.distiContacts?.filter(disti => disti.beId === distiObj.beId);
        this.projectStoreService.projectData.partnerTeam.partnerContacts = [];
      } else {
        if (partnerObj) {
          this.partnerArr = this.partnerArr.filter(partner => partner.beGeoId === partnerObj.beGeoId);
          this.projectStoreService.projectData.partnerTeam.partnerContacts = this.projectStoreService.projectData.partnerTeam.partnerContacts?.filter(partner => partner.beGeoId === partnerObj.beGeoId);
          this.projectStoreService.projectData.partnerTeam.distiContacts = [];
        }
      }
    }

    this.setMultiplePartnerContactMap();// check and set multiple partners
    this.setMultipleDistiContactMap();// check and set multiple disti

    //for updating header checkbox in table
    this.manageSelectAllHeaderCheckbox();
  }

  // set distidealObj to show in partner dropdown
  setDitiDataObj(distiDetail){
    let distiDetailobj = distiDetail;
    distiDetailobj['beGeoName'] = distiDetail.name;
    if(distiDetail.beId){
      distiDetailobj['beId'] = distiDetail.beId;
    }
    distiDetailobj['type'] = this.constantsService.DISTI_TEAM
    return distiDetailobj
  }


  // Reset search field
  resetSearchField() {

    this.searchTeam.userId = "";
    this.searchTeam.webexNotification =  true;
    this.searchTeam.notifyByWelcomeKit =  true;
    this.searchTeam.beGeoId = 0;
    // <!--Start Disti flow for sept release-->
    // set webex notification to false for partner selection if feature flag enabled
    if((this.selectedPartner.type === this.constantsService.PARTNER_TEAM && (this.eaService.isDistiOpty || this.eaService.isResellerOpty || this.distiDetaiForCiscoDealPresent)) || this.isPartnerLoggedInSfdcDeal || !this.allowWebexTeamSelection){
      this.searchTeam.webexNotification =  false;
    }
    // <!--End Disti flow for sept release-->
  }

  //for updating header checkbox in table
  manageSelectAllHeaderCheckbox () {

    this.allWebexCheck = false;
    if (this.projectService.isAllWebExSelected(this.projectStoreService.projectData.partnerTeam.partnerContacts) && this.projectService.isAllWebExSelected(this.projectStoreService.projectData.partnerTeam.distiContacts)) {

     if (!this.noData())  //incase of no data header check box false
      this.allWebexCheck =  true;
    }

     this.allWelcomeKitCheck = false;
    if (this.projectService.isAllWlecomeKitSelected(this.projectStoreService.projectData.partnerTeam.partnerContacts) && this.projectService.isAllWlecomeKitSelected(this.projectStoreService.projectData.partnerTeam.distiContacts)) {

      if (!this.noData()) { //incase of no data header check box false
       this.allWelcomeKitCheck =  true;
      }
    }
  }

  // This method handle no partner team data scenario
  noData() {

    if (!this.projectStoreService.projectData.partnerTeam.partnerContacts && !this.projectStoreService.projectData.partnerTeam.distiContacts) {
          return true;
    }
    return  false;
  }

  //This method is used to update next option
  updateNextOption() {

    //for updating next best options if either partner or disti added
    if(this.projectStoreService.projectData.dealInfo.partnerDeal && (this.projectStoreService.projectData?.partnerTeam?.partnerContacts || this.projectStoreService.projectData?.partnerTeam?.distiContacts)) {
      this.projectService.updateNextBestOptionsSubject.next({key: 'isPartnerAdded', value: true})
    }
  }


  expandAll() {
    this.showExpandAll = false;
  }

  collapseAll() {
    this.showExpandAll = true;
  }

  // This method is used to update all team member header checkbox
  selectAllCheckbox(notificationType,selection) {

    const requestPartnerObj =  this.projectService.updateAllTeamMember(this.projectStoreService.projectData.partnerTeam.partnerContacts,!this[selection],notificationType);
    if(requestPartnerObj) {
          this.updateAll(this.constantsService.PARTNER_TYPE,this.constantsService.PARTNER_CONTACT,requestPartnerObj);
    }
    const requestDistiObj =    this.projectService.updateAllTeamMember(this.projectStoreService.projectData.partnerTeam.distiContacts,!this[selection],notificationType);
    if(requestDistiObj) {
          this.updateAll(this.constantsService.DISTI_TYPE,this.constantsService.DISTI_CONTACT,requestDistiObj);
    }
    this[selection] = !this[selection];

  }

  // This method is used to update all team member header checkbox
  updateAll(type,team,requestObj) {

    this.projectRestService.updateTeamMember(requestObj,type).subscribe((response: any) => {
      this.messageService.clear();
      if (this.vnextService.isValidResponseWithoutData(response, true)) {
        this.projectStoreService.projectData.partnerTeam[team] = [...requestObj.data]; //update store value in case of success
        this.setMultiplePartnerContactMap(); // check and set multiple partners
        this.setMultipleDistiContactMap();// check and set multiple disti
        this.checkIsAddedRemove();
        //for updating header checkbox in table
        this.manageSelectAllHeaderCheckbox();
      } else {
        this.messageService.displayMessagesFromResponse(response);        
      }
    });
  }

  // This method is used to update team member 
  updateTeamCheckbox(teamObj) {

    const requestObj = {data :[{"userId":teamObj.updatedTeam.userId,[teamObj.notificationType]: teamObj.updatedTeam[teamObj.notificationType]}]}
    this.projectRestService.updateTeamMember(requestObj,teamObj.type).subscribe((response: any) => {
      this.messageService.clear();
      if (this.vnextService.isValidResponseWithoutData(response, true)) {
        this.checkIsAddedRemove();
          //for updating header checkbox in table
          this.manageSelectAllHeaderCheckbox();

      } else {
        this.messageService.displayMessagesFromResponse(response);        
      }
    });
  }

  // This method is used to add team member 
  addTeamMember() {
    let requestObj = {};
    this.searchTeam.beGeoId = this.selectedPartner.beGeoId;
    requestObj = {data:[this.searchTeam]};
    // <!--Start Disti flow for sept release-->
    // set reuestobj for disti and partner
    if (this.selectedPartner.type === this.constantsService.PARTNER_TEAM){
      this.searchTeam.beGeoId = this.selectedPartner.beGeoId;
      if (this.selectedSearchType.name === this.constantsService.EMAIL) {
      const searchByEmail = {
          email:this.searchTeam.userId,
          webexNotification:this.searchTeam.webexNotification,
          notifyByWelcomeKit:this.searchTeam.notifyByWelcomeKit,
          beGeoId : this.searchTeam.beGeoId
        }
        requestObj = {data:[searchByEmail]}
      } else {
        requestObj = {data:[this.searchTeam]}
      }
    } else {
      let distiSearchTeam = {}
      distiSearchTeam = {
        userId:this.searchTeam.userId,
        webexNotification:this.searchTeam.webexNotification,
        notifyByWelcomeKit:this.searchTeam.notifyByWelcomeKit
      };
      if(!this.projectStoreService.projectData.dealInfo.partnerDeal){
        distiSearchTeam['beId'] = this.selectedPartner.beId;
      }
      requestObj = {data:[distiSearchTeam]}
    }
    // <!--End Disti flow for sept release-->

   let teamType = '';
   let contact = '';

   if (this.selectedTeam === this.teamMemberFilter[0]) {
       teamType = this.constantsService.PARTNER_TYPE;
       contact =  this.constantsService.PARTNER_CONTACT;
   }else {
       teamType = this.constantsService.DISTI_TYPE;
       contact =  this.constantsService.DISTI_CONTACT;
   }


   // check if no team data 
    let noTeamData  =  false
    if (this.noData()) {
        noTeamData =  true;
    }

    this.projectRestService.addTeamMember(requestObj,teamType).subscribe((response: any) => {
      this.messageService.clear();
      if (this.vnextService.isValidResponseWithData(response, true)) {

        if(this.projectStoreService.projectData.partnerTeam[contact]){
            this.projectStoreService.projectData.partnerTeam[contact].push(response.data[0]);
        }else {
            this.projectStoreService.projectData.partnerTeam[contact] = response.data;
        }
        if (teamType === this.constantsService.PARTNER_TYPE) {
          this.setMultiplePartnerContactMap(); // check and set multiple partners
        } else {
          this.setMultipleDistiContactMap();// check and set multiple disti
        }
        this.checkIsAddedRemove();
        // update next options if either partner or disti is added
        if (noTeamData) {
            this.updateNextOption();
        }
        // Reset search field
        this.resetSearchField();

         //for updating header checkbox in table
         this.manageSelectAllHeaderCheckbox();
      } else {
        // to show error messages if any
        this.resetSearchField();
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

  // This method is used to delete team member 
  deleteTeamMember(teamObj) {

   let contact = '';
   if (teamObj.type === this.constantsService.PARTNER_TYPE) {
       contact =  this.constantsService.PARTNER_CONTACT;
   }else {
       contact =  this.constantsService.DISTI_CONTACT;
   }

    this.projectRestService.deleteTeamMember(teamObj.teamData,teamObj.type).subscribe((response: any) => {
      this.messageService.clear();
      if (this.vnextService.isValidResponseWithoutData(response, true)) {

        this.projectStoreService.projectData.partnerTeam[contact] = this.projectStoreService.projectData.partnerTeam[contact].filter(team => team.userId !== teamObj.userID);
        if (teamObj.type === this.constantsService.PARTNER_TYPE) {
          this.setMultiplePartnerContactMap(); // check and set multiple partners
        } else {
          this.setMultipleDistiContactMap();// check and set multiple disti 
        }
        this.checkIsAddedRemove();
      } else {
        this.messageService.displayMessagesFromResponse(response);        
      }
    });
  }

  selectTeam(team){
    this.selectedPartner = team;
    // <!--Start Disti flow for sept release-->
    // check and set selectedpartner type and searchTeam 
    if(this.selectedPartner.type === this.constantsService.DISTI_TEAM) {
      this.isDistiSelected = true;
      if(this.allowWebexTeamSelection){
        this.searchTeam.webexNotification = true;
      } else {
        this.searchTeam.webexNotification = false;
      }
      this.selectedTeam = this.constantsService.DISTI_TEAM;
    } else if ((this.eaService.isDistiOpty || this.eaService.isResellerOpty || this.distiDetaiForCiscoDealPresent)) {
      this.isDistiSelected = false;
      this.searchTeam.webexNotification = false;
      this.selectedTeam = this.constantsService.PARTNER_TEAM;
      this.searchTeam.beGeoId = this.selectedPartner.beGeoId
    }
      if(this.selectedPartner.type === this.constantsService.PARTNER_TEAM) {
        this.searchTeamByOptions = [
          {
            "id": 1,
            "name": this.localizationService.getLocalizedString('common.CCO_ID')
          },
          {
            "id": 2,
            "name": this.localizationService.getLocalizedString('common.EMAIL')
          }             
        ]
      } else {
        this.searchTeamByOptions = [
          {
            "id": 1,
            "name":  this.localizationService.getLocalizedString('common.CCO_ID')
          }
        ]
      }
      this.selectedSearchType = this.searchTeamByOptions[0];
    // <!--End Disti flow for sept release-->
    this.showTeamDropdown = false;
  }

  checkIsAddedRemove() {
    if(!this.enableManageTeamEdit) {
      this.addRemove.emit(true);
    }
  }

  selectType(type) {
    this.selectedSearchType = type;
    this.showSearchDrop = false;
    this.resetSearchField();
  }

}


export interface partnerObject {

    header: string;
    team: string;
    memeberType: string;
    searchType: string;
}