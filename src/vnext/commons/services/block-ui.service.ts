import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class BlockUiService {

  constructor() { }

  
  spinnerConfig = {
    block: false,
    chain: false,
    spin: true,   
    noBlocker:false, //This field we'll use when we don't need blocker on the page.     
    customBlocker: false,
    blockUI() {
     if(!this.noBlocker){this.block = true;}
    },
    unBlockUI() {     
        this.block = false;
      // this.customBlocker = false;
    },
    startChain() {
      this.chain = true;
    },
    stopChainAfterThisCall() {
      this.chain = false;
    }, 
    noProgressBar(){
        this.noBlocker = true;
    },  
    displayProgressBar(){
      this.noBlocker = false;
    }
  };
}
