import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'vnext/commons/message/message.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { VnextService } from 'vnext/vnext.service';
import { IPreferredLegalAddress, VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { ICustomerReps, ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { ProposalRestService } from 'vnext/proposal/proposal-rest.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaService } from 'ea/ea.service';
import { LocalizationEnum } from 'ea/commons/enums/localizationEnum';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { IPhoneNumber } from 'ea/ea-store.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';

@Component({
  selector: 'app-edit-customer-representative',
  templateUrl: './edit-customer-representative.component.html',
  styleUrls: ['./edit-customer-representative.component.scss'],
  providers: [MessageService]
})
export class EditCustomerRepresentativeComponent implements OnInit {

  form: FormGroup;
  custRepersentativeName: string;
  custRepersentativeEmailId: string;
  custRepersentativeTitle: string;
  invalidDomain = false;
  invalidEmail = false;
  disableButton = false;
  isEmailEmpty = true; //set if email is empty
  preferredLegalAddress: IPreferredLegalAddress = {}
  invalidDomainErrorMessage = this.localizationService.getLocalizedString('edit-customer-representative.PERSONAL_DOMAIN_ADDRESS');
  readonly invalidEmailFormateMessage = this.localizationService.getLocalizedString('common.INVALID_EMAIL_ID');
  readonly emailValidationRegx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,20})+$/;
  page = 'locc';
  type = 'update';
  customerRepDetails: ICustomerReps
  SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  phoneNumber: IPhoneNumber = {};
  constructor(public activeModal: NgbActiveModal, public projectStoreService: ProjectStoreService, public renderer: Renderer2, 
    private messageService: MessageService, private vNextService: VnextService, private vNextStoreService: VnextStoreService, 
    private utilitiesService: UtilitiesService, private proposalStoreService: ProposalStoreService, private proposalRestService: 
    ProposalRestService ,public localizationService:LocalizationService, public eaService: EaService, public dataIdConstantsService: DataIdConstantsService, 
    public elementIdConstantsService: ElementIdConstantsService, public constantsService: ConstantsService) { }

  ngOnInit() {
    this.eaService.getLocalizedString('edit-customer-representative');
    this.eaService.localizationMapUpdated.subscribe((key: any) => {
      if (key === 'edit-customer-representative'|| key === LocalizationEnum.all){
        this.invalidDomainErrorMessage = this.localizationService.getLocalizedString('edit-customer-representative.PERSONAL_DOMAIN_ADDRESS');
      }
    });
    if (this.page === 'locc'){
      if (this.vNextStoreService.loccDetail.customerContact) {
        this.setCustRepresentativeData(this.vNextStoreService.loccDetail.customerContact);
        this.preferredLegalAddress = this.vNextStoreService.loccDetail.customerContact.preferredLegalAddress;
      } else {
        this.emptyCustomerRep();
      }
    } else {
      if (this.customerRepDetails && this.type === 'update') {
        this.setCustRepresentativeData(this.customerRepDetails);
      } else {
        if (!this.proposalStoreService.proposalData.customer.customerReps) {
          this.proposalStoreService.proposalData.customer.customerReps = [];
        }
        this.emptyCustomerRep();
      }
    }

    this.form = new FormGroup({
      custRep: new FormGroup({
        custRepEmailId: new FormControl(this.custRepersentativeEmailId ?
          this.custRepersentativeEmailId : '', [Validators.email, this.utilitiesService.noWhitespaceValidator]),
        custRepName: new FormControl(this.custRepersentativeName ?
          this.custRepersentativeName : '', [Validators.required, this.utilitiesService.noWhitespaceValidator]),
        custRepTitle: new FormControl(this.custRepersentativeTitle ?
          this.custRepersentativeTitle : '', [Validators.required, this.utilitiesService.noWhitespaceValidator]),
          phone: new FormControl(this.phoneNumber, [Validators.required])
      }),
    });

    if(this.page === this.constantsService.CUSTOMER_REP){
      const phone = this.form.get('custRep.phone');
      phone.clearValidators()
    }
    if(this.custRepersentativeEmailId){
      this.isEmailEmpty = false;
    }
    this.vNextService.getInvalidEmailDomains(); // get invalidEmails list
  }

  // set customerRep details
  setCustRepresentativeData(customerContact) {
    if (this.page === 'locc'){
      this.custRepersentativeName = customerContact.repName;
      this.custRepersentativeTitle = customerContact.repTitle;
      this.custRepersentativeEmailId = customerContact.repEmail;
    } else {
      this.custRepersentativeName = customerContact.name;
      this.custRepersentativeTitle = customerContact.title;
      this.custRepersentativeEmailId = customerContact.email;
    }
    // set the phone number from customer contact
    this.preparePhoneValue(customerContact);
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

  get contactNumber(){
    return this.form.get('custRep.phone');
  }

  close() {
    this.activeModal.close();
  }

  // method to validate title
  titleValidation() {

    this.disableButton = false;
    if (this.title.value.trim().length === 0) {
      this.disableButton = true;
    }
  }

  // method to validate name
  nameValidation() {

    this.disableButton = false;
    if (this.name.value.trim().length === 0) {
      this.disableButton = true;
    }
  }

  // method to validate email
  emailValidation() {

    var emailId = this.email.value;
    this.invalidDomain = false;
    this.invalidEmail = false;
    this.isEmailEmpty = false;

    if (!emailId) {
      this.isEmailEmpty = true;
      return;
    }
    if (this.emailValidationRegx.test(emailId) === false) {
      this.invalidEmail = true;
    } else {
      this.invalidEmail = false;
      this.domainValidation(emailId);
    }
  }
  //  for validating domain
  domainValidation(emailId) {

    const domain = emailId.substring(emailId.indexOf('@') + 1, emailId.indexOf('.')); //  get the domain name from the emailId.
    const isDomainValid = this.vNextStoreService.invalidDomains.indexOf(domain) !== -1 ? false : true;

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

  // method to call api for updating loccCustomerContact
  updateLoccCustomerContact() {
    if (this.page === 'locc') {
      const phoneNumber = this.eaService.getPhoneNumber(this.contactNumber?.value?.e164Number,this.contactNumber?.value?.dialCode);
      const json = {
        'data': {
  
          'preferredLegalName': this.vNextStoreService.loccDetail.customerContact.preferredLegalName,
          'repName': this.name.value,
          'repFirstName': this.vNextStoreService.loccDetail.customerContact.repFirstName,
          'repLastName': this.vNextStoreService.loccDetail.customerContact.repLastName,
          'repTitle': this.title.value,
          'repEmail': this.email.value ? this.email.value : "",
          "phoneNumber": phoneNumber,
          "phoneCountryCode": this.contactNumber?.value?.dialCode,
          "dialFlagCode": this.contactNumber?.value?.countryCode,
  
          'preferredLegalAddress': {
            'addressLine1': this.preferredLegalAddress.addressLine1,
            'addressLine2': this.preferredLegalAddress.addressLine2,
            'city': this.preferredLegalAddress.city,
            'state': this.preferredLegalAddress.state,
            'zip': this.preferredLegalAddress.zip,
            'country': this.preferredLegalAddress.country
          },
        }
      };

      let url = ''
        let partnerBeGeoId;
        if (this.proposalStoreService.proposalData?.objId && !this.proposalStoreService.proposalData.dealInfo?.partnerDeal){
          partnerBeGeoId = this.proposalStoreService.proposalData.partnerInfo?.beGeoId;
        } else{
          partnerBeGeoId = this.projectStoreService.projectData.partnerInfo.beGeoId;
        } 
        url = this.vNextService.getAppDomainWithContext + 'locc/customer-contact?partnerBeGeoId=' + partnerBeGeoId + '&customerGuId=' + this.projectStoreService.projectData.customerInfo.customerGuId + '&buyingProgram=' + this.projectStoreService.projectData.buyingProgram;
      

     // const url = this.vNextService.getAppDomainWithContext + 'locc/customer-contact?partnerBeGeoId=' + this.projectStoreService.projectData.partnerInfo.beGeoId + '&customerGuId=' + this.projectStoreService.projectData.customerInfo.customerGuId + '&buyingProgram=' + this.projectStoreService.projectData.buyingProgram;
      this.proposalRestService.putApiCall(url ,json).subscribe((res: any) => {
        this.messageService.clear();
        if (this.vNextService.isValidResponseWithoutData(res, true)) {
          this.vNextStoreService.loccDetail.customerContact.repName = this.name.value;
          this.vNextStoreService.loccDetail.customerContact.repTitle = this.title.value;
          this.vNextStoreService.loccDetail.customerContact.repEmail = this.email.value;
          this.vNextStoreService.loccDetail.customerContact.phoneNumber = phoneNumber;
          this.vNextStoreService.loccDetail.customerContact.dialFlagCode = this.contactNumber?.value?.countryCode;
          this.vNextStoreService.loccDetail.customerContact.phoneCountryCode = this.contactNumber?.value?.dialCode;
          this.activeModal.close(true);
        } else {
          // to show error messages if any
          this.messageService.displayMessagesFromResponse(res);
        }
      });
    } else {
      const reqJson = {
        "data": [
          {
            "title": this.title.value,
            "name": this.name.value,
            "email": this.email.value,
            "phoneNumber": this.eaService.getPhoneNumber(this.contactNumber?.value?.e164Number,this.contactNumber?.value?.dialCode),
            "phoneCountryCode": this.contactNumber?.value?.dialCode,
            "dialFlagCode": this.contactNumber?.value?.countryCode
          }
        ]
      }
      if(this.page === 'multiPartner'){
        this.activeModal.close({continue: true, reqJson: reqJson});
      } else {
        const url = this.vNextService.getAppDomainWithContext + 'proposal/'+ this.proposalStoreService.proposalData.objId + '/customer-reps'
        if (this.type === 'update'){
          reqJson.data[0]['id'] = this.customerRepDetails.id;
          this.proposalRestService.putApiCall(url, reqJson).subscribe((response: any) => {
            if (this.vNextService.isValidResponseWithData(response)){
              this.activeModal.close(true);
              this.custRepersentativeTitle = this.title.value;
              this.custRepersentativeEmailId = this.email.value;
              this.custRepersentativeName = this.name.value;
              this.setCustomerRepForDocCenter(response.data[0])
            }
          });
        } else {
          this.proposalRestService.postApiCall(url, reqJson).subscribe((response: any) => {
            if (this.vNextService.isValidResponseWithData(response)){
              this.custRepersentativeTitle  = this.title.value;
              this.custRepersentativeEmailId = this.email.value;
              this.custRepersentativeName = this.name.value;
              // set the phone number from customer contact
              this.preparePhoneValue(response.data[0]);
              // this.phone.setValue(this.phoneNumber);
              // this.customerRepDetails.id = response.data[0].id
              this.setCustomerRepForDocCenter(response.data[0]);
              this.activeModal.close();
            }
          });
        }
      }
    }
  }

  //method to empty customerRep details
  emptyCustomerRep() {
    this.custRepersentativeName = "";
    this.custRepersentativeTitle = "";
    this.custRepersentativeEmailId = "";
    this.phoneNumber = {}
  }

  setCustomerRepForDocCenter(customer){
    if (this.type === 'add'){
      this.proposalStoreService.proposalData.customer.customerReps.push(customer);
    } else {
      let customerIds = []
      if (this.proposalStoreService.proposalData.customer.customerReps.length){
        customerIds = this.proposalStoreService.proposalData.customer.customerReps.map(data => data.id)
      }
      for(let i = 0; i < this.proposalStoreService.proposalData.customer.customerReps.length; i++) {
        if (customer.id === this.proposalStoreService.proposalData.customer.customerReps[i].id){
          this.proposalStoreService.proposalData.customer.customerReps[i] = customer;
        }
      }
    }
  }

  // set the phone number from customer contact
  preparePhoneValue(customerContact){
    if(customerContact.phoneNumber){
      this.phoneNumber.number = customerContact.phoneNumber
      this.phoneNumber.dialCode = customerContact.phoneCountryCode
      this.phoneNumber.e164Number = this.phoneNumber.dialCode + this.phoneNumber.number;
      this.phoneNumber.countryCode = customerContact.dialFlagCode;
    }
  }
}
