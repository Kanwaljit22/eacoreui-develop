
import { Component, OnInit,Input,Output,EventEmitter, OnDestroy, Renderer2, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { PriceEstimateStoreService } from "vnext/proposal/edit-proposal/price-estimation/price-estimate-store.service";
import { IEnrollmentsInfo, ProposalStoreService } from "vnext/proposal/proposal-store.service";
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { PriceEstimateService } from '../price-estimate.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaService } from 'ea/ea.service';
import { Router } from '@angular/router';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';

@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.scss']
})
export class EnrollmentComponent implements OnInit, OnDestroy, OnChanges { 

  @Input() enrollmentData: Array<IEnrollmentsInfo>;
  @Output() editEnrollmentEvent = new EventEmitter<object>();
  @Output() enrollSelectionEvent = new EventEmitter();
  @Output() displayEnrollmentData = new EventEmitter();
  @Input() isChangeSubFlow = false;

  viewIndex = 0;
  start:number = 0;
  start_max:number;
  allEnrollments = [];
  public subscribers: any = {};

  constructor(public utilitiesService: UtilitiesService,public priceEstimateStoreService: PriceEstimateStoreService, public proposalStoreService: ProposalStoreService, public renderer: Renderer2, private priceEstimateService: PriceEstimateService,
    public localizationService:LocalizationService,public elementIdConstantsService: ElementIdConstantsService, public eaService: EaService,private router: Router, public dataIdConstantsService: DataIdConstantsService) { }

  ngOnInit() {
    if (this.eaService.features.PROVIDER_CONNECTIVITY_REL) {
      this.allEnrollments = this.enrollmentData;
      this.enrollmentData = this.enrollmentData.slice(0,5);
      this.start_max = this.allEnrollments.length - this.enrollmentData.length;
    }
   //this.enrollmentData[0].locked = true;
    //this.enrollmentData[0].prePurchaseInfo = {begeoName : 'test 123'}

    // get updated enrollment data 
    this.subscribers.enrollmentUpdateSubject = this.priceEstimateService.enrollmentUpdateSubject.subscribe((data: any) => {
      if(data?.length){
        this.enrollmentData = data;
        if (this.eaService.features.PROVIDER_CONNECTIVITY_REL) {
          this.allEnrollments = this.enrollmentData;
          this.enrollmentData = this.enrollmentData.slice(0,5);
          this.start_max = this.allEnrollments.length - this.enrollmentData.length;
        }
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.enrollmentData.firstChange) {
      this.setPosition();
    }
  }

    selectEnrollment(enrollment){
      // check if collab or hybrid portfolios and migration flag present, don't allow selection
      if ((enrollment?.id === 4 || enrollment.id === 6) && enrollment?.migration) {
        return;
      }
    this.enrollSelectionEvent.emit(enrollment);
    this.renderer.addClass(document.body, 'modal-open');
  }


  ngOnDestroy(){
    if(this.subscribers.enrollmentUpdateSubject){
      this.subscribers.enrollmentUpdateSubject.unsubscribe();
    }
  }

  openEditEnrollment(enrollment) {
    this.editEnrollmentEvent.emit(enrollment);
  }

   showDetails(enrollment) {
    enrollment.forEach(element => {
      element.detailInfo = !element.detailInfo;
    });
  }

  getWarningClassStatus(enrollment){
    if(enrollment.enrolled && enrollment?.includedInChangeSub && this.isChangeSubFlow){
      return false;
    } else if(enrollment.enrolled && enrollment.commitInfo?.fcSuiteCount === 0 && !enrollment.primary && !enrollment.disabled && !enrollment.locked){
        return true;
    }
    return false;
  }

  getSuccessClassStatus(enrollment){
    if(enrollment.enrolled && enrollment?.includedInChangeSub && this.isChangeSubFlow){
      return false;
    } else if(enrollment.enrolled && enrollment.commitInfo?.fcSuiteCount > 0 &&  !enrollment.disabled && (!enrollment.locked || (this.eaService.features.RENEWAL_SEPT_REL && enrollment.locked && this.proposalStoreService.proposalData?.renewalInfo?.id))){
      return true;
    }
    return false;
  }

  getDangerClassStatus(enrollment){
    if(enrollment.enrolled && enrollment?.includedInChangeSub && this.isChangeSubFlow){
      return false;
    } else if(enrollment.enrolled && enrollment.commitInfo?.fcSuiteCount === 0 && enrollment.primary &&  !enrollment.disabled  && !enrollment.locked){
      return true;
    } else if(enrollment.enrolled && enrollment.commitInfo?.fcSuiteCount === 0 && !enrollment.primary &&  !enrollment.disabled && this.priceEstimateService.enrollArr.length === 1){
      return true;
    }
    return false;
  }

  displayEnrollment(enrollment) {
    if(this.eaService.features.CROSS_SUITE_MIGRATION_REL){
      if((enrollment.enrolled || (!enrollment.enrolled && this.isChangeSubFlow && enrollment.includedInChangeSub && (!this.eaService.isUpgradeFlow || (this.eaService.isUpgradeFlow && (enrollment?.eligibleForMigration || enrollment?.eligibleForUpgrade)))  && !(enrollment.id === 4 || enrollment.id === 6 ))) && this.priceEstimateStoreService.selectedEnrollment?.id !== enrollment.id) {
        this.displayEnrollmentData.emit(enrollment.id);
      }
    } else {
      if((enrollment.enrolled || (!enrollment.enrolled && this.isChangeSubFlow && enrollment.includedInChangeSub && !(enrollment.id === 4 || enrollment.id === 6 ))) && this.priceEstimateStoreService.selectedEnrollment?.id !== enrollment.id) {
        this.displayEnrollmentData.emit(enrollment.id);
      }
    }
  }

  moveRight() {
    if (this.viewIndex === this.start_max) {
      return;
    }
    this.viewIndex =  this.viewIndex + 1
    this.setPosition();
  }

  moveLeft() {
    if (this.viewIndex === 0) {
      return;
    }
    this.viewIndex =  this.viewIndex - 1
    this.setPosition();
  }

  setPosition() {
   let showEnrollments = this.allEnrollments;
   showEnrollments = showEnrollments.slice(this.viewIndex, this.viewIndex+5);
   this.enrollmentData = showEnrollments;
  }

  goToDocCenter(){
    this.proposalStoreService.loadCusConsentPage = true;
    this.router.navigate(['ea/project/proposal/'+ this.proposalStoreService.proposalData.objId  + '/documents']);
  }

}
