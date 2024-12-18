import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal,NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EaUtilitiesService } from "ea/commons/ea-utilities.service";
import { ProposalStoreService, IEamsDelivery } from "vnext/proposal/proposal-store.service";
import { MessageService } from "vnext/commons/message/message.service";
import { VnextService } from "vnext/vnext.service";
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaRestService } from 'ea/ea-rest.service';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';


@Component({
  selector: 'app-eams-delivery',
  templateUrl: './eams-delivery.component.html',
  styleUrls: ['./eams-delivery.component.scss']
})
export class EamsDeliveryComponent implements OnInit {

 @ViewChild('phoneNumberField', {
    static: false
  }) phoneNumberField: ElementRef;
  
  selectedCiscoEams = true;
  partnerContactName = '';
  partnerEmail = '';
  primaryPartner = '';
  partnerCcoId = '';
  phoneNumber = '';
  eamsPartnerInfo:IEamsDelivery;
  invalidEmail = false
  isChangeSubFlow = false; // to set change sub flow
  proposalCxParams: any = {}; // to set proposalcxParam

  constructor(private activeModal: NgbActiveModal, private modalVar: NgbModal, private eaUtilitiesService: EaUtilitiesService, private eaRestService: EaRestService, private proposalStoreService : ProposalStoreService, private messageService: MessageService , private vnextService : VnextService ,public localizationService:LocalizationService, private eaService: EaService, public dataIdConstantsService: DataIdConstantsService, public elementIdConstantsService: ElementIdConstantsService) { }

  ngOnInit(): void {
    this.eaService.getLocalizedString('eams-delivery');

  // Set param if values are already entered
    this.primaryPartner = (this.proposalStoreService.proposalData.partnerInfo && this.proposalStoreService.proposalData.partnerInfo.beGeoName) ? this.proposalStoreService.proposalData.partnerInfo.beGeoName : '';

    if (this.eamsPartnerInfo && this.eamsPartnerInfo.partnerInfo) {

        this.partnerContactName = this.eamsPartnerInfo.partnerInfo.partnerContactName;
        this.partnerEmail = this.eamsPartnerInfo.partnerInfo.emailId;
        this.partnerCcoId = this.eamsPartnerInfo.partnerInfo.ccoId;
        this.phoneNumber = this.eamsPartnerInfo.partnerInfo.contactNumber;
        this.selectedCiscoEams =  !this.eamsPartnerInfo.partnerDeliverySelected;
    }
  }

  close() {

     this.activeModal.close({
          continue: false
      });
  }

  selectCisco() {
    this.selectedCiscoEams = true;
  }

  selectEams() {
    this.selectedCiscoEams = false;
  }

  saveCiscoEMS () {

  let json = {

  'data': {
    'eamsDelivery': {
        'partnerDeliverySelected': !this.selectedCiscoEams,
      }
     }
    };

  const url = this.vnextService.getAppDomainWithContext + 'proposal/'+ this.proposalStoreService.proposalData.objId + '?a=EAMS-DELIVERY-UPDATE';

  this.eaRestService.postApiCall(url,json).subscribe((response: any) => {
    if (response && !response.error) {

        this.activeModal.close({
          continue: true
       });
        // this.next(true);
      } else {
        this.messageService.displayMessagesFromResponse(response);
    }
  });
  }

  isNumberOnlyKey(event: any) {
    
    return this.eaUtilitiesService.isNumberOnlyKey(event)
  }

  allowNumberWithPlus(event: any) {
    // console.log(event,' - - - - ');
    return this.eaUtilitiesService.allowNumberWithPlus(event)
  }

  checkPhoneNumbers(event){
    
    if(event.target.value){
      let str = this.phoneNumberField.nativeElement.value.split("");
      str.forEach((item,index)=>{
        if(index!==0){
          if(item === "+"){
            str.splice(index,1);
            this.phoneNumberField.nativeElement.value =  str.join('');
          }
        }
      })
    }
  }

  savePartnerEMS() {

  let json = {

  'data': {
    'eamsDelivery': {
    'partnerDeliverySelected': !this.selectedCiscoEams,
      'partnerInfo': {
        'ccoId': this.partnerCcoId,
        'contactNumber': this.phoneNumber,
        'emailId': this.partnerEmail,
        'partnerContactName': this.partnerContactName
      }
      }
      }
    };

  const url = 'proposal/'+ this.proposalStoreService.proposalData.objId + '?a=EAMS-DELIVERY-UPDATE';


    this.eaRestService.postApiCall(url,json).subscribe((response: any) => {
      if (response && !response.error) {

        this.activeModal.close({
          continue: true
         });
      } else {
      this.messageService.displayMessagesFromResponse(response);
    }
  });
 }

  emailValidation(emailId) {
    if (!emailId) {
      this.invalidEmail = false;
      return;
    }
    if (this.proposalStoreService.emailValidationRegx.test(emailId) === false) {
      this.invalidEmail = true;
    } else {
      this.invalidEmail = false;
    }
  }

}
