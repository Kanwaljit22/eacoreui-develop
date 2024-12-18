import { Component, OnInit, OnDestroy } from '@angular/core';
import { GuideMeService } from '@app/shared/guide-me/guide-me.service';
import { MessageService } from '@app/shared/services/message.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { PriceEstimationService } from '@app/proposal/edit-proposal/price-estimation/price-estimation.service';

@Component({
  selector: 'app-quantity-details',
  templateUrl: './quantity-details.component.html',
  styleUrls: ['./quantity-details.component.scss']
})
export class QuantityDetailsComponent implements OnInit, OnDestroy {
  features = '';


  constructor(private guideMeService: GuideMeService, private messageService: MessageService,
    public appDataService: AppDataService, public priceEstimationService: PriceEstimationService) {
  }

  ngOnInit() {
    this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.priceEstimateQtyChange;
    this.guideMeService.getGuideMeData().subscribe((res: any) => {
      if (res && !res.error) {
        try {
          this.features = res.data.features[0].description;
        } catch (error) {
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  ngOnDestroy() {
    // this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.proposalPriceEstimateStep;
  }

  hideDetails() {
    this.priceEstimationService.showEAQuantity = false;
    this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.proposalPriceEstimateStep;
  }

  hideEAQuantity() {
    this.priceEstimationService.showEAQuantity = false;
    this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.proposalPriceEstimateStep;
  }
}
