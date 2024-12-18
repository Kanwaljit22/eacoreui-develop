import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { IRenewalSubscription } from 'vnext/proposal/proposal-store.service';

@Component({
  selector: 'app-search-subscriptions',
  templateUrl: './search-subscriptions.component.html',
  styleUrls: ['./search-subscriptions.component.scss'],
})
export class SearchSubscriptionsComponent {
  @Input() searchedSubscriptions: IRenewalSubscription[] = [];
  @Output() searchSubscription = new EventEmitter();
  @Output() addSelectedSubscription = new EventEmitter();
  @Output() toggleDisplaySubscriptions = new EventEmitter();
  @Input() displaySubscriptions: boolean = false;

  allSelected: boolean = false;
  anyItemSelected: boolean = false;
  clearSearch = false;
  constructor(public dataIdConstantsService: DataIdConstantsService, public localizationService: LocalizationService) {}
  onSearch(event: any) {
    const searchTerms = event.value.split(',').map(term => term.trim());
    
    if (this.searchedSubscriptions) {
      this.searchedSubscriptions = this.searchedSubscriptions.filter(sub =>
        searchTerms.some(term => sub.subRefId && sub.subRefId.includes(term))
      );
    }

    this.searchSubscription.emit({ value: event.value });
  }

  transformToLowercaseExceptFirstLetter(text: string): string {
    if (!text) {
      return '';
    }
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  addSubscription() {
    this.addSelectedSubscription.emit(this.searchedSubscriptions.find(sub => sub.selected));
    this.clearInput();
    this.updateAnyItemSelected();
  }

  selectSubscription(selectedSub: IRenewalSubscription) {
    this.searchedSubscriptions.forEach(sub => {
      if (sub.subRefId !== selectedSub.subRefId) {
        sub.selected = false;
      }
    });
  
    selectedSub.selected = !selectedSub.selected;
    this.updateAnyItemSelected();
  }

  updateAnyItemSelected() {
    this.anyItemSelected = this.searchedSubscriptions.some(sub => sub.selected);
  }
  
  onClickOutside() {
    this.toggleDisplaySubscriptions.emit(false);
    this.clearInput();
  }

  clearInput() {
    this.searchedSubscriptions.forEach(sub => sub.selected = false);
    this.allSelected = false;
    // clears the search
    this.clearSearch = true;
    setTimeout(() => {
      // resets the search boolean to false so when opened again, it can be cleared again.
      this.clearSearch = false; 
    });
  }
}
