import { Component, OnInit, Input, OnDestroy, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { ProductSummaryService } from '@app/dashboard/product-summary/product-summary.service';
import { PartnerBookingsService } from './partner-bookings.service';
import { MessageService } from '../services/message.service';
import { UtilitiesService } from '../services/utilities.service';
import { MessageType } from '../services/message';
import { AppDataService } from '../services/app.data.service';
import { AccountHealthInsighService } from '../account-health-insight/account.health.insight.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-partner-bookings',
  templateUrl: './partner-bookings.component.html',
  styleUrls: ['./partner-bookings.component.scss']
})
export class PartnerBookingsComponent implements OnInit, OnDestroy {
  @ViewChild('partnerName', { static: false }) private valueContainer: ElementRef;
  @Input() architectureView: boolean;
  showRevenue = true;
  partnerDetails = [];
  @Input() customerData: any;
  showTable = false;
  isDataLoaded = false;
  reloadPartnerSub: Subscription;
  partnerDetailSub: Subscription;

  constructor(private appDataService: AppDataService, private messageService: MessageService,
    public productSummaryService: ProductSummaryService, public partnerBookingsService: PartnerBookingsService,
    public utilitiesService: UtilitiesService, private accountHealthInsighService: AccountHealthInsighService,
    public renderer: Renderer2) { }

  ngOnInit() {
    this.getPartnerDetailsByCust();
    this.reloadPartnerSub = this.accountHealthInsighService.reloadPartnerEmitter.subscribe(() => {
      this.getPartnerDetailsByCust();
    });
  }

  ngOnDestroy() {
    this.partnerBookingsService.showPartnerBooking = false;
    
    if (this.architectureView) {
      this.partnerBookingsService.partnerCount = 0;  
    } else {
      this.renderer.removeClass(document.body, 'position-fixed');
    }

    if (this.reloadPartnerSub) {
      this.reloadPartnerSub.unsubscribe();
    }

    if (this.partnerDetailSub) {
      this.partnerDetailSub.unsubscribe();
    }
  }

  getPartnerDetailsByCust() {
    if (this.partnerDetailSub) {
      this.partnerDetailSub.unsubscribe();
    }

    const requestObj = {
      'data': {
        'customerName': this.customerData.customerName
      }
    };
    if (this.appDataService.archName !== 'ALL' && this.appDataService.archName !== 'All Architectures') {
      requestObj['data']['archName'] = this.appDataService.archName;
    }
    this.partnerDetailSub = this.partnerBookingsService.getPartnerDetailsByCust(requestObj).subscribe((response: any) => {
      this.isDataLoaded = true;
      if (response && !response.error && response.data) {
        this.partnerDetails = response.data;
        if (this.architectureView) {
          if (response.data.length > 15) {
            this.partnerDetails.length = 15;
            this.partnerBookingsService.partnerCount = 15;
          } else {
            this.partnerBookingsService.partnerCount = response.data.length;
          }
        }
        this.showTable = true;
      } else {
        if (response.error) {
          this.messageService.displayMessagesFromResponse(response);
          this.partnerBookingsService.showPartnerBooking = false;
        } else {
          this.partnerDetails.length = 0;
          this.partnerBookingsService.partnerCount = 0;
          this.showTable = false;
        }
      }
    });
  }

  close() {
    this.partnerBookingsService.showPartnerBooking = false;
  }

  openTooltip(tooltip, i) {
    const e = this.valueContainer.nativeElement;
    if (e.offsetWidth < e.scrollWidth && i === 0) {
      tooltip.open();
    }
  }
}
