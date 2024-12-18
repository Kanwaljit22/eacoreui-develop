
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
// import { UtilitiesService } from '../../shared/services/utilities.service';
import { QualListingService } from './qual-listing.service';
import { Router, RouterModule } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { AppDataService } from '@app/shared/services/app.data.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
// import { AppDataService } from '../../shared/services/app.data.service';


@Component({
  selector: 'app-qualification-listing',
  templateUrl: './qualification-listing.component.html',
  styleUrls: ['./qualification-listing.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class QualificationListingComponent implements OnInit {

  archName: any;
  customerName: any;
  customerId: any;
  showQualList = true;

  createQualification = false;

  constructor(public quallistingService: QualListingService, private utilitiesService: UtilitiesService,
    private route: ActivatedRoute, private router: Router, public configService: AppDataService) {
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.archName = (params['architecture']);
      this.quallistingService.archName = this.archName;
      this.customerName = (params['customername']);
      this.quallistingService.customerName = this.customerName;
      this.customerId = (params['customerId']);
      this.quallistingService.customerId = this.customerId;
    });

    this.getQualificationListing();
  }

  getQualificationListing() {
    // console.log("!!!!!!!!!!")
    // api call for qual listing
    this.quallistingService.getQualListing().subscribe(response => {
      // let qualList = response;
      // console.log(qualList);
      let qualList = 0;
      this.showQualList = false;

      if (qualList < 1) {
        this.router.navigate(['/qualifications', {
          architecture: this.archName,
          customername: this.customerName, customerId: this.customerId
        }]);
      }
    }, (error) => {
      // this.productSummaryService.blockUI = false;
      // this.configService.checkErrorResponse(error);
    });
  }

}
