import { UtilitiesService } from './../services/utilities.service';
import { CountriesPresentService } from './countries-present.service';
import { MessageService } from './../services/message.service';
import { AppDataService } from './../services/app.data.service';
import { Component, OnInit, Input, Renderer2, OnDestroy } from '@angular/core';
import { MessageType } from '../services/message';
import { LocaleService } from '../services/locale.service';

@Component({
  selector: 'app-countries-present',
  templateUrl: './countries-present.component.html',
  styleUrls: ['./countries-present.component.scss']
})
export class CountriesPresentComponent implements OnInit, OnDestroy {
  @Input() architectureView: boolean;
  showRevenue = true;
  countriesDetails = [];
  @Input() customerData: any;
  showTable = false;
  isDataLoaded = false;

  constructor(private appDataService: AppDataService, private messageService: MessageService, public localeService: LocaleService,
    public countriesPresentService: CountriesPresentService, public renderer: Renderer2, public utilitiesService: UtilitiesService) { }

  ngOnInit() {
    this.getCountryDetailsByCust();
    /*this.accountHealthInsighService.reloadPartnerEmitter.subscribe(()=> {
      this.getPartnerDetailsByCust();
    });*/
  }

  ngOnDestroy() {
    this.countriesPresentService.showCountriesPresent = false;
    if (this.architectureView) {
      this.renderer.removeClass(document.body, 'position-fixed');
    }
  }

  // getCountryDetailsByCust(){
  //   const requestObj = {
  //     'data' : {
  //       'customerName': this.customerData.customerName
  //   }
  // }
  // if(this.appDataService.archName !== 'ALL' && this.appDataService.archName !== 'All Architectures'){
  //   requestObj['data']['archName'] = this.appDataService.archName;
  // }
  //   this.countriesPresentService.getCountryDetailsByCust(requestObj).subscribe((response: any) => {
  //     if(undefined){
  //       this.countriesDetails = response.data;
  //       if(!this.architectureView){
  //         this.countriesDetails.length = 15;
  //       }
  //       this.showTable = true;
  //     } else {
  //       if(response.error){
  //         this.messageService.displayMessagesFromResponse(response);
  //       } else {
  //         if(this.appDataService.pageContext !== AppDataService.PAGE_CONTEXT.accountHealth){
  //           this.countriesDetails.length = 0;
  //           this.showTable = false;
  //           this.messageService.displayMessages(this.appDataService.setMessageObject('No Data Found', MessageType.Info));
  //         }
  //       }
  //       this.countriesPresentService.showCountriesPresent = false;
  //     }
  //   });
  // }
  getCountryDetailsByCust() {
    const requestObj = {
      'data': {
        'customerName': this.customerData.customerName
      }
    };
    if (this.appDataService.archName !== 'ALL' && this.appDataService.archName !== 'All Architectures') {
      requestObj['data']['archName'] = this.appDataService.archName;
    }
    this.countriesPresentService.getCountryDetailsByCust(requestObj).subscribe((response: any) => {
      this.isDataLoaded = true;
      const responseObject = this.appDataService.validateResponse(response);
      if (responseObject) {
        this.countriesDetails = responseObject;
        if (!this.architectureView) {
          this.countriesDetails.length = 15;
        }
        this.showTable = true;
      } else {
        if (response.error) {
          this.messageService.displayMessagesFromResponse(response);
          this.countriesPresentService.showCountriesPresent = false;
        } else {
          this.countriesDetails.length = 0;
          this.showTable = false;
          // this.messageService.displayMessages(this.appDataService.setMessageObject('No Data Found', MessageType.Info));
        }
      }
    });
  }
  close() {
    this.countriesPresentService.showCountriesPresent = false;
  }
}
