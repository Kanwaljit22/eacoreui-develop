import { Component, OnInit } from '@angular/core';
import { EaStoreService } from 'ea/ea-store.service';
import { BlockUiService } from '../services/block-ui.service';

@Component({
  selector: 'app-progressbar',
  templateUrl: './progressbar.component.html',
  styleUrls: ['./progressbar.component.scss']
})
export class ProgressbarComponent implements OnInit {

  generatingEAConf: string;
  validatingOrderingRule: string;
  computingPa: string;
  emitterCounter = 0;
  peRecalculateMsg: any;

  constructor(public blockUiService: BlockUiService, public eaStoreService: EaStoreService){}

  ngOnInit() {
  }

}
