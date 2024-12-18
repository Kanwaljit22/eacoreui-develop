import { Injectable } from '@angular/core';

@Injectable()
export class CopyLinkService {

  message = '';
  messageVisible = false;

  constructor() { }

  showMessage(message) {
    this.messageVisible = true;
    this.message = message;
    setTimeout(() => {
      this.messageVisible = false;
    }, 5000);
  }

  // close copied link notification
  hideMessage() {
    this.messageVisible = false;
  }
}
