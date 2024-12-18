import { Component, OnInit, OnDestroy } from '@angular/core';
import { RoadMapGrid, IRoadMap } from '@app/shared';
import { SelectSubscriptionComponent } from './select-subscription/select-subscription.component';
import { RenewalParameterComponent } from './renewal-parameter/renewal-parameter.component';
import { ReviewRenewalComponent } from './review-renewal/review-renewal.component';
import { AppDataService, SessionData } from '@app/shared/services/app.data.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { SubHeaderComponent } from '@app/shared/sub-header/sub-header.component';
import { BehaviorSubject } from 'rxjs';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { RenewalSubscriptionService } from './renewal-subscription.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-renewal-subscription',
  templateUrl: './renewal-subscription.component.html',
  styleUrls: ['./renewal-subscription.component.scss']
})
export class RenewalSubscriptionComponent implements OnInit, OnDestroy {
  roadMaps: Array<IRoadMap>;
  roadMapGrid: RoadMapGrid;
  componentNumToLoad: number;
  private messageSource = new BehaviorSubject(false);
  qualId: any;

  constructor(public appDataService: AppDataService, public qualService: QualificationsService, 
    public utilitiesService: UtilitiesService, private renewalSubService: RenewalSubscriptionService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.appDataService.subHeaderData.moduleName = 'RENEWAL_SUBSCRIPTION'; // set for renewal subscription module name
    this.componentNumToLoad = 0;
    this.appDataService.isProposalIconEditable = false; // set to show edit icon
    this.route.paramMap.subscribe(params => {
      if (params.keys.length > 0) {
        this.qualId = parseInt(params.get('qualId'));
      }
    });
    const sessionObject: SessionData = this.appDataService.getSessionObject();
    this.appDataService.enableQualFlag = false;
    this.appDataService.showEngageCPS = false;
    // console.log(sessionObject);


    // check for sessionobj and qualID from session with that of qual id from URl and route user to qual summary page if not matched
    if(!sessionObject || sessionObject.qualificationData.qualID !== this.qualId){
      this.qualService.qualification.qualID = this.qualId;
      this.qualService.isLoadSubheader = false; // set to false to hide subheader till data is set 
      this.router.navigate(['qualifications/' + this.qualId]);
      return;
    }

    // set customer and subscription details from session data
    if(sessionObject){
      this.appDataService.archName = sessionObject.custInfo.archName;
      this.appDataService.customerName = sessionObject.custInfo.custName;
      if(!this.appDataService.customerID  || (this.appDataService.customerID && this.appDataService.customerID < 0)){
        this.appDataService.customerID = sessionObject.customerId;
      }
      if(sessionObject.qualificationData){
        this.qualService.qualification = sessionObject.qualificationData;
        if(this.qualService.qualification.subscription && this.qualService.qualification.subscription['subRefId']){
          this.qualService.subRefID = this.qualService.qualification.subscription['subRefId']
        }
      }
    }

    this.roadMaps = [
      {
        name: 'Select Subscription',
        component: SelectSubscriptionComponent,
        eventWithHandlers: {
          continue: () => {
            this.roadMapGrid.loadComponent(1);
          },
          back: () => {
          }
        }
      }, 
      {
        name: 'Follow-on Parameters',
        component: RenewalParameterComponent,
        eventWithHandlers: {
          continue: () => {
            this.roadMapGrid.loadComponent(2);
          },
          back: () => {
            this.roadMapGrid.loadComponent(0);
          }
        }
      }, 
      {
        name: 'Review & Confirm',
        component: ReviewRenewalComponent,
        eventWithHandlers: {
          continue: () => {
          },
          back: () => {
            this.roadMapGrid.loadComponent(1);
          }
        }
      }
    ];
    // added this initially, will be removed later
    this.utilitiesService.currentMessage = this.messageSource.asObservable(); // set to load first comp  in renewals after this is reset
    this.roadMapGrid = new RoadMapGrid(this.roadMaps);
    this.qualService.prepareSubHeaderObject(SubHeaderComponent.EDIT_QUALIFICATION, true); // set header for renewals frm qual
  }

  ngOnDestroy() {
    const sessionObject: SessionData = this.appDataService.getSessionObject();
    sessionObject.renewalId = '';
    this.appDataService.setSessionObject(sessionObject);
    this.renewalSubService.resetRenewalData();
  }

}
