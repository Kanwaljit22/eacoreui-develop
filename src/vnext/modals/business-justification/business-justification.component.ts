import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';

@Component({
  selector: 'app-business-justification',
  templateUrl: './business-justification.component.html',
  styleUrls: ['./business-justification.component.scss']
})
export class BusinessJustificationComponent {
  percentage: number ;
  isJustificationAdded = false
  constructor(public ngbActiveModal: NgbActiveModal,public utilitiesService:UtilitiesService,  public localizationService:LocalizationService, public dataIdConstantsService: DataIdConstantsService , public proposalStoreService: ProposalStoreService) { }

  ngOnInit() {
    if(this.isJustificationAdded && (this.proposalStoreService.proposalData?.nonStandardTermDetails?.ruleBusinessJustification || this.proposalStoreService.proposalData?.nonStandardTermDetails?.ruleBusinessJustification === 0)){
      this.percentage = this.proposalStoreService.proposalData.nonStandardTermDetails.ruleBusinessJustification;
    }
  }
  close() {
    this.ngbActiveModal.close();
  }
  done(){
    this.ngbActiveModal.close({
      percentage: this.percentage
    });
  }
  onPaste(event:ClipboardEvent){
    event.preventDefault();
  }
  inputValueChange(event){
    if (+event?.target?.value > 100) {
      event.target.value = 100;
    } else if (+event?.target?.value < 0){
      event.target.value = 0
    }
  }

}
