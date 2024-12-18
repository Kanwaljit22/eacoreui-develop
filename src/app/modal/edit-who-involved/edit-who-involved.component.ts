import { Component, OnInit, Renderer2 } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppDataService } from '../../shared/services/app.data.service';
import { MessageService } from '../../shared/services/message.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { DocumentCenterService } from '../../document-center/document-center.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WhoInvolvedService } from '@app/qualifications/edit-qualifications/who-involved/who-involved.service';
import {
  SearchCountryField,
  PhoneNumberFormat,
} from 'ngx-intl-tel-input';
import { EaService } from 'ea/ea.service';
import { IPhoneNumber } from 'ea/ea-store.service';


@Component({
  selector: 'app-edit-who-involved',
  templateUrl: './edit-who-involved.component.html',
  styles: ['span.important { color: red; }']
})
export class EditWhoInvolvedComponent implements OnInit {
  qualifiactionName = '';
  eaQualDescription = '';
  qualificationNameError = false;
  errorMessage: string;
  isUpdate = false; // this flag is use for enable and disable update button.
  initialQualName: string;
  initialDescription: string;
  custRepersentativeName: string;
  custRepersentativeEmailId: string;
  custRepersentativeTitle: string;
  isValid = true;
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
  isCustomerLegalNamePresent = true;
  custRepersentativeLegalName: string;
  companyName: string;
  // addressLine1: string;
  // addressLine2: string;
  // city: string;
  // state: string;
  // country: string;
  // zip: string;
  form: FormGroup;
  isPartnerLed = false;
  loaCustomerContact: any;
  isPriceEstimateStep = false;
  CustomerInfoIdx: any;
  isForLocc = false; // to set if modal opens from locc flyput / partner landig page to update loaCustomerRep details
  isFromPartnerLanding = false;
  stateList = []
  countryOfTransactions = []
  showAddress = false;	
  emailId: string;	
  disableButton1 = false;
  disableButton2 = false;
  invalidPhoneNoError = false;
  phoneNumberData: IPhoneNumber = {};

  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  PhoneNumberFormat = PhoneNumberFormat;
  phoneForm = new FormGroup({
    phone: new FormControl(undefined, [Validators.required]),
  });

  constructor(public localeService: LocaleService, public activeModal: NgbActiveModal, public qualService: QualificationsService,
    public appDataService: AppDataService, public messageService: MessageService, public documentCenter: DocumentCenterService,
    public renderer: Renderer2, public involvedService: WhoInvolvedService, private eaService: EaService) { }

  ngOnInit() {
    if (this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.proposalPriceEstimateStep || this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.proposalDefineSuiteStep) {
      this.isPriceEstimateStep = true;
    } else {
      this.isPriceEstimateStep = false;
    }

    if (this.isPartnerLed) {
      this.custRepersentativeLegalName = this.qualService.qualification.customerInfo.preferredLegalName;
      if (this.isPriceEstimateStep && this.loaCustomerContact) {
        this.setCustRepresentativeDataFromQual(this.loaCustomerContact);
      } else if (this.isPriceEstimateStep && !this.loaCustomerContact) { // empty the customer rep details if loaCustomercontact not peresent
        this.custRepersentativeName = "";
        this.custRepersentativeTitle = "";
        this.custRepersentativeEmailId = "";
      } else if (this.CustomerInfoIdx === 0 || this.isFromPartnerLanding || this.CustomerInfoIdx === 3 || this.CustomerInfoIdx === 5) {
        this.setCustRepresentativeDataFromQual(this.qualService.qualification.customerInfo);
      } else if (this.CustomerInfoIdx === 1 || this.CustomerInfoIdx === 4) {
        this.setCustRepresentativeDataFromQual(this.qualService.additionalCustomerContacts[0]);
      }
    } else if (this.CustomerInfoIdx === 0 || this.CustomerInfoIdx === 3 || this.CustomerInfoIdx === 5) {
      this.setCustRepresentativeDataFromDoc(0);
    } else if (this.CustomerInfoIdx === 1 || this.CustomerInfoIdx === 4) {
      this.setCustRepresentativeDataFromDoc(1);
    }

    // console.log(this.qualService.qualification);
    this.isUpdate = false;

    // Get invalid email domain
    this.appDataService.getInvalidEmail();


    if (this.isPriceEstimateStep) {
      this.form = new FormGroup({

        custRep: new FormGroup({
          custRepEmailId: new FormControl(this.custRepersentativeEmailId ?
            this.custRepersentativeEmailId : '', [Validators.email]),
          custRepName: new FormControl(this.custRepersentativeName ?
            this.custRepersentativeName : '', Validators.required),
          custRepTitle: new FormControl(this.custRepersentativeTitle ?
            this.custRepersentativeTitle : '', Validators.required),
          custRepLegalName: new FormControl(this.qualService.qualification.customerInfo ?
            this.qualService.qualification.customerInfo.preferredLegalName : '', Validators.required),
        }),
        custPreferredName: new FormControl(this.qualService.qualification.customerInfo ?
          this.qualService.qualification.customerInfo.preferredLegalName : '', Validators.required),
        addressLine1: new FormControl(this.qualService.qualification.legalInfo ?
          this.qualService.qualification.legalInfo.addressLine1 : '', Validators.required),
        addressLine2: new FormControl(this.qualService.qualification.legalInfo ? this.qualService.qualification.legalInfo.addressLine2 : ''),
        country: new FormControl(this.qualService.qualification.legalInfo ?
          this.qualService.qualification.legalInfo.country : '', Validators.required),
        state: new FormControl(this.qualService.qualification.legalInfo ?
          this.qualService.qualification.legalInfo.state : '', Validators.required),
        city: new FormControl(this.qualService.qualification.legalInfo ?
          this.qualService.qualification.legalInfo.city : '', Validators.required),
        zip: new FormControl(this.qualService.qualification.legalInfo ?
          this.qualService.qualification.legalInfo.zip : '', Validators.required),
        affiliateName: new FormControl(this.qualService.qualification.customerInfo.affiliateNames)
      });
    } else if (this.CustomerInfoIdx === 0 || this.isFromPartnerLanding || this.CustomerInfoIdx === 3 || this.CustomerInfoIdx === 5) {
      this.setcustRepFormData(this.qualService.qualification.customerInfo);
    }
    else if (this.CustomerInfoIdx === 1 || this.CustomerInfoIdx === 4) {
      this.setcustRepFormData(this.qualService.additionalCustomerContacts[0]);
    } else if (this.CustomerInfoIdx === 2) {
      this.form = new FormGroup({
        custRep: new FormGroup({
          custRepLegalName: new FormControl(this.qualService.additionalCustomerContacts ?
            this.qualService.additionalCustomerContacts[0].preferredLegalName : '', Validators.required),
          custRepEmailId: new FormControl(this.qualService.additionalCustomerContacts ?
            this.qualService.additionalCustomerContacts[0].repEmail : '', [Validators.email]),
          custRepName: new FormControl(this.qualService.additionalCustomerContacts ?
            this.qualService.additionalCustomerContacts[0].repName : '', Validators.required),
          custRepTitle: new FormControl(this.qualService.additionalCustomerContacts ?
            this.qualService.additionalCustomerContacts[0].repTitle : '', Validators.required)
        }),
        custPreferredName: new FormControl(this.qualService.additionalCustomerContacts ?
          this.qualService.additionalCustomerContacts[0].preferredLegalName : '', Validators.required),

      });
    }
    if (this.appDataService.userInfo.roSuperUser && !this.appDataService.isReadWriteAccess) {
      this.checkRoSuperUser();
    } else if(this.country){

      if(this.CustomerInfoIdx === 0 || this.isForLocc) {
            this.getCountryOfTransactions();
      }
    }
  }

  checkRoSuperUser() {
    this.name.disable();
    this.email.disable();
    this.title.disable();
    this.custPreferredName.disable();
    this.addressLine1.disable();
    this.addressLine2.disable();
    this.country.disable();
    this.state.disable();
    this.city.disable();
    this.zip.disable();
    this.affiliateName.disable();
  }


  get name() {
    return this.form.get('custRep.custRepName');
  }

  get legalname() {
    return this.form.get('custRep.custRepLegalName');
  }

  get email() {
    return this.form.get('custRep.custRepEmailId');
  }

  get title() {
    return this.form.get('custRep.custRepTitle');
  }

  get custPreferredName() {
    return this.form.get('custPreferredName');
  }

  get addressLine1() {
    return this.form.get('addressLine1');
  }

  get addressLine2() {
    return this.form.get('addressLine2');
  }

  get country() {
    return this.form.get('country');
  }
  get state() {
    return this.form.get('state');
  }
  get city() {
    return this.form.get('city');
  }
  get zip() {
    return this.form.get('zip');
  }

  get affiliateName() {
    return this.form.get('affiliateName');
  }

  get phone(){
    return this.phoneForm.get('phone');
  }

  updateCustomerContact() {
    if(this.phoneForm.get('phone').invalid){
      this.invalidPhoneNoError = true;
      return;
    } else {
      this.invalidPhoneNoError = false;

    }
    if (this.isPartnerLed) {

      const json = {
        'data': {

          'preferredLegalName': this.custPreferredName.value,
          'repName': this.name.value,
          'repFirstName': this.qualService.qualification.customerInfo.repFirstName,
          'repLastName': this.qualService.qualification.customerInfo.repLastName,
          'repTitle': this.title.value,
          'repEmail': this.email.value ? this.email.value : "",	
          'phoneNumber': this.eaService.getPhoneNumber(this.phone.value.e164Number ,this.phone.value.dialCode),
          'phoneCountryCode': this.phone.value.dialCode,
          'dialFlagCode': this.phone.value.countryCode,
          'preferredLegalAddress': {
            'addressLine1': this.addressLine1.value,
            'addressLine2': this.addressLine2.value,
            'city': this.city.value,
            'state': this.state.value,
            'zip': this.zip.value,
            'country': this.country.value
          },
        }
      };

      this.documentCenter.updateFromLOAWhoInvolvedModal(json).subscribe((response: any) => {

        this.activeModal.close();

        this.custRepersentativeLegalName = this.custPreferredName.value;
        this.custRepersentativeName = this.name.value;
        this.custRepersentativeTitle = this.title.value;
        this.custRepersentativeEmailId = this.email.value;

        if (!this.isPriceEstimateStep) {
          this.qualService.qualification.customerInfo.repName = this.custRepersentativeName;
          this.qualService.qualification.customerInfo.repTitle = this.custRepersentativeTitle;
          this.qualService.qualification.customerInfo.repEmail = this.custRepersentativeEmailId;
          this.qualService.qualification.customerInfo.phoneNumber = json.data.phoneNumber;
          this.qualService.qualification.customerInfo.phoneCountryCode = json.data.phoneCountryCode;
          this.qualService.qualification.customerInfo.dialFlagCode = json.data.dialFlagCode;
        }

        this.qualService.qualification.customerInfo.preferredLegalName = this.custPreferredName.value;
        this.qualService.qualification.legalInfo.addressLine1 = this.addressLine1.value;
        this.qualService.qualification.legalInfo.addressLine2 = this.addressLine2.value;
        this.qualService.qualification.legalInfo.city = this.city.value;
        this.qualService.qualification.legalInfo.country = this.country.value;
        this.qualService.qualification.legalInfo.state = this.state.value;
        this.qualService.qualification.legalInfo.zip = this.zip.value;

        if (response && !response.error) {
          if (response.data && response.data.customerContact) {
            this.qualService.loaCustomerContactUpdateEmitter.emit(response.data.customerContact);
          }
        } else {
          this.messageService.displayMessagesFromResponse(response);
        }
      });

    } else {

      const json = {
        // 'userId': this.appDataService.userId,
        'qualId': this.qualService.qualification.qualID,
        'customerContact': {
          'accountName': this.custPreferredName.value,
          'repName': this.name.value,
          'preferredLegalName': this.custPreferredName.value,
          'preferredLegalAddress': {
            'addressLine1': this.addressLine1.value,
            'addressLine2': this.addressLine2.value,
            'city': this.city.value,
            'state': this.state.value,
            'zip': this.zip.value,
            'country': this.country.value
          },
          'repTitle': this.title.value,
          'repEmail': this.email.value ? this.email.value : ""	,
          'phoneNumber': this.eaService.getPhoneNumber(this.phone.value.e164Number ,this.phone.value.dialCode),
          'phoneCountryCode': this.phone.value.dialCode,
          'dialFlagCode': this.phone.value.countryCode,
        }
      };
      this.documentCenter.updateFromWhoInvolvedModal(json).subscribe((res: any) => {
        this.qualService.qualification.customerInfo = {
          'accountName': '',
          'address': '',
          'smartAccount': '',
          'preferredLegalName': '',
          'scope': '',
          'affiliateNames': '',
          'repName': '',
          'repTitle': '',
          'repEmail': '',
          'filename': '',
          'repFirstName': '',
          'repLastName': '',
          'phoneCountryCode':'',
          'dialFlagCode': '',
          'phoneNumber':''

        };
        this.qualService.qualification.legalInfo = {
          'addressLine1': '',
          'addressLine2': '',
          'city': '',
          'country': '',
          'state': '',
          'zip': ''
        };
        if (res && !res.error) {
          // this.custRepersentativeLegalName = this.documentCenter.documentCenterData[0].representativeContainer[0][0].data =
          // this.custPreferredName.value;
          this.custRepersentativeName = this.documentCenter.documentCenterData[0].representativeContainer[0][0].data = this.name.value;
          this.custRepersentativeTitle = this.documentCenter.documentCenterData[0].representativeContainer[0][1].data = this.title.value;
          this.custRepersentativeEmailId = this.documentCenter.documentCenterData[0].representativeContainer[0][2].data = this.email.value;

          this.documentCenter.documentCenterData[0].representativeContainer[0][3].data = this.qualService.qualification.customerInfo.phoneNumber = this.eaService.getPhoneNumber(this.phone.value.e164Number ,this.phone.value.dialCode);
          this.documentCenter.documentCenterData[0].representativeContainer[0][4].data = this.qualService.qualification.customerInfo.phoneCountryCode = this.phone.value.dialCode;
          this.documentCenter.documentCenterData[0].representativeContainer[0][5].data = this.qualService.qualification.customerInfo.dialFlagCode = this.phone.value.countryCode;

          this.qualService.qualification.customerInfo.repName = this.custRepersentativeName;
          this.qualService.qualification.customerInfo.repTitle = this.custRepersentativeTitle;
          this.qualService.qualification.customerInfo.repEmail = this.custRepersentativeEmailId;

          this.qualService.qualification.customerInfo.preferredLegalName = this.custPreferredName.value;
          this.qualService.qualification.legalInfo.addressLine1 = this.addressLine1.value;
          this.qualService.qualification.legalInfo.addressLine2 = this.addressLine2.value;
          this.qualService.qualification.legalInfo.city = this.city.value;
          this.qualService.qualification.legalInfo.country = this.country.value;
          this.qualService.qualification.legalInfo.state = this.state.value;
          this.qualService.qualification.legalInfo.zip = this.zip.value;

          this.documentCenter.editCustRepEdit$.next(true);
          this.activeModal.close();
        } else {
          this.messageService.displayMessagesFromResponse(res);
        }
      });
    }
  }

  addAdditionalCustomerContact() {

     if (this.name.value.trim().length ===0 || this.title.value.trim().length === 0){	
      return;	
    }
    if(this.phoneForm.get('phone').invalid){
      this.invalidPhoneNoError = true;
      return;
    } else {
      this.invalidPhoneNoError = false;
    }

  if(this.CustomerInfoIdx === 2) {	

    const json = {
      "data": {
        'repName': this.name.value,
        'repTitle': this.title.value,
        'repEmail': this.email.value,
        'phoneNumber': this.eaService.getPhoneNumber(this.phone.value.e164Number ,this.phone.value.dialCode),
        'phoneCountryCode': this.phone.value.dialCode,
        'dialFlagCode': this.phone.value.countryCode,
      }
    };
    this.documentCenter.addCustomerContact(json).subscribe((res: any) => {
      this.qualService.additionalCustomerContacts = [{
        'accountName': '',
        'address': '',
        'smartAccount': '',
        'preferredLegalName': '',
        'scope': '',
        'affiliateNames': '',
        'repName': '',
        'repTitle': '',
        'repEmail': '',
        'filename': '',
        'repFirstName': '',
        'repLastName': '',
        'id':'',
        'phoneNumber':'',
        'phoneCountryCode': '',
        'dialFlagCode': '',
      }];
      this.documentCenter.documentCenterData[0].representativeContainer[1] = [
        {
          'heading': 'NAME',
          'data': ''
        },
        {
          'heading': 'TITLE',
          'data': ''
        },
        {
          'heading': 'EMAIL',
          'data': ''
        }
        ,{
          'heading': 'phoneNumber',
          'data': ''
        },{
          'heading': 'phoneCountryCode',
          'data': ''
        },{
          'heading': 'dialFlagCode',
          'data': ''
        }
      ];
      this.setAdditionalCustomerContactData(res);
    });
  } else {
      this.updateCustomerContact();	
  }
  }

  updateAdditionalCustomerContact() {
    const json = {
      "data": {
        'id': this.qualService.additionalCustomerContacts[0].id,
        'repName': this.name.value,
        'repTitle': this.title.value,
        'repEmail': this.email.value ? this.email.value : "",
        'phoneNumber': this.eaService.getPhoneNumber(this.phone.value.e164Number ,this.phone.value.dialCode),
        'phoneCountryCode': this.phone.value.dialCode,
        'dialFlagCode': this.phone.value.countryCode,
      }
    };
    this.documentCenter.updateCustomerContact(json).subscribe((res: any) => {
      this.setAdditionalCustomerContactData(res);
    });
  }

  getCountryOfTransactions() {
    this.involvedService.getCountryOfTransactions(this.qualService.qualification.qualID).subscribe((response: any) => {
      if (response && !response.error) {
        try {
          this.countryOfTransactions = response.countries;
            let countryCode = ''
            for (let i = 0; i < this.countryOfTransactions.length; i++) {
              if (this.countryOfTransactions[i].countryName === this.country.value) {
                countryCode = this.countryOfTransactions[i].isoCountryAlpha2;
                break;
              }
            }
            if (countryCode) {
              this.getStateList(countryCode);
            }
          
        } catch (error) {
          this.messageService.displayUiTechnicalError(error);
        }
      }
      else {
        this.messageService.displayMessagesFromResponse(response);
      }
    })
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

  focusInput(val) {
    const element = this.renderer.selectRootElement('#' + val);
    element.focus();
  }

  setCustRepresentativeDataFromQual(qualData) {
    this.custRepersentativeName = qualData.repName;
    this.custRepersentativeTitle = qualData.repTitle;
    this.custRepersentativeEmailId = qualData.repEmail;
    this.preparePhoneValue(qualData)
  }
  setCustRepresentativeDataFromDoc(index) {
    // this.custRepersentativeLegalName = this.documentCenter.documentCenterData[0].representativeContainer[index][0].data;
    this.custRepersentativeName = this.documentCenter.documentCenterData[0].representativeContainer[index][0].data;
    this.custRepersentativeTitle = this.documentCenter.documentCenterData[0].representativeContainer[index][1].data;
    this.custRepersentativeEmailId = this.documentCenter.documentCenterData[0].representativeContainer[index][2].data;
    this.phoneNumberData.number = this.documentCenter.documentCenterData[0].representativeContainer[index][3].data
    this.phoneNumberData.dialCode = this.documentCenter.documentCenterData[0].representativeContainer[index][4].data
    this.phoneNumberData.countryCode = this.documentCenter.documentCenterData[0].representativeContainer[index][5].data
    this.phoneNumberData.e164Number = this.phoneNumberData.dialCode + this.phoneNumberData.number;
    this.phone.setValue(this.phoneNumberData);
  }
  setcustRepFormData(qualServiceData) {
    this.form = new FormGroup({

      custRep: new FormGroup({
        custRepEmailId: new FormControl(qualServiceData ?
          qualServiceData.repEmail : '', [Validators.email]),
        custRepName: new FormControl(qualServiceData ?
          qualServiceData.repName : '', Validators.required),
        custRepTitle: new FormControl(qualServiceData ?
          qualServiceData.repTitle : '', Validators.required),
        custRepLegalName: new FormControl(this.qualService.qualification.customerInfo ?
          this.qualService.qualification.customerInfo.preferredLegalName : '', Validators.required),
      }),
      custPreferredName: new FormControl(this.qualService.qualification.customerInfo ?
        this.qualService.qualification.customerInfo.preferredLegalName : '', Validators.required),
      addressLine1: new FormControl(this.qualService.qualification.legalInfo ?
        this.qualService.qualification.legalInfo.addressLine1 : '', Validators.required),
      addressLine2: new FormControl(this.qualService.qualification.legalInfo ? this.qualService.qualification.legalInfo.addressLine2 : ''),
      country: new FormControl(this.qualService.qualification.legalInfo ?
        this.qualService.qualification.legalInfo.country : '', Validators.required),
      state: new FormControl(this.qualService.qualification.legalInfo ?
        this.qualService.qualification.legalInfo.state : '', Validators.required),
      city: new FormControl(this.qualService.qualification.legalInfo ?
        this.qualService.qualification.legalInfo.city : '', Validators.required),
      zip: new FormControl(this.qualService.qualification.legalInfo ?
        this.qualService.qualification.legalInfo.zip : '', Validators.required),
      affiliateName: new FormControl(this.qualService.qualification.customerInfo.affiliateNames)
    });
      this.preparePhoneValue()
  }
  setAdditionalCustomerContactData(res) {
    if (res && !res.error) {
      this.custRepersentativeName = this.documentCenter.documentCenterData[0].representativeContainer[1][0].data = this.name.value;
      this.custRepersentativeTitle = this.documentCenter.documentCenterData[0].representativeContainer[1][1].data = this.title.value;
      this.custRepersentativeEmailId = this.documentCenter.documentCenterData[0].representativeContainer[1][2].data = this.email.value;
      this.documentCenter.documentCenterData[0].representativeContainer[1][3].data = this.qualService.additionalCustomerContacts[0].phoneNumber = this.eaService.getPhoneNumber(this.phone.value.e164Number ,this.phone.value.dialCode);
      this.documentCenter.documentCenterData[0].representativeContainer[1][4].data = this.qualService.additionalCustomerContacts[0].phoneCountryCode = this.phone.value.dialCode;
      this.documentCenter.documentCenterData[0].representativeContainer[1][5].data = this.qualService.additionalCustomerContacts[0].dialFlagCode = this.phone.value.countryCode;
      this.qualService.additionalCustomerContacts[0].repName = this.name.value;
      this.qualService.additionalCustomerContacts[0].repTitle = this.title.value;
      this.qualService.additionalCustomerContacts[0].repEmail = this.email.value;
      this.documentCenter.editCustRepEdit$.next(true);
      this.activeModal.close();
    } else {
      this.messageService.displayMessagesFromResponse(res);
    }
  }

  onCOTChange(cot) {
    this.country.setValue(cot.countryName);
    this.state.setValue('');
    this.form.markAsDirty();
    this.getStateList(cot.isoCountryAlpha2)
  }

  onStateChange(stateObj) {
    this.state.setValue(stateObj.state);
    this.form.markAsDirty();
  }
  getStateList(countryCode) {
    this.involvedService.getStateList(countryCode).subscribe((response: any) => {
      if (response && !response.error) {
        try {
          if (response.data) {
            this.stateList = response.data
          } else {
            this.stateList = []
          }

        } catch (error) {
          this.stateList = []
          this.messageService.displayUiTechnicalError(error);
        }
      }
      else {
        this.messageService.displayMessagesFromResponse(response);
      }
    })
  }

  preparePhoneValue(customerData?){
    // if(this.qualService.qualification.customerInfo.phoneNumber || 1===1){
    //   this.phoneNumber.number = '6137901111'//this.qualService.qualification.customerInfo.phoneNumber
    //   this.phoneNumber.dialCode = '+1'//this.qualService.qualification.customerInfo.phoneCountryCode
    //   this.phoneNumber.e164Number = this.phoneNumber.dialCode + this.phoneNumber.number;
    //   this.phoneNumber.countryCode = 'CA'
    // }
    if(customerData){
      this.phoneNumberData.number = customerData.phoneNumber
      this.phoneNumberData.dialCode = customerData.phoneCountryCode
      this.phoneNumberData.e164Number = this.phoneNumberData.dialCode + this.phoneNumberData.number;
      this.phoneNumberData.countryCode = customerData.dialFlagCode;
    }
    this.phone.setValue(this.phoneNumberData)
  }

}
