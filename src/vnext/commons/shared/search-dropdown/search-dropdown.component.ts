import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { ProjectService } from 'vnext/project/project.service';

@Component({
  selector: 'app-search-dropdown',
  templateUrl: './search-dropdown.component.html',
  styleUrls: ['./search-dropdown.component.scss']
})
export class SearchDropdownComponent implements OnInit, OnDestroy {
  @Input() searchDropdown;
  @Input() exactPartySearch = false;
  @Input() searchPlaceHolder;
  @Input() roundedInput = false;
  @Input() isManageBpScope: boolean;
  @Input() disableSelectedDropValue = false;
  @Input() fullWidth = false;
  @Input() clearSearch = false;
  @Output() searchSelectedDrop = new EventEmitter();
  selectedDropValue: any;
  searchValue = '';
  showClose = false;
  showSearchDrop = false;
  public subscribers: any = {};

  constructor(public projectService: ProjectService, public utilitiesService: UtilitiesService, public dataIdConstantsService: DataIdConstantsService) { }

  ngOnInit(): void {
    if(!this.disableSelectedDropValue){
      this.selectedDropValue = this.searchDropdown[0];
    }
    this.subscribers.clearSearchInput = this.projectService.clearSearchInput.subscribe(() => {
      this.searchValue = '';
      this.showClose = false;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['exactPartySearch'] && changes['exactPartySearch'].currentValue
      && !changes['exactPartySearch'].isFirstChange()) {
        this.selectDrop();
    }
    if (changes['clearSearch'] && changes['clearSearch'].currentValue) {
      this.clearSearchValue();
    }
  }

  ngOnDestroy(): void {
    if(this.subscribers.clearSearchInput){
      this.subscribers.clearSearchInput.unsubscribe();
    }
  }

  selectDrop(value?) {
    this.selectedDropValue = value;
    this.showSearchDrop = false;
    this.searchValue = '';
    if(!value && this.exactPartySearch){
      this.selectedDropValue = this.searchDropdown[0];
    }
  }

  search() {
    if(this.searchValue.length >= 3 && this.disableSelectedDropValue) {
      this.showClose = true;
      this.searchSelectedDrop.emit({value: this.searchValue})
    }
    
    if(this.searchValue.length >= 3 && !this.disableSelectedDropValue) {
      this.showClose = true;
      this.searchSelectedDrop.emit({key: this.selectedDropValue.id, value: this.searchValue})
    } else {
      return;
    }
  }

  closeSearch() {
    this.showClose = false;
    this.searchValue = '';
    this.searchSelectedDrop.emit(false);
  }

  onKeyup(event) {
    if (!this.utilitiesService.isNumberKey(event) && !this.disableSelectedDropValue && this.selectedDropValue.id === 'partyId' && event.key !== 'Enter' && !(event.keyCode == 86 && event.ctrlKey)) {
      event.preventDefault();
    }
  }

  onChange(value) {
    if (!this.disableSelectedDropValue && this.selectedDropValue.id === 'partyId') {
      const isNum = /^\d+$/.test(value);
      if (!isNum) {
        setTimeout(() => {
          this.searchValue = '';
        }, 200);
      }
    }
  }

  clearSearchValue() {
    this.searchValue = '';
    this.clearSearch = false;
    this.showClose = false;
  }
}
