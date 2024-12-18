import { Injectable, Inject, EventEmitter } from '@angular/core';

@Injectable()
export class BlockUiService {


  isPollerServiceCall = false;
  spinnerConfig = {
    block: false,
    chain: false,
    spin: true,
    isPageContainGrid: false,
    parallelCallBlocker: false,
    noOfParallelCall: 0,
    customBlocker: false,
    blockUI() {
      this.block = true;
    },
    unBlockUI() {
      if (this.isPageContainGrid) {
        setTimeout(() => {
          this.block = false;
        }, 1000);
        this.isPageContainGrid = false;

      } else {
        this.block = false;
      }
      // this.customBlocker = false;
    },
    startChain() {
      this.chain = true;
    },
    stopChainAfterThisCall() {
      this.chain = false;
    },
    pageContainGrid() {
      this.isPageContainGrid = true;
    }
  };

  constructor() {

  }

}
