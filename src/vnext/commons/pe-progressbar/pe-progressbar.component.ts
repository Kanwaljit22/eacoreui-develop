import { Component, OnInit } from '@angular/core';
import { EaStoreService } from 'ea/ea-store.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { BlockUiService } from '../services/block-ui.service';

@Component({
  selector: 'app-pe-progressbar',
  templateUrl: './pe-progressbar.component.html',
  styleUrls: ['./pe-progressbar.component.scss']
})
export class PeProgressbarComponent implements OnInit {

  generatingEAConf: string;
  validatingOrderingRule: string;
  computingPa: string;
  emitterCounter = 0;
  peRecalculateMsg: any;

  constructor(public blockUiService: BlockUiService, public eaStoreService: EaStoreService, public proposalStoreService: ProposalStoreService){}

  ngOnInit() {
  }

}
