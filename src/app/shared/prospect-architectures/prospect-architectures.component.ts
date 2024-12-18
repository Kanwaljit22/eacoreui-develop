import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LocaleService } from '../services/locale.service';
import { ConstantsService } from '../services/constants.service';
import { UtilitiesService } from '../services/utilities.service';
import { AppDataService } from '../services/app.data.service';
import { Router } from '@angular/router';
import { SubHeaderComponent } from '../sub-header/sub-header.component';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { ProductSummaryService } from '@app/dashboard/product-summary/product-summary.service';

@Component({
  selector: 'app-prospect-architectures',
  templateUrl: './prospect-architectures.component.html',
  styleUrls: ['./prospect-architectures.component.scss']
})
export class ProspectArchitecturesComponent implements OnInit {
  @Input() public prospectDetailsData: any;
  @Input() matching: any;
  @Output() closeDealModal = new EventEmitter();
  @Output() routePage = new EventEmitter();
  @Input() state: any;
  isSwitched = false;

  constructor(
    public localeService: LocaleService,
    public utilitiesService: UtilitiesService,
    public constantsService: ConstantsService,
    private appDataService: AppDataService,
    private router: Router,
    private productSummaryService: ProductSummaryService,
    public qualService: QualificationsService
  ) { }

  ngOnInit() {
    // console.log(this.state,this.matching, this.state === this.constantsService.CREATE_QUAL)
  }

  
  // method to route to prospectdetails of the customer for the selected architecture
  goToProspectDetailsSuite(prospectObj, archs?) {
    const customerName = prospectObj.prospectName;
    const selectedArcitecture = archs ? archs.archId : AppDataService.ARCH_NAME;
    this.closeDealModal.emit();
    this.router.navigate([
      '/prospect-details',
      {
        architecture: selectedArcitecture,
        customername: encodeURIComponent(customerName),
        favorite: this.appDataService.isFavorite
      },
      // '/prospect-details-suites'
    ]);
  }
  // if customer is switched 
  switchCustomer() {
    this.isSwitched = true;
    this.closeDealModal.emit();
    this.qualService.qualification.accountName = this.appDataService.customerName = this.prospectDetailsData.prospectName;
    this.appDataService.customerID = this.prospectDetailsData.prospectKey;
    this.appDataService.custNameEmitter.emit(this.appDataService.customerName);
    this.qualService.prepareSubHeaderObject(SubHeaderComponent.QUALIFICATION, false);
  }

  goToAllArchView(){
    this.appDataService.customerName = this.prospectDetailsData.prospectName;
    this.closeDealModal.emit();
      this.router.navigate([
        '../allArchitectureView',
        {
          architecture: encodeURIComponent(this.productSummaryService.prospectInfoObject
            .architecture),
          customername: encodeURIComponent(this.prospectDetailsData.prospectName),
          customerId: encodeURIComponent(this.prospectDetailsData.prospectKey)
        }
      ]);
  }
}
