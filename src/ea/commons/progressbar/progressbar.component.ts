import { Component, OnInit } from '@angular/core';
import { EaStoreService } from 'ea/ea-store.service';
import { EaService } from 'ea/ea.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';

@Component({
  selector: 'ea-progressbar',
  templateUrl: './progressbar.component.html',
  styleUrls: ['./progressbar.component.scss']
})
export class EaProgressbarComponent implements OnInit {

  generatingEAConf: string;
  validatingOrderingRule: string;
  computingPa: string;
  emitterCounter = 0;
  peRecalculateMsg: any;

  constructor(public eaStoreService: EaStoreService, public eaService:EaService, public localizationService: LocalizationService){}

  ngOnInit() {
  }

}
