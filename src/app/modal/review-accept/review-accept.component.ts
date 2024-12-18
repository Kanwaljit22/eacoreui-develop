import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { LocaleService } from '@app/shared/services/locale.service';

@Component({
  selector: 'app-review-accept',
  templateUrl: './review-accept.component.html',
  styleUrls: ['./review-accept.component.scss']
})
export class ReviewAcceptComponent implements OnInit {
  @Input() showQualification: boolean;
  disableAccept = true;
  public isproposal = false;
  @Input() shareWithDisti: boolean;

  constructor(public localeService: LocaleService, public activeModal: NgbActiveModal, public qualService: QualificationsService,
    private utilitiesService: UtilitiesService, public appDataService: AppDataService) { }

  ngOnInit() {
    // if(this.showQualification){
    //   this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.qualificationValidateAcceptStep;
    // }else{
    //   this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.proposalValidateAcceptStep;
    // }
  }

  accept() {
    if(!this.shareWithDisti){
      this.utilitiesService.sendMessage(this.isproposal);
    }
    this.activeModal.close({
      locateData: 'validated'
    });
    this.activeModal.close();
  }

  reviewChange() {
    this.disableAccept = !this.disableAccept;
  }

}
