import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BroadcastService {
  channel: BroadcastChannel;

  constructor() {
    this.channel = new BroadcastChannel('my_channel');
  }

  // Send a message
  sendMessage(message: any) {
    this.channel.postMessage(message);
  }

  // Listen for messages
  listen(callback: (message: any) => void) {
    this.channel.onmessage = (event) => {
      callback(event.data);
    };
  }

  // Close the channel (optional, for cleanup)
  closeChannel() {
    this.channel.close();
  }
}
