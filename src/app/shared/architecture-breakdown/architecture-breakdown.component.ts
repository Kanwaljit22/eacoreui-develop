import { Component, OnInit, Input, OnDestroy, Renderer2 } from '@angular/core';
import { ProductSummaryService } from '@app/dashboard/product-summary/product-summary.service';
import { ArchitectureBreakdownService } from './architecture-breakdown.service';
import { MessageService } from '../services/message.service';
import { AppDataService } from '../services/app.data.service';

@Component({
  selector: 'app-architecture-breakdown',
  templateUrl: './architecture-breakdown.component.html',
  styleUrls: ['./architecture-breakdown.component.scss']
})
export class ArchitectureBreakdownComponent implements OnInit, OnDestroy {
  showArchDrop = false;
  topPartnerInfo = [];
  showData = false;
  @Input() customerData: any;
  @Input() partnerData: any;
  partnerDropdown = [];

  constructor(public productSummaryService: ProductSummaryService, private messageService: MessageService,
    private architectureBreakdownService: ArchitectureBreakdownService, private appDataService: AppDataService,
    public renderer: Renderer2) { }

  ngOnInit() {
    this.getTopPartnerData();
    this.getPartnerDropdownData();
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'position-fixed');
  }

  showDrop() {
    this.showArchDrop = !this.showArchDrop;
  }
  // --------- The below method is optimized for validating response from  API call ---------

  // getPartnerDropdownData(){
  //   const requestObj = {
  //     'data' : {
  //       'customerName': this.customerData.customerName
  //   }
  // }
  //   this.architectureBreakdownService.getPartnerDetailsByCust(requestObj).subscribe((response: any) => {
  //     if(response && !response.error && response.data){
  //       this.partnerDropdown = response.data.map((value) => {
  //         let partner = {}
  //         partner['partnerName'] = value.partnerName;
  //         partner['partnerId'] = value.partnerKey;
  //         return partner;
  //       });
  //     } else {
  //       if(response.error){
  //         this.messageService.displayMessagesFromResponse(response);
  //       } else {
  //         this.messageService.displayUiTechnicalError();
  //       }
  //       this.productSummaryService.architectureBreakdown = false;
  //     }
  //   });
  // }

  getPartnerDropdownData() {
    const requestObj = {
      'data': {
        'customerName': this.customerData.customerName
      }
    };
    this.architectureBreakdownService.getPartnerDetailsByCust(requestObj).subscribe((response: any) => {
      const responseObject = this.appDataService.validateResponse(response);
      if (responseObject) {
        this.partnerDropdown = response.data.map((value) => {
          let partner = {};
          partner['partnerName'] = value.partnerName;
          partner['partnerId'] = value.partnerKey;
          return partner;
        });
      } else {
        this.productSummaryService.architectureBreakdown = false;
      }
    });
  }

  getTopPartnerData() {
    const requestObj = {
      'prospectInfo': {
        'customerName': this.customerData.customerName,
        'partnerKey': this.partnerData.partnerId
      }
    };
    this.architectureBreakdownService.getTopPartnerData(requestObj).subscribe((response: any) => {
      if (response && !response.error) {
        try {
          if (response.myProspectInfo) {
            this.topPartnerInfo = response;
            this.showData = true;
          } else {
            this.messageService.displayUiTechnicalError();
          }
        } catch (error) {
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.messageService.displayMessagesFromResponse(response);
        this.productSummaryService.architectureBreakdown = false;
      }
    });
  }

  changePartner(partner) {
    this.partnerData = partner;
    this.getTopPartnerData();
    this.showArchDrop = false;
  }
}
