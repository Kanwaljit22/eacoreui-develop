import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AddPartnerService } from './add-partner.service';
@Component({
  selector: 'app-add-partner-contact',
  templateUrl: './add-partner-contact.component.html',
  styleUrls: ['./add-partner-contact.component.scss']
})
export class AddPartnerContactComponent implements OnInit {

  firstName: any = '';
  lastName: any = '';
  cityName: any = '';
  stateName: any = '';
  countryData: any = '';
  partnerId: any = '';
  partnerEmail: any = '';
  searchData: any = [];
  searchBtn = true;
  searchedResults = true;
  addPartnerBtn = true;
  selectedPartnerTable = true;
  contactSearchedContainer: any = [];
  checkedLen: any;
  checkedPartner: any;
  toggleDoneBtn = true;
  createProposalContainer: any = [];
  cantFindContact = false;
  searchDataNoRecords = true;
  showScroll = true;
  proposalName: any;
  billingModels: any;
  focusElement: any;

  constructor(public activeModal: NgbActiveModal, public specialistService: AddPartnerService) { }

  ngOnInit() {

  }

  addContact() {
    console.log('so the eata', this.createProposalContainer);
    this.activeModal.close({
      setData: this.createProposalContainer
    });
  }

  selectedValueCountry(event) {
    this.searchBtn = false;
  }

  showFilterResults() {
    if (this.firstName === 'null') {
      this.cantFindContact = true;
      this.searchDataNoRecords = false;
      this.searchData = [];
      this.showScroll = true;
    } else {
      this.showScroll = false;
      this.cantFindContact = false;
      this.searchDataNoRecords = false;
      this.specialistService.getData()
        .subscribe(data => {
          this.searchData = data;
        });

    }
  }


  checkPartnerValidation(data) {
    if (this.firstName !== '' || this.lastName !== '' || this.cityName !== '' || this.stateName !== '' ||
    this.countryData !== '' || this.partnerId !== '' || this.partnerEmail !== '') {
      this.searchBtn = false;
    } else {
      this.searchBtn = true;
    }
  }

  contactCheckbox(object, checkedData) {
    this.checkedLen = object.filter(
      filterData => filterData.contactSearchChecked === true);
    if (this.checkedLen.length !== 0) {
      this.addPartnerBtn = false;
    } else {
      this.addPartnerBtn = true;
      this.contactSearchedContainer = [];
      this.selectedPartnerTable = true; // hide selected partner table
    }
  }

  addPartnerCheckbox(object, checkedData) {

    this.createProposalContainer = object.filter(
      filterData => filterData.checked === true);
    this.checkedPartner = object.filter(
      filterData => filterData.checked === true);
    if (this.checkedPartner.length !== 0) {
      this.toggleDoneBtn = false;
    } else {
      this.toggleDoneBtn = true;
    }
  }

  selectedPartnersData() {
    this.selectedPartnerTable = false;
    this.contactSearchedContainer = this.searchData.filter(
      filterData => filterData.contactSearchChecked === true);
  }
}
