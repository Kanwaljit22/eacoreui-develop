import { MessageCode } from './../../message/message.service';
import { Component, OnInit, Input, Renderer2 } from '@angular/core';
import { MessageType, Message } from "vnext/commons/message/message.service";
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { AdjustDesiredQtyService } from 'vnext/proposal/edit-proposal/price-estimation/adjust-desired-qty/adjust-desired-qty.service';
import { PriceEstimateStoreService } from 'vnext/proposal/edit-proposal/price-estimation/price-estimate-store.service';
import { PriceEstimateService } from 'vnext/proposal/edit-proposal/price-estimation/price-estimate.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';

@Component({
  
  selector: 'app-multi-error',
  templateUrl: './multi-error.component.html',
  styleUrls: ['./multi-error.component.scss']
})
export class MultiErrorComponent implements OnInit {
  opnemultierror = false;
  @Input() message; 
  @Input() identifier;
   messagesObj = {
    errors: new Array<Message>(),
    warns: new Array<Message>(),
    info: new Array<Message>() 
  };

  displayMsgScroll = false;
  overflowVisibles = false;
  openMultiWarning = false; // set to show warning messages
  // openInfo = false;
  rsdInfoMsg: any;
  openMultiInfo = false;
  constructor(private renderer: Renderer2, private adjustDesiredQtyService: AdjustDesiredQtyService, private priceEstimateService: PriceEstimateService, private priceEstimateStoreService: PriceEstimateStoreService, private proposalStoreService: ProposalStoreService, private constantsService: ConstantsService, public localizationService: LocalizationService, public dataIdConstantsService: DataIdConstantsService) { }

  ngOnInit(): void {


   
  }

  ngOnChanges(changes) {
    this.setMerakiMsg();
    if (this.proposalStoreService.isSyncPrice && !changes['message'].isFirstChange() && changes['message'].currentValue && changes['message'].currentValue.messages.length === changes['message'].previousValue?.messages?.length) {
      return;
    } else {
      // Manage error and warning message 
      if (this.message){
        this.clear();
        // check if identifier present 
        if (this.identifier){
          this.showError(this.message.messages);
        } else { // after 2 sec set meraki message
          setTimeout(() => {
            this.showError(this.message.messages);
          }, 2000);
        }
    }
    }
  }

  // Manage error and warning message 
  showError(messages: [any]) {
    this.adjustDesiredQtyService.displayMsgForAdjDesiredQty = false;
    this.rsdInfoMsg = {};
    this.setMerakiMsg();
    if (messages && messages.length > 0) {
      let messageArr;
      if (!this.identifier) {
        messageArr = messages.filter(messages => messages.level === 'BUNDLE' || !messages.level)
      } else {
        messageArr = messages.filter((messages) => {
          if (messages.identifier === this.identifier && messages.severity === 'ERROR' || ((messages.parentIdentifier === this.identifier || messages.identifier === this.identifier) && messages.severity === 'WARN')) {
            return messages;
          } 
        })
      }
      for (let i = 0; i < messageArr.length; i++) {
       const errorMsg = messageArr[i];
        const message: Message = {
          text: errorMsg.text,
          type: errorMsg.severity,
          code: errorMsg.code
        };

          if (errorMsg.severity === MessageType.Warning || errorMsg.severity === MessageType.Warn) {
            message.type = MessageType.Warning;
            if (message.code === this.constantsService.ORGID_EXCEPTION){
              if (!this.messagesObj.warns.find(messageObj => messageObj.code === this.constantsService.ORGID_EXCEPTION)){
                this.messagesObj.warns.push(message);
              }
            } else {
              this.messagesObj.warns.push(message);
            }
          } else if(errorMsg.severity === MessageType.Info) {
            message.type = MessageType.Info;
            // RSD info message
            if (message.code === MessageCode.Rsd) {
              this.rsdInfoMsg = message;
            } else {
              this.messagesObj.info.push(message);
            }
          } else {
            message.type = MessageType.Error;
            this.messagesObj.errors.push(message);
            this.adjustDesiredQtyService.displayMsgForAdjDesiredQty = true;
          }
        }
      }
    }

  // Clear previous message error  
  clear() {

   this.messagesObj = {
    errors: new Array<Message>(),
    warns: new Array<Message>(),
    info: new Array<Message>()
  };

    }

    toggleClass(event: any) {
        this.displayMsgScroll = true;
        //this.renderer.addClass(event.target, 'd-none');
      }

      // This method is to get the open multi error
      overflowVisible() {
    
        this.overflowVisibles = !this.overflowVisibles
      }

  // set to show meraki message if meraki suites present and no orgids added
  setMerakiMsg() {
    if (this.message && !this.message.messages) {
      this.message.messages = [];
    } else if (!this.message) {
      this.message = {
        "messages": []
      };
    }
    if (this.priceEstimateService.isMerakiSuitesPresent && !this.priceEstimateStoreService.orgIdsArr.length && !this.message.messages.find(messageObj => messageObj.code === this.constantsService.ORGID_EXCEPTION)) {
      this.message.messages.push({ severity: "WARN", text: "Please enter org id on project page as you have selected Meraki suites on this proposal.", code: this.constantsService.ORGID_EXCEPTION })
    }
  }
}
