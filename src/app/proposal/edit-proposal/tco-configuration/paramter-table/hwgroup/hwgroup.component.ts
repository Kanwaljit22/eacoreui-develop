import { ConstantsService } from '@app/shared/services/constants.service';
import { Component, OnInit } from '@angular/core';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { CreateProposalService } from '@app/proposal/create-proposal/create-proposal.service';

@Component({
  selector: 'app-hwgroup',
  templateUrl: './hwgroup.component.html'
})
export class HwgroupComponent implements OnInit {
  params: any;
  data: any;
  edited = false;
  intialValue: number;
  constructor(public proposalDataService: ProposalDataService, public createProposalService: CreateProposalService,
    public constantsService: ConstantsService) { }

  agInit(params) {
    this.params = params;
    this.data = params.value;
  }

  ngOnInit() {
    this.intialValue = this.data;
  }

  onClick(e, params) {
    console.log(params);

    if (params.node.level === 0 && params.data) {
      if (params.data.suite_Name.search("Subscription") === -1) {
        this.edited = true;
      } else {
        if (params.colDef.field === "tcoGrowthRate") {
          this.edited = true;
        }
      }
    } else {
      this.edited = false;
    }
  }

  keyUp(event, value) {
    const key = window.event ? event.keyCode : event.which;
    if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 190
      || event.keyCode === 37 || event.keyCode === 39 || (key < 48 && key > 57) || (key >= 96 && key <= 105)) {
      return true;
    } else if (key < 48 || key > 57) {
      return false;
    }
  }

  onClickedOutside(e, val) {
    if (!val) {
      return false;
    }
    this.edited = false;
    if (this.intialValue !== +val) {
      if (+val > 100) {
        val = 100;
      }
      // converting to 2 decimal places
      val = Math.round((+val) * 100) / 100;
      this.params.context.parentChildIstance.updatehw(this.params.node.id, val, this.params.colDef.field, this.intialValue);
      // this.intialValue = val;
      // if (this.proposalDataService.proposalDataObject.proposalData.status === this.constantsService.QUALIFICATION_COMPLETE) {
      //   this.createProposalService.updateProposalStatus();
      // }
    }
  }

  refresh(): boolean {
    return false;
  }

}
