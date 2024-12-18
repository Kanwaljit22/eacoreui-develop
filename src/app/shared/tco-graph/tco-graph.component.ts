import { Component, OnInit, Input } from '@angular/core';
import { UtilitiesService } from '../services/utilities.service';
import { LocaleService } from '../services/locale.service';
import { ConstantsService } from '../services/constants.service';
import { AppDataService } from '../services/app.data.service';

@Component({
  selector: 'app-tco-graph',
  templateUrl: './tco-graph.component.html',
  styleUrls: ['./tco-graph.component.scss']
})
export class TcoGraphComponent implements OnInit {
  @Input() public stackedBarData: any;
  @Input() public state: any;
  @Input() public tcoSummaryData: any;
  showStacked = true;
  constructor(public utilitiesService: UtilitiesService, public localeService: LocaleService,
    public constantsService: ConstantsService, public appDataService: AppDataService) { }

  ngOnInit() {
  }

  showStackedGrph() {
    this.showStacked = true;
  }

  showBarGrph() {
    this.showStacked = false;
  }
}
