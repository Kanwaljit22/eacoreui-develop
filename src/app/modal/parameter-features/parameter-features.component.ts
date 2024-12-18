import { Component, Input, OnInit, EventEmitter, OnDestroy, Output, ViewChild, AfterViewInit, Injector } from '@angular/core';
import { CreateProposalService } from '@app/proposal/create-proposal/create-proposal.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// import { Subscription } from 'rxjs';
import { TcoConfigurationService } from '../../proposal/edit-proposal/tco-configuration/tco-configuration.service';
import { MessageService } from '../../shared/services/message.service';
import { LocaleService } from "@app/shared/services/locale.service";

@Component({
  selector: 'app-parameter-feature',
  templateUrl: './parameter-features.component.html',
  styleUrls: ['./parameter-features.component.scss']
})
export class ParameterFeatureComponent implements OnInit {

  @Input() listOfFeatures: any;
  @Output() out = new EventEmitter();
  data = new Array<any>();
  selecteditem: any = [];
  suiteName: string;
  suiteId: number;
  hardwareDiscount: number;
  hardwareServiceDiscount: number;
  yearlyGrowthRate: number;
  suiteItem: boolean;
  excludedFeatures: Array<string>;
  featureChanged = false;
  constructor(public localeService: LocaleService, private n: NgbModal, public activeModal: NgbActiveModal,
    private tcoConfigurationService: TcoConfigurationService,
    private messageService: MessageService, public createProposalService: CreateProposalService) { }

  ngOnInit() {
    // this.selecteditem = ['Fnd-Primelife', 'Fnd-Prime Assurance', 'Fnd-StealthWatch'];
    this.excludedFeatures = new Array<string>();

    console.log(this.listOfFeatures);
    if (typeof this.listOfFeatures !== 'undefined') {
      for (const key in this.listOfFeatures) {
        if (this.listOfFeatures[key]) {
          this.data.push({ 'item': key, 'checked': true });
        } else {
          this.data.push({ 'item': key, 'checked': false });
          this.excludedFeatures.push(key);
        }
      }
    }
  }

  checkboxSelection(index, a) {

    if (index.target.checked) {
      if (this.selecteditem.indexOf(a.item) === -1) {
        this.selecteditem.push(a.item);
        const i = this.excludedFeatures.indexOf(a.item);
        this.excludedFeatures.splice(i, 1);
      }
    } else {
      const i = this.selecteditem.indexOf(a.item);
      this.excludedFeatures.push(a.item);
      this.selecteditem.splice(i, 1);
    }
    this.featureChanged = true;

    // console.log(this.excludedFeatures);
    // console.log(this.selecteditem);

  }
  apply() {
    const data = {
      'suiteId': this.suiteId,
    };
    if (this.suiteItem) {
      data['hardwareDiscout'] = this.hardwareDiscount;
      data['hardwareServiceDiscount'] = this.hardwareServiceDiscount;
      data['yearlyGrowthRate'] = this.yearlyGrowthRate;
    } else {
      data['lineItemId'] = this.suiteName;
    }
    if (this.excludedFeatures.length > 0) {
      data['excludedFeatures'] = this.excludedFeatures;
    } else {
      data['allSelected'] = true;
    }
    const returnData = {
      'selectedTerm': this.selecteditem
    };

    this.tcoConfigurationService.growthParameterSave(data, this.suiteItem).subscribe((res: any) => {
      if (res && !res.error) {
        try {
          this.out.emit(this.excludedFeatures);
          this.activeModal.close({
            locateData: res
          });
          this.tcoConfigurationService.enableRegenerateGraph = true;
          this.createProposalService.updateProposalStatus();
          // console.log(res.data);
        } catch (error) {
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.activeModal.close({
        });
        this.messageService.displayMessagesFromResponse(res);
      }
    });
    // this.activeModal.close();
  }
}
