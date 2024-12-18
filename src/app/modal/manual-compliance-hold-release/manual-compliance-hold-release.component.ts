import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocaleService } from '@app/shared/services/locale.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { SalesReadinessService } from '@app/sales-readiness/sales-readiness.service';

@Component({
  selector: 'app-manual-compliance-hold-release',
  templateUrl: './manual-compliance-hold-release.component.html',
  styleUrls: ['./manual-compliance-hold-release.component.scss']
})
export class ManualComplianceHoldReleaseComponent implements OnInit {

  public cancelOrderMode: false;

  public complianceFieldReleaseData: any;

  public justificationContent = '';
  public stageList = [{
    name: 'EUIF',
    status: 'Not Signed'
  }, {
    name: 'Partner Authorization',
    status: 'No'
  }, {
    name: 'Smart Account',
    status: 'Inactive'
  }
    // , {
    //   name: 'Virtual Account',
    //   status: 'Inactive'
    // }
  ];

  constructor(public activeModal: NgbActiveModal, public localeService: LocaleService,
    public salesReadinessContainer: SalesReadinessService, public proposalDataService: ProposalDataService) { }

  ngOnInit() {
    if (this.complianceFieldReleaseData) {
      this.stageList[0].status = this.complianceFieldReleaseData['euifSigned'] ? 'Signed' : 'Not Signed';
      this.stageList[1].status = this.complianceFieldReleaseData['purchaseAuthorized'] ? 'Yes' : 'No';
      this.stageList[2].status = this.complianceFieldReleaseData['smartAccountActive'] ? 'Active' : 'Not Active';
      // this.stageList[4].status = this.complianceFieldReleaseData['virtualAccountActive'] ? 'Active' : 'Not Active';
    }
  }

  submit() {
    this.complianceFieldReleaseData['overridingComment'] = this.justificationContent;
    this.activeModal.close({ data: this.complianceFieldReleaseData });
  }

  cancelOrder() {
    this.activeModal.close({ data: this.complianceFieldReleaseData });
  }

}
