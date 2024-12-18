import { Component, OnInit } from '@angular/core';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { LocaleService } from '@app/shared/services/locale.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  generatingEAConf: string;
  validatingOrderingRule: string;
  computingPa: string;
  emitterCounter = 0;
  peRecalculateMsg: any;

  constructor(public blockUiService: BlockUiService, public localeService: LocaleService, private appDataService: AppDataService) {
  }

  ngOnInit() {
    this.generatingEAConf = this.localeService.getLocalizedString('customLoader.generating.config');
    this.validatingOrderingRule = this.localeService.getLocalizedString('customLoader.validating.ordering.rule');
    this.computingPa = this.localeService.getLocalizedString('customLoader.computing.pa');

    this.peRecalculateMsg = this.appDataService.peRecalculateMsg;
  }
}
