import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { CreateProposalStoreService } from 'vnext/proposal/create-proposal/create-proposal-store.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';

@Component({
  selector: 'app-available-subscriptions',
  templateUrl: './available-subscriptions.component.html',
  styleUrls: ['./available-subscriptions.component.scss']
})
export class AvailableSubscriptionsComponent implements OnChanges {
  @Input() availableSubscriptions = [];
  @Input() otherSubscriptions = [];
  @Output() subscriptionChecked = new EventEmitter();
  @Output() goToSubUi = new EventEmitter();

  allAvailableSelected: boolean = false;
  allOtherSelected: boolean = false;

  constructor(public localizationService: LocalizationService, public createProposalStoreService: CreateProposalStoreService, public proposalStoreService : ProposalStoreService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.checkAllSelected()
    }
  }

  transformToLowercaseExceptFirstLetter(text: string): string {
    if (!text) {
      return '';
    }
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  toggleAllAvailableSelection() {
    this.allAvailableSelected = !this.allAvailableSelected;
    this.availableSubscriptions?.forEach(sub => {
      sub.selected = this.allAvailableSelected;
      this.subscriptionChecked.emit(sub);
    });
  }

  toggleAllOtherSelection() {
    this.allOtherSelected = !this.allOtherSelected;
    this.otherSubscriptions?.forEach(sub => {
      sub.selected = this.allOtherSelected;
      this.subscriptionChecked.emit(sub);
    });
  }

  toggleSelection(subscription) {
    subscription.selected = !subscription.selected;
    this.subscriptionChecked.emit(subscription);
    this.checkAllSelected();
  }

  emitSubUi(subRefId){
    this.goToSubUi.emit(subRefId);
  }

  checkAllSelected() {
    this.allAvailableSelected = Array.isArray(this.availableSubscriptions) && this.availableSubscriptions.length > 0 
    ? this.availableSubscriptions.every(sub => sub.selected) 
    : false;

  this.allOtherSelected = Array.isArray(this.otherSubscriptions) && this.otherSubscriptions.length > 0 
    ? this.otherSubscriptions.every(sub => sub.selected) 
    : false;
  }
}
