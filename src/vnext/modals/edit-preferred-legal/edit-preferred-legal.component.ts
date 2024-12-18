import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'vnext/commons/message/message.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { VnextService } from 'vnext/vnext.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { IPreferredLegalAddress, VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { ProposalRestService } from 'vnext/proposal/proposal-rest.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';

@Component({
  selector: 'app-edit-preferred-legal',
templateUrl: './edit-preferred-legal.component.html',
  styleUrls: ['./edit-preferred-legal.component.scss'],
  providers: [MessageService]
})
export class EditPreferredLegalComponent implements OnInit {

  form: FormGroup;
  stateList = [];
  countriesList = [];
  disableUpdate = false;
  showCountryDropDown = false;
  showStatedDrop = false;
  page = 'locc';
  preferredLegal : IPreferredLegalAddress
  constructor(public activeModal: NgbActiveModal, private projectStoreService: ProjectStoreService, private messageService:MessageService, private vnextService: VnextService, public utilitiesService: UtilitiesService, private vNextStoreService: VnextStoreService, private proposalRestService: ProposalRestService, private proposalStoreService: ProposalStoreService, public localizationService:LocalizationService, private eaService: EaService, public dataIdConstantsService: DataIdConstantsService, public elementIdConstantsService: ElementIdConstantsService) { }

  ngOnInit() {
    this.eaService.getLocalizedString('edit-preferred-legal');
    if (this.page === 'locc'){
      this.form = new FormGroup({
        custPreferredName: new FormControl(this.vNextStoreService.loccDetail.customerContact && this.vNextStoreService.loccDetail.customerContact.preferredLegalName ?
          this.vNextStoreService.loccDetail.customerContact.preferredLegalName : '', [Validators.required, this.utilitiesService.noWhitespaceValidator]),
          addressLine1: new FormControl(this.vNextStoreService.loccDetail.customerContact && this.vNextStoreService.loccDetail.customerContact.preferredLegalAddress ?
            this.vNextStoreService.loccDetail.customerContact.preferredLegalAddress.addressLine1 : '', []),
          addressLine2: new FormControl(this.vNextStoreService.loccDetail.customerContact && this.vNextStoreService.loccDetail.customerContact.preferredLegalAddress && this.vNextStoreService.loccDetail.customerContact.preferredLegalAddress.addressLine2 ? this.vNextStoreService.loccDetail.customerContact.preferredLegalAddress.addressLine2 : ''),
          country: new FormControl(this.vNextStoreService.loccDetail.customerContact && this.vNextStoreService.loccDetail.customerContact.preferredLegalAddress ?
            this.vNextStoreService.loccDetail.customerContact.preferredLegalAddress.country : '', []),
          state: new FormControl(this.vNextStoreService.loccDetail.customerContact && this.vNextStoreService.loccDetail.customerContact.preferredLegalAddress ?
            this.vNextStoreService.loccDetail.customerContact.preferredLegalAddress.state : '', []),
          city: new FormControl(this.vNextStoreService.loccDetail.customerContact && this.vNextStoreService.loccDetail.customerContact.preferredLegalAddress ?
            this.vNextStoreService.loccDetail.customerContact.preferredLegalAddress.city : '', []),
          zip: new FormControl(this.vNextStoreService.loccDetail.customerContact && this.vNextStoreService.loccDetail.customerContact.preferredLegalAddress ?
            this.vNextStoreService.loccDetail.customerContact.preferredLegalAddress.zip : '', [])
        
      });
    } else {
      this.form = new FormGroup({
        custPreferredName: new FormControl(this.proposalStoreService.proposalData.customer && this.proposalStoreService.proposalData.customer.preferredLegalName ?
          this.proposalStoreService.proposalData.customer.preferredLegalName : '', [Validators.required, this.utilitiesService.noWhitespaceValidator]),
          addressLine1: new FormControl(this.preferredLegal ?
            this.preferredLegal.addressLine1 : '', []),
          addressLine2: new FormControl(this.preferredLegal && this.preferredLegal.addressLine2 ? this.preferredLegal.addressLine2 : ''),
          country: new FormControl(this.preferredLegal ?
            this.preferredLegal.country : '', []),
          state: new FormControl(this.preferredLegal ?
            this.preferredLegal.state : '', []),
          city: new FormControl(this.preferredLegal ?
            this.preferredLegal.city : '', []),
          zip: new FormControl(this.preferredLegal ?
            this.preferredLegal.zip : '', [])
        
      });
    }
    if(this.country){
      this.getCountriesListData();
     }
  }

  close() {
    this.activeModal.close();
  }

  // method to call api for updating loccCustomerContact
  updateLoccCustomerContact() {
    if (this.page === 'locc'){
      const json = {
        'data': {
  
          'preferredLegalName': this.custPreferredName.value,
          'repName': this.vNextStoreService.loccDetail.customerContact.repName,
          'repFirstName': this.vNextStoreService.loccDetail.customerContact.repFirstName,
          'repLastName': this.vNextStoreService.loccDetail.customerContact.repLastName,
          'repTitle': this.vNextStoreService.loccDetail.customerContact.repTitle,
          'repEmail': this.vNextStoreService.loccDetail.customerContact.repEmail ? this.vNextStoreService.loccDetail.customerContact.repEmail : "",
  
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

      let url = ''
        let partnerBeGeoId;
        if (this.proposalStoreService.proposalData?.objId && !this.proposalStoreService.proposalData.dealInfo?.partnerDeal){
          partnerBeGeoId = this.proposalStoreService.proposalData.partnerInfo?.beGeoId;
        } else{
          partnerBeGeoId = this.projectStoreService.projectData.partnerInfo.beGeoId;
        } 
        url = this.vnextService.getAppDomainWithContext + 'locc/customer-contact?partnerBeGeoId=' + partnerBeGeoId + '&customerGuId=' + this.projectStoreService.projectData.customerInfo.customerGuId + '&buyingProgram=' + this.projectStoreService.projectData.buyingProgram;
      


      //const url = this.vnextService.getAppDomainWithContext + 'locc/customer-contact?partnerBeGeoId=' + this.projectStoreService.projectData.partnerInfo.beGeoId + '&customerGuId=' + this.projectStoreService.projectData.customerInfo.customerGuId + '&buyingProgram=' + this.projectStoreService.projectData.buyingProgram;
      this.proposalRestService.putApiCall(url, json).subscribe((res: any) => {
        this.messageService.clear();
        if (this.vnextService.isValidResponseWithoutData(res, true)) {
          this.activeModal.close();
          this.vNextStoreService.loccDetail.customerContact.preferredLegalName = this.custPreferredName.value;
          this.vNextStoreService.loccDetail.customerContact.preferredLegalAddress.addressLine1 = this.addressLine1.value;
          this.vNextStoreService.loccDetail.customerContact.preferredLegalAddress.addressLine2 = this.addressLine2.value;
          this.vNextStoreService.loccDetail.customerContact.preferredLegalAddress.state = this.state.value;
          this.vNextStoreService.loccDetail.customerContact.preferredLegalAddress.city = this.city.value;
          this.vNextStoreService.loccDetail.customerContact.preferredLegalAddress.zip = this.zip.value;
          this.vNextStoreService.loccDetail.customerContact.preferredLegalAddress.country = this.country.value;
        } else {
          // to show error messages if any
          this.messageService.displayMessagesFromResponse(res);
        }
      });
    } else {
      const requestObj = {
        'data': {
          'accountName': this.custPreferredName.value,
          'preferredLegalName': this.custPreferredName.value,
          
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
      // add logic to update preferred legal api and close modal
      const url = this.vnextService.getAppDomainWithContext + 'proposal/'+ this.proposalStoreService.proposalData.objId +'/customer-info';
      this.proposalRestService.putApiCall(url, requestObj).subscribe((response: any) => {
        if (this.vnextService.isValidResponseWithoutData(response)){
          this.proposalStoreService.proposalData.customer.accountName = requestObj.data.accountName;
          this.proposalStoreService.proposalData.customer.preferredLegalName = requestObj.data.preferredLegalName;
          this.proposalStoreService.proposalData.customer.preferredLegalAddress = requestObj.data.preferredLegalAddress;
          this.activeModal.close();
        }
      });
    }
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

  getCountriesListData(){
    const url = this.vnextService.getAppDomainWithContext + 'proposal/country?p='+ this.projectStoreService.projectData.objId
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      this.messageService.clear();
      if (this.vnextService.isValidResponseWithData(response, true)) {
        this.countriesList = response.data.countries;
        let countryCode = ''
        for (let i = 0; i < this.countriesList.length; i++) {
          if (this.countriesList[i].countryName === this.country.value) {
            countryCode = this.countriesList[i].isoCountryAlpha2;
            break;
          }
        }
        if (countryCode) {
          this.getStateList(countryCode);
        }
      }
    });
  }

  onCountryChange(country){
    this.country.setValue(country.countryName);
    this.state.setValue('');
    this.form.markAsDirty();
    this.showCountryDropDown = false;
    this.getStateList(country.isoCountryAlpha2)
  }

  onStateChange(stateObj) {
    this.state.setValue(stateObj.state);
    this.showStatedDrop = false;
    this.form.markAsDirty();
  }

  getStateList(countryCode) { 
    const url = this.vnextService.getAppDomainWithContext + 'proposal/states?countryCode=' + countryCode
    this.stateList = [];
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      this.messageService.clear();
      if (this.vnextService.isValidResponseWithData(response, true)) {
        if (response.data) {
          this.stateList = response.data
        } else {
          this.stateList = [];
        }
      }
    });
  }
}