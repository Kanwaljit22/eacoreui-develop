import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EaRestService } from 'ea/ea-rest.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { IDealInfoDetails } from './create-link-project-store.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { EaService } from 'ea/ea.service';
@Component({
  selector: 'app-create-linked-project',
  templateUrl: './create-linked-project.component.html',
  styleUrls: ['./create-linked-project.component.scss']
})
export class CreateLinkedProjectComponent implements OnInit {

  constructor(private router: Router,private activatedRoute: ActivatedRoute,private eaService: EaService,private eaRestService: EaRestService,
    public localizationService:LocalizationService, public dataIdConstantsService: DataIdConstantsService,
    private constantsService: ConstantsService, ) { }

  dealId:string;
  sid:string;
  dealSubDetails:IDealInfoDetails ={};
  errorMessage:string;
  projectName  = "";
  subscriptionInfo: any ={}
  displayPage = false;

  ngOnInit(): void {
    this.getParamDetails();
    this.getChangeSubscriptionDetails();
  }


  getParamDetails() {
    this.dealId = this.activatedRoute.snapshot.queryParamMap.get('did'); // set dealID
    this.sid = this.activatedRoute.snapshot.queryParamMap.get('sid');
  }


  getChangeSubscriptionDetails(){
  //  this.dealSubDetails = this.data.dealInfo;
  //   this.subscriptionInfo = this.data.subscriptionInfo
  let url = '/external/landing/sub-ui?sid='+this.sid+'&did='+this.dealId;
  this.eaRestService.getApiCall(url).subscribe((response: any) => {

    if (response && response.data && !response.error) {
      if (response.data.ea3Entity){
        if(response.data.proposalId){
          this.routeToPage('ea/project/proposal/' + response.data.proposalId);
          return;
        }
        if(response.data.projectId){
          if((this.eaService.features.CROSS_SUITE_MIGRATION_REL && response.data.redirectToCreateProposal)){
            sessionStorage.setItem('projectId', response.data.projectId);
            this.routeToPage('ea/project/renewal');
          } else {
            this.routeToPage('ea/project/' + response.data.projectId);
            return;
          }
        }
          this.dealSubDetails = response.data.dealInfo;
          this.projectName = this.dealSubDetails.dealName; // Need to add date
          this.subscriptionInfo = response.data.subscriptionInfo
          this.displayPage = true;
      } else {
        this.prepareRedirectUrl(); //Need to redirect to 2.0.
      }
    }  else if (!response.error) {
      this.prepareRedirectUrl(); //Need to redirect to 2.0.
    } else if(response.error && response.messages){
      this.errorMessage = response.messages[0].text;
      this.displayPage = true;
    }
 });

}


routeToPage(pageUrl) {
  const index = window.location.href.lastIndexOf('/');
  const url = window.location.href.substring(0, index + 1);
  this.router.navigateByUrl(pageUrl, {replaceUrl : true});
  }

  createProject(){
    this.routeToPage('ea/project/create?did=' + this.dealId + '&projectName=' + this.projectName);
  }


  prepareRedirectUrl(){
    const url = this.prepareUrl()
    this.routeToPage('qualifications/external/landing/sub-ui?' + url);
  }
  prepareUrl(){
    let url = '';
    if(this.dealId){
      url = url + 'did=' + this.dealId + '&'
    }
    if(this.sid){
      url = url + 'sid=' + this.sid + '&'
    }
    if(url.slice(-1) === '&'){
      url = url.substring(0, url.length - 1);
    }
    return url;
  }
}
