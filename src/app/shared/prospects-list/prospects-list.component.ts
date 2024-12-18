import { Router } from '@angular/router';
import { AppDataService } from '@app/shared/services/app.data.service';
import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { LocaleService } from '../services/locale.service';

@Component({
  selector: 'app-prospects-list',
  templateUrl: './prospects-list.component.html',
  styleUrls: ['./prospects-list.component.scss']
})
export class ProspectsListComponent implements OnInit, OnDestroy {
  @Input() prospectData: any;
  @Input() showFavoritesProspects: any;

  constructor(public localeService: LocaleService, public appDataService: AppDataService,
    private router: Router, public renderer: Renderer2) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'position-fixed');
  }


  viewQualificationList(prospectObj, archs?) {

    this.appDataService.userDashboardFLow = '';

    const customerName = this.showFavoritesProspects ? prospectObj.customerName : prospectObj.prospectName;
    const selectedArcitecture = 'ALL'; // archs ? archs.archId : AppDataService.ARCH_NAME;
    const prospectKey = prospectObj.prospectKey;
    this.router.navigate([
      '/allArchitectureView',
      {
        architecture: encodeURIComponent(selectedArcitecture),
        customername: encodeURIComponent(customerName),
        customerId: encodeURIComponent(prospectKey)
      }
    ]);
  }

}
