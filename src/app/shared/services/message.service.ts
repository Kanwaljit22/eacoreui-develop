import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { Message, MessageType } from './message';
import { BlockUiService } from './block.ui.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { ConstantsService } from '@app/shared/services/constants.service';


@Injectable()
export class MessageService {
  static readonly UI_TECH_ERROR = 'We have encountered some unexpected issue.Please contact technical support team.';
  static readonly SERVER_CONECTION_ERROR = 'We are not able to connect to the server, it seems your session is expired. Could you please refresh the page. If you still see the error, please contact technical support team.';
  static readonly NO_MSG_FROM_SERVICE = 'There is technical issue.Could you please contact technical support team.';
  static readonly UI_ERROR_CODE = 'UI0001';
  static readonly QUANTITY_CHECK_ERROR = 'Error in entering quantities.';
  disaplyModalMsg = false;
  pessistErrorOnUi = false;
  messagesSet = new Set<string>();
  hideParentErrorMsg = false;
  messagesObj = {
    infos: new Array<Message>(),
    errors: new Array<Message>(),
    warns: new Array<Message>(),
    success: new Array<Message>()
  };
  modalMessagesObj = {
    infos: new Array<Message>(),
    errors: new Array<Message>(),
    warns: new Array<Message>(),
    success: new Array<Message>()
  };
  constructor(private router: Router, private blockUiService: BlockUiService, public localeService: LocaleService,
    public constantsService: ConstantsService) {
  }

  clear() {
    // clear info,errors,success and warning list.
    if (!this.pessistErrorOnUi) {
      this.messagesObj.infos = new Array<Message>();
      this.messagesObj.errors = new Array<Message>();
      this.messagesObj.warns = new Array<Message>();
      this.messagesObj.success = new Array<Message>();
      this.messagesSet = new Set<string>();
    }
  }

  modalMessageClear() {
    // clear info,errors,success and warning list.
      this.modalMessagesObj.infos = new Array<Message>();
      this.modalMessagesObj.errors = new Array<Message>();
      this.modalMessagesObj.warns = new Array<Message>();
      this.modalMessagesObj.success = new Array<Message>();
  }
  // This method is use to display messages from ajax call response.
  displayMessagesFromResponse(response: any, persistError?: any) {
    this.blockUiService.spinnerConfig.unBlockUI();
    if (response) {
      if (!response.messages || !response.messages.length ) {
        if (response.error) { // Got error = true but we not received any messge from the API.
          const message: Message = {
            text: MessageService.NO_MSG_FROM_SERVICE,
            type: MessageType.Error,
            code: MessageService.UI_ERROR_CODE
          };
        }
      } else {
        this.displayMessages(response.messages, persistError);
      }
    }
  }


  displayMessages(messages: [any], persistError = false) {
    if (messages && messages.length > 0) {
      if (!persistError && !this.disaplyModalMsg) {
        this.clear();
      }
      const size = messages.length;
      for (let i = 0; i < size; i++) {
        const errorMsg = messages[i];

        const message: Message = {
          text: errorMsg.text,
          type: errorMsg.severity,
          code: errorMsg.code
        };
        if (!this.messagesSet.has(errorMsg.text) && !this.disaplyModalMsg) { // add msg if it is not added in messagesSet to stop displaying multiple time.
          this.messagesSet.add(errorMsg.text);
          if (errorMsg.severity === MessageType.Error) {
            message.type = MessageType.Error;
            this.messagesObj.errors.push(message);
          } else if (errorMsg.severity === MessageType.Success) {
            message.type = MessageType.Success;
            this.messagesObj.success.push(message);
          } else if (errorMsg.severity === MessageType.Warning) {
            message.type = MessageType.Warning;
            this.messagesObj.warns.push(message);
          } else if (errorMsg.severity === MessageType.Info) {
            message.type = MessageType.Info;
            this.messagesObj.infos.push(message);
          } else if (errorMsg.severity === MessageType.Warn) {
            message.type = MessageType.Warning;
            this.messagesObj.warns.push(message);
          } else {
            message.type = MessageType.Error;
            this.messagesObj.errors.push(message);
          }
        } else if (this.disaplyModalMsg) {
          if (errorMsg.severity === MessageType.Error) {
            message.type = MessageType.Error;
            this.modalMessagesObj.errors.push(message);
          } else if (errorMsg.severity === MessageType.Success) {
            message.type = MessageType.Success;
            this.modalMessagesObj.success.push(message);
          } else if (errorMsg.severity === MessageType.Warning  || errorMsg.severity === MessageType.Warn) {
            message.type = MessageType.Warning;
            this.modalMessagesObj.warns.push(message);
          } else if (errorMsg.severity === MessageType.Info) {
            message.type = MessageType.Info;
            this.modalMessagesObj.infos.push(message);
          } else {
            message.type = MessageType.Error;
            this.modalMessagesObj.errors.push(message);
          }
        }
      }
    }
  }


  // This method is use to display error in case of any issue in scripting code.
  displayUiTechnicalError(error?: any) {
    console.log(error);
    const message: Message = {
      text: MessageService.UI_TECH_ERROR,
      type: MessageType.Error,
      code: MessageService.UI_ERROR_CODE
    };
    if(this.disaplyModalMsg){
      this.modalMessagesObj.errors.push(message);
    } else if (!this.messagesSet.has(MessageService.UI_TECH_ERROR)) {
      this.messagesObj.errors.push(message);
      this.messagesSet.add(MessageService.UI_TECH_ERROR);
    }

  }


  // This method is use to display error in case of session expire
  displayConnectivityError() {
    const message: Message = {
      text: MessageService.SERVER_CONECTION_ERROR,
      type: MessageType.Error,
      code: MessageService.UI_ERROR_CODE
    };
    this.messagesObj.errors.push(message);
  }


  // This method is use to display UI custom error message.
  displayCustomUIMessage(messageText: string, code: string) {
    const message: Message = {
      text: messageText,
      type: MessageType.Error,
    };
    if (code) {
      message.code = code;
    }
    if(this.disaplyModalMsg){  
      this.modalMessagesObj.errors.push(message);
    } else {
      this.checkExistingMsg(message);
    }
  }

  private checkExistingMsg(message: Message) {
    if (!this.messagesSet.has(message.text)) { // add msg if it is not added in messagesSet to stop displaying multiple time.
      this.messagesSet.add(message.text);
      this.messagesObj.errors.push(message);
    }
  }

  // method to remove specific error from messageobj using text and message type
  removeExistingMsg(messageText, messageType) {
    const messageTypeArray = this.messagesObj[messageType];

    for (let i = 0; i < messageTypeArray.length; i++){
      if (messageTypeArray[i].text === messageText){
        messageTypeArray.splice(i,1);
        break;
      }
    }
    // this.messagesObj[messageType] = messageTypeArray;
  }
}