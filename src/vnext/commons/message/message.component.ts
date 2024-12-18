import { Component, OnInit, Input } from '@angular/core';
import { Message, MessageType, MessageService } from './message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  messages: Message[] = [];
  showApproveException = false;
  @Input() displayModalMsg = false;

  constructor(public messageService: MessageService) { }

  ngOnInit() { }

  cssClass(message: Message) {
    if (!message) {
      return;
    }
    // return css class based on alert type
    switch (message.type) {
      case MessageType.Success:
        return 'alert alert-success';
      case MessageType.Error:
        return 'alert alert-danger';
      case MessageType.Info:
        return 'alert alert-info';
      case MessageType.Warning:
        return 'alert alert-warning';
    }
  }
}
