import { Component, OnInit, Renderer2 } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppDataService } from '../../shared/services/app.data.service';
import { MessageService } from '../../shared/services/message.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { DocumentCenterService } from '../../document-center/document-center.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IPhoneNumber } from 'ea/ea-store.service';
import {
  SearchCountryField,
  CountryISO,
  PhoneNumberFormat,
} from 'ngx-intl-tel-input';
import { EaService } from 'ea/ea.service';
@Component({
  selector: 'app-edit-partner',
  templateUrl: './edit-partner.component.html',
  styles: ['span.important { color: red; }']
})
export class EditPartnerComponent implements OnInit {
  qualifiactionName = '';
  eaQualDescription = '';
  qualificationNameError = false;
  errorMessage: string;
  isUpdate = false; // this flag is use for enable and disable update button.
  custRepersentativeName: string;
  custRepersentativeEmailId: string;
  custRepersentativeTitle: string;
  isDomainValid = true;
  readonly invalidDomainErrorMessage = 'Personal domain address Restricted';
  readonly invalidEmailFormateMessage = 'Invalid Email Id';
  readonly requiredErrorMessage = 'This is required field';
  emailValidationRegx = new RegExp('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9]+\.[a-zA-Z0-9-.]+$');
  invalidEmailErrorMessage = 'Invalid Email Id';
  invalidDomain = false;
  invalidEmail = false;
  isCustomerNamePresent = true;
  isTitlePresent = true;
  isEmailPresent = true;
  erroMessageEmail = '';
  form: FormGroup;
  CustomerInfoIdx: any;
  emailId: string;
  emailNotEntered = true;
  disableButton1 = false;
  disableButton2 = false;
  contactDetails: IPhoneNumber = {}
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;

  constructor(public localeService: LocaleService, public activeModal: NgbActiveModal, public qualService: QualificationsService,
    public appDataService: AppDataService, public messageService: MessageService, public documentCenter: DocumentCenterService,
    public renderer: Renderer2, private eaService:EaService) { }

  ngOnInit() {

  this.form = new FormGroup({
        custRep: new FormGroup({
          custRepEmailId: new FormControl(this.custRepersentativeEmailId ?
            this.custRepersentativeEmailId : '', [Validators.email]),
          custRepName: new FormControl(this.custRepersentativeName ?
            this.custRepersentativeName : '', Validators.required),
          custRepTitle: new FormControl(this.custRepersentativeTitle ?
            this.custRepersentativeTitle : '', Validators.required),
            phone: new FormControl(this.contactDetails, Validators.required)
   })
  });
  }

  checkRoSuperUser() {
    this.name.disable();
    this.email.disable();
    this.title.disable();
  }

  get name() {
    return this.form.get('custRep.custRepName');
  }


  get email() {
    return this.form.get('custRep.custRepEmailId');
  }

  get title() {
    return this.form.get('custRep.custRepTitle');
  }

  get phone() {
    return this.form.get('custRep.phone');
  }


  focusInput(val) {
    const element = this.renderer.selectRootElement('#' + val);
    element.focus();
  }

nameValidation() {

  this.disableButton1 = false;
  if (this.name.value.trim().length === 0) {
        this.disableButton1 = true;
  }
}


titleValidation() {
    
  this.disableButton2 = false;
   if (this.title.value.trim().length === 0) {
         this.disableButton2 = true;
  }
}

    emailValidation() {

    var emailId  = this.email.value;
    this.invalidDomain = false;
    this.invalidEmail = false;

    if (!emailId) {
      return;
    }
    if (this.appDataService.emailValidationRegx.test(emailId) === false) {
      this.invalidEmail  = true;
    } else {
      this.invalidEmail  = false;
      this.domainValidation(emailId);
    }
  }
  //  for validating domain
  domainValidation(emailId) {

    const domain = emailId.substring(emailId.indexOf('@') + 1, emailId.indexOf('.')); //  get the domain name from the emailId.
    const isDomainValid = this.appDataService.invalidDomains.indexOf(domain) !== -1 ? false : true;

    if (isDomainValid) {
      this.invalidDomain = false;
    } else {
      this.invalidDomain = true;
    }
  }
 
  updatePartner() {
    
  if (this.name.value.trim().length ===0 || this.title.value.trim().length === 0){	
      return;	
    }

     this.activeModal.close({
      continue: true,
      name:  this.name.value,
      title : this.title.value,
      email : this.email.value,
      phoneNumber: this.eaService.getPhoneNumber(this.phone.value.e164Number,this.phone.value.dialCode),
      phoneCountryCode:this.phone.value.dialCode,
      dialFlagCode: this.phone.value.countryCode
    });
  }

  addPartner() {

    if (this.name.value.trim().length ===0 || this.title.value.trim().length === 0 || !this.phone.value){	
      return;	
    }

    
    this.activeModal.close({
      continue: true,
      name: this.name.value,
      title : this.title.value,
      email : this.email.value,
      phoneNumber: this.eaService.getPhoneNumber(this.phone.value.e164Number,this.phone.value.dialCode),
      phoneCountryCode:this.phone.value.dialCode,
      dialFlagCode: this.phone.value.countryCode
    });
  }


  

}
