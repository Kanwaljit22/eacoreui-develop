import { FiltersService } from './../../dashboard/filters/filters.service';
import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { SelectedFilterJson } from './../../dashboard/filters/filters.service';

@Component({
  selector: 'app-view-applied-filters',
  templateUrl: './view-applied-filters.component.html',
  styleUrls: ['./view-applied-filters.component.scss']
})
export class ViewAppliedFiltersComponent implements OnInit {

  appliedFilters: any = [];
  selectedCategories = [];
  headerCategoryCheck = false;
  isSaveDisabled = true;
  countFilter = 0;
  disableHeaderCheck = false;
  disableClear = false;
  getCount = 0;

  constructor(public activeModal: NgbActiveModal, private modalVar: NgbModal, public filtersService: FiltersService) {

  }

  ngOnInit() {
    this.appliedFilters = this.filtersService.updatedFilterMap;
    console.log('IN VIEW APPLIE FILTERS  ::: ');
    this.appliedFilters.forEach(element => {
      console.log('display name :::  ' + element.displayName);
      this.countFilter += 1;
    });
    this.getCount = this.filtersService.getFiltersCount();
  }

  closeModal() {
    this.activeModal.close({
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  clearApplied() {
    this.isSaveDisabled = false;
    this.headerCategoryCheck = false;
    this.appliedFilters.forEach(element => {
      this.countFilter--;
    });

    console.log(this.countFilter);
    if (this.countFilter <= 0) {
      this.disableClear = true;
      this.disableHeaderCheck = true;
      this.headerCategoryCheck = false;
    }
  }
}
