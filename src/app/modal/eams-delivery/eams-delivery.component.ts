import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ServiceChangesConfirmationComponent } from '../service-changes-confirmation/service-changes-confirmation.component';
import { EamsDeliveryService } from "@app/modal/eams-delivery/eams-delivery.service";
import { MessageService } from "@app/shared/services/message.service";
import { MessageType } from "@app/shared/services/message";
import { AppDataService } from "@app/shared/services/app.data.service";
import { LocaleService } from "@app/shared/services/locale.service";
import { UtilitiesService } from '@app/shared/services/utilities.service';
import {
  SearchCountryField,
  CountryISO,
  PhoneNumberFormat,
} from 'ngx-intl-tel-input';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EaService } from 'ea/ea.service';

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
  eamsPartnerInfo: any = {};
  invalidEmail = false
  isChangeSubFlow = false; // to set change sub flow
  proposalCxParams: any = {}; // to set proposalcxParam

  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  phoneForm = new FormGroup({
    phone: new FormControl(undefined, [Validators.required]),
  });
  displayPhoneError = false;
  constructor(public activeModal: NgbActiveModal, public utilitiesService: UtilitiesService, public modalVar: NgbModal , private eaService:EaService,
    public eamsDeliveryService: EamsDeliveryService,private messageService: MessageService,public localeService: LocaleService,public appDataService
: AppDataService) { }

  ngOnInit() {

    // Set param if values are already entered
    this.primaryPartner = (this.eamsPartnerInfo.partner && this.eamsPartnerInfo.partner.name) ? this.eamsPartnerInfo.partner.name : '';
    this.partnerContactName = this.eamsPartnerInfo.partnerContactName;
    this.partnerEmail = this.eamsPartnerInfo.emailId;
    this.partnerCcoId = this.eamsPartnerInfo.ccoId;
   // this.phoneNumber = this.eamsPartnerInfo.contactNumber;
    this.setPhoneNoData();
  }
  
  get phone() {
    return this.phoneForm.get('phone');
  }

  setPhoneNoData(){
    // this.eamsPartnerInfo.contactNumber = '6137905145';
    // this.eamsPartnerInfo.phoneCountryCode = '+1';
    // this.eamsPartnerInfo.dialFlagCode = 'CA'
    this.phone.setValue({
      "number": this.eamsPartnerInfo.contactNumber,
      "e164Number": this.eamsPartnerInfo.phoneCountryCode + this.eamsPartnerInfo.contactNumber,
      "countryCode": this.eamsPartnerInfo.dialFlagCode,
      "dialCode": this.eamsPartnerInfo.phoneCountryCode
    })
  }

  // validatePhoneNumber(){
  //   if(this.phone.invalid){
  //     this.displayPhoneError = true;
  //   } else {
  //     this.displayPhoneError = false;
  //   }
  // }
  // onClick(){
  //   this.displayPhoneError = false;
  // }

  close() {
    this.activeModal.close();
  }

  selectCisco() {
    this.selectedCiscoEams = true;
  }

  selectEams() {
    this.selectedCiscoEams = false;
  }

  next(isServiceSpecialist) {
    this.activeModal.close();
    const modalRef = this.modalVar.open(ServiceChangesConfirmationComponent, {
      windowClass: "service-confirmation"
    });

   modalRef.result.then((result) => {

    this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedMessage(
            'proposal.pe.CX_EMS_SUCCESS'), MessageType.Success));
    });

    modalRef.componentInstance.mangeServiceConfirmation = isServiceSpecialist;
  }


  saveCiscoEMS () {

  let json = {

  'data': {
    'partnerDelivery': !this.selectedCiscoEams,
      }
    };

  this.eamsDeliveryService.saveEAMDelivery(json).subscribe((response: any) => {
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
    
    return this.utilitiesService.isNumberOnlyKey(event)
  }

  // allowNumberWithPlus(event: any) {
  //   // console.log(event,' - - - - ');
  //   return this.utilitiesService.allowNumberWithPlus(event)
  // }

  // checkPhoneNumbers(event){
    
  //   if(event.target.value){
  //     let str = this.phoneNumberField.nativeElement.value.split("");
  //     str.forEach((item,index)=>{
  //       if(index!==0){
  //         if(item === "+"){
  //           str.splice(index,1);
  //           this.phoneNumberField.nativeElement.value =  str.join('');
  //         }
  //       }
  //     })
  //   }
  // }

  savePartnerEMS() {
  let json = {

  'data': {
    'partnerDelivery': !this.selectedCiscoEams,
      'partnerInfo': {
        'ccoId': this.partnerCcoId,
        'contactNumber': this.eaService.getPhoneNumber(this.phone.value.e164Number,this.phone.value.dialCode),
        'dialFlagCode': this.phone.value.countryCode,
        'phoneCountryCode': this.phone.value.dialCode,
        'emailId': this.partnerEmail,
        'partnerContactName': this.partnerContactName
      }
      }
    };

    this.eamsDeliveryService.saveEAMDelivery(json).subscribe((response: any) => {
      if (response && !response.error) {

        this.activeModal.close({
          continue: true
         });
        // this.next(false);
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
    if (this.appDataService.emailValidationRegx.test(emailId) === false) {
      this.invalidEmail = true;
    } else {
      this.invalidEmail = false;
    }
  }

}