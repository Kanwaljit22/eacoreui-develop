
import { Component, OnInit,Input,Output,EventEmitter, OnDestroy, Renderer2 } from '@angular/core';
import { PriceEstimateStoreService } from "vnext/proposal/edit-proposal/price-estimation/price-estimate-store.service";
import { IEnrollmentsInfo, ProposalStoreService } from "vnext/proposal/proposal-store.service";
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaService } from 'ea/ea.service';
import { Router } from '@angular/router';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { PriceEstimateService } from '../../price-estimation/price-estimate.service';

@Component({
  selector: 'app-spna-enrollment',
  templateUrl: './spna-enrollment.component.html',
  styleUrls: ['./spna-enrollment.component.scss']
})
export class SpnaEnrollmentComponent implements OnInit, OnDestroy { 

  @Input() enrollmentData: Array<IEnrollmentsInfo>;
  @Output() editEnrollmentEvent = new EventEmitter<object>();
  @Output() enrollSelectionEvent = new EventEmitter();
  @Output() displayEnrollmentData = new EventEmitter();
  @Input() isChangeSubFlow = false;

  constructor(public utilitiesService: UtilitiesService,public priceEstimateStoreService: PriceEstimateStoreService, public proposalStoreService: ProposalStoreService, public renderer: Renderer2, private priceEstimateService: PriceEstimateService,
    public localizationService:LocalizationService, public eaService: EaService,private router: Router, public dataIdConstantsService: DataIdConstantsService) { }

  ngOnInit() {
   //this.enrollmentData[0].locked = true;
    //this.enrollmentData[0].prePurchaseInfo = {begeoName : 'test 123'}
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
    } else if(enrollment.enrolled && enrollment.commitInfo?.fcSuiteCount > 0 &&  !enrollment.disabled && !enrollment.locked){
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
    if((enrollment.enrolled || (!enrollment.enrolled && this.isChangeSubFlow && enrollment.includedInChangeSub && !(enrollment.id === 4 || enrollment.id === 6 ))) && this.priceEstimateStoreService.selectedEnrollment?.id !== enrollment.id) {
      this.displayEnrollmentData.emit(enrollment.id);
    }
  }

  goToDocCenter(){
    this.proposalStoreService.loadCusConsentPage = true;
    this.router.navigate(['ea/project/proposal/'+ this.proposalStoreService.proposalData.objId  + '/documents']);
  }

}
