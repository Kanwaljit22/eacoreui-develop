import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EaRestService } from 'ea/ea-rest.service';
import { EaStoreService } from 'ea/ea-store.service';
import { EaService } from "ea/ea.service";
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { LocalizationEnum } from 'ea/commons/enums/localizationEnum';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';

@Component({
  selector: 'app-smart-account',
  templateUrl: './smart-account.component.html',
  styleUrls: ['./smart-account.component.scss']
})
export class SmartAccountComponent implements OnInit {
  showSmartAccounts = false;
  smartAccountsData = []; // store smartAccountsData from api
  selectedSmartAccount: any = {}; // set selected smartAccount details
  dealId = ''; // set dealId from url
  quoteId = ''; // set quoteId from url
  sid= ''; // set sid
  proposalId = ''//proposal id
  displayPopup = false;
  isOnlyDealPresent = false;
  disableEA3 = false;
  showEa2 = false; // set false if selected 3.0
  errorMessage = ''; // set generic error message
  pilotPartnerCheckFailed = false; // set to hide EA 3.0 figure 
  apiCalled = false;
  disableEa2 = false;
  disableSpna = false;
  //disableSpnaBp = false;
  //disableEa3Bp = false;
  buyingProgram = '';
  showEa3 = true;
  cavSupportUrl = 'https://cisco.service-now.com/sp?id=sc_cat_item&sys_id=a9860b89dbd9a640cb5772fc0f96191d&u_business_service=ca12e139dbb5ba4066db5678dc961932';
  qualificationId = '';
  spnaProjectId = '';
  ea3ProjectId = '';
  wsAppId = ''
  partnerDeal = false;
  globalDealScope = false
  constructor(public router: Router, private activatedRoute: ActivatedRoute, private eaRestService: EaRestService, public eaStoreService: EaStoreService, public eaService :EaService,
    public localizationService: LocalizationService, public dataIdConstantsService: DataIdConstantsService ) { }
  ngOnInit() {
    this.getParamDetails();
    this.eaService.localizationMapUpdated.subscribe((key: any) => {
      if (key === LocalizationEnum.common || key === LocalizationEnum.all){
        this.errorMessage = this.localizationService.getLocalizedString('common.ERROR_MSG') ; 
      }
    });
  }
  //to set smart account details
  setSmartAccount(smartAccount) {
    this.selectedSmartAccount = smartAccount;
    this.showSmartAccounts = false;
  }

  // method to load url
  routeToPage(pageUrl) {
    const index = window.location.href.lastIndexOf('/');
    const url = window.location.href.substring(0, index + 1);
    this.router.navigateByUrl(pageUrl, {replaceUrl : true});
    }

 

  // to get smart account details 
  getSmartAccountData() {
    this.errorMessage = '';
   const params = this.prepareUrl(true);
    const url ='external/landing?' + params;
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      this.apiCalled = true;
      if (response && !response.error) {
        if(response.data.smartAccounts){
          this.smartAccountsData = response.data.smartAccounts;
        }
        if(response.data.disableEa2){
          this.disableEa2 = response.data.disableEa2;
        }
        // if(response.data.disableEa3){
        //   this.disableEa3Bp = response.data.disableEa3;
        // }
        // if(response.data.disableSpna){
        //   this.disableSpnaBp = response.data.disableSpna;
        // }
        if(response.data.partnerDeal){
          this.partnerDeal = response.data.partnerDeal;
        }
        if (response.data.hasEa2Entity ){
          if(response.data.proposalId){
            this.router.navigate(['qualifications/proposal/' + response.data.proposalId]);
          } else if(response.data.qualificationId){
            if (this.eaService.features.SPNA_REL && !this.wsAppId) {
              this.qualificationId = response.data.qualificationId
            } else {
              this.router.navigate(['qualifications/' + response.data.qualificationId]);
            }
            
          }
          this.disableEA3 = true;
          this.disableSpna = true;
          this.showEa2 = true;
          this.showEa3 = false
        } else {
          // to set deal, quoe and sid details
          this.eaStoreService.landingDid = this.dealId;
          this.eaStoreService.landingQid = this.quoteId;
          this.eaStoreService.landingSid = this.sid;
          this.globalDealScope = response.data.globalDealScope;
          if(response.data.proposalId){
            this.routeToPage('ea/project/proposal/' + response.data.proposalId);
          } else if((response.data.projects && response.data.projects.length && this.eaService.features.SPNA_REL && !this.wsAppId)){ // remove || condition 
            response.data.projects.forEach(project => {
              if(project.buyingProgram === 'BUYING_PGRM_3'){//3.0 project
                this.ea3ProjectId = project.projectId
                this.showEa3 = true
              } else if(project.buyingProgram === 'BUYING_PGRM_SPNA'){//SPNA project
                this.spnaProjectId = project.projectId
                this.showEa3 = true
              }
             });
             //this.ea3ProjectId = response.data.projectId // remove this code 
            // this.showEa3 = true// remove this code 
             this.showEa2 = false;
          } else if(response.data.projectId && !this.eaService.features.SPNA_REL && !this.wsAppId){
            this.routeToPage('ea/project/' + response.data.projectId);
          }  else if(this.wsAppId && response.data.projects?.length){
            this.routeToPage('ea/project/' + response.data.projects[0].projectId);
          }
        }
       
        this.pilotPartnerCheckFailed = response.data.pilotPartnerCheckFailed;
       // if (this.sid && atob(this.sid) !== '1' ) { // if sid present load partner landing page
         // this.disableEA3 = true;
        //}
        setTimeout(() => {
          this.displayPopup = true;
        }, 350);
        
      } else if(response.error && response.messages){
        this.errorMessage = response.messages[0].text;
      } else {
        this.errorMessage = this.localizationService.getLocalizedString('common.ERROR_MSG') ; 
      }
    });
  }

  // method to get dealId, qid, sid and proposalId from url
  getParamDetails() {
    this.dealId = this.activatedRoute.snapshot.queryParamMap.get('did'); // set dealID
    this.quoteId = this.activatedRoute.snapshot.queryParamMap.get('qid'); //set quoteId
    //const sid = this.activatedRoute.snapshot.queryParamMap.get('sid'); // set sid 
    this.sid = this.activatedRoute.snapshot.queryParamMap.get('sid');;
    this.proposalId = this.activatedRoute.snapshot.queryParamMap.get('pid'); // set proposalId
    this.wsAppId = this.activatedRoute.snapshot.queryParamMap.get('appid'); // set workspase app id;
    // if (this.eaService.features.SPNA_REL) {// not required acc. to new requiremnt only proposal id can come in punchin url
    //    this.buyingProgram  = this.activatedRoute.snapshot.queryParamMap.get('buyingProgram'); //set buyingProgram
    // }
    this.getSmartAccountData();
  }

  redirectToExternalLanding(){
    const url = this.prepareUrl()
    this.routeToPage('qualifications/external/landing?' + url);
  }

  prepareUrl(checkForProposalId?){
    let url = '';
    if(this.dealId){
      url = url + 'did=' + this.dealId + '&'
      this.isOnlyDealPresent = true;
    }
    if(this.quoteId){
      url = url + 'qid=' + this.quoteId + '&'
      this.isOnlyDealPresent = false;
    } 
    if(this.sid){
      url = url + 'sid=' + this.sid + '&'
      this.isOnlyDealPresent = false;
    }

    if(checkForProposalId && this.proposalId){
      url = url + 'pid=' + this.proposalId
      this.isOnlyDealPresent = false;
    }
    if(url.slice(-1) === '&'){
      url = url.substring(0, url.length - 1);
    }

    return url;
  }

  // continue to ea 2.0 
  goToEamp() {
    if (this.showEa2){
      if(this.isOnlyDealPresent){
        sessionStorage.setItem(
          'sfdcPunchInDeal',
          this.dealId);
        this.router.navigateByUrl('prospects', {replaceUrl : true});
      } else {
        const landingUrl = this.prepareUrl(true);
        this.router.navigateByUrl('qualifications/external/landing?' + landingUrl, {replaceUrl : true});
      }
    } else {
      this.goToVnext();
    }
  }

  // continue to ea 3.0 based with selected smartaccount
  goToVnext(){
    const requestObject = {
      "data": {
        "dealIdEnc": this.dealId
      }
    }
    if(this.selectedSmartAccount){
      requestObject.data['smartAccountInfo'] = this.selectedSmartAccount;
    }
    if (this.quoteId){
      requestObject.data['qidEnc'] = this.quoteId;
    }
    if (this.sid){
      requestObject.data['sidEnc'] = this.sid;
    }

    if (this.eaService.features.SPNA_REL) {
      // if(this.buyingProgram){//check with digvijay
      //   requestObject.data['buyingProgram'] = this.buyingProgram;
      // } else{
        requestObject.data['buyingProgram'] = this.showEa3 ? "BUYING_PGRM_3" : "BUYING_PGRM_SPNA";
     // }
    }
    this.eaStoreService.smartaccountReqObj = requestObject;
    this.routeToPage('ea/project/create?did=' + this.dealId);
  }

  // to select EA 2.0 / 3.0
  selectView(val, buyingProgram?){
    if (!this.disableEA3 && !this.disableSpna){
      this.showEa2 = val;
    }
    if(buyingProgram){
      this.showEa3 = (buyingProgram === 'BUYING_PGRM_3') ? true : false;
    } else {
      this.showEa3 = false;
    }
  }

  // Request New smart account 
  requestNewSmartAccount() {
    this.eaService.redirectToNewSmartAccount();
  }

  openCavSupport() {
    const url = this.cavSupportUrl;
    window.open(url)
  }

  loadQual(){//when user click on go to qual button.
    this.router.navigate(['qualifications/' + this.qualificationId]);
  }

  loadProject(projectId){//when user click on go to project button.
    this.routeToPage('ea/project/' + projectId);
  }

 
}
