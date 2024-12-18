import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-customer-request-clarifications',
  templateUrl: './customer-request-clarifications.component.html',
  styleUrls: ['./customer-request-clarifications.component.scss']
})
export class CustomerRequestClarificationsComponent implements OnInit {

  @Output() onclose: EventEmitter<any> = new EventEmitter<any>();
  @Input() subtitle = 'Modifications';
  @Input() clarificationsList = [];
  @Input() mainTitle = '';
  enableSaveButton = false;

  constructor() { }

  ngOnInit() {
  }

  saveClarifications() {
    this.onclose.emit(this.clarificationsList);
  }
  close() {
    this.onclose.emit(false);
  }

  updateSelectedCount(item){
    item.selected = !item.selected;
    this.enableSaveButton = true;
    if(this.subtitle === 'Modifications' && item.name === 'None of the above'){//update this condition once data is avilable
      for(let i = 0; i < this.clarificationsList.length -1; i++){
        this.clarificationsList[i].selected = false;
        this.clarificationsList[i]['disabled'] = item.selected;
      }
    }
  }

  contractNegotiator(){
    window.open('https://cisco.sharepoint.com/Sites/AskLegal-migrated/SitePages/Legal%20Sales%20Contacts.aspx');
  }
}
