import { Component, OnInit, Input } from '@angular/core';

import { Message, MessageType } from '../services/message';
import { MessageService } from '../services/message.service';
import { ApproveExceptionComponent } from '@app/proposal/edit-proposal/price-estimation/approve-exception/approve-exception.component';
import { NgbPaginationConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocaleService } from '@app/shared/services/locale.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { ApproveExceptionService } from '@app/proposal/edit-proposal/price-estimation/approve-exception/approve-exception.service';


@Component({
    moduleId: module.id,
    selector: 'message',
    templateUrl: 'message-component.directive.html'
})

export class MessageComponent implements OnInit {

    messages: Message[] = [];
    showApproveException = false;
    @Input() displayModalMsg  = false;

    constructor(public messageService: MessageService, private modalVar: NgbModal, public approveExceptionService: ApproveExceptionService,
        public localeService: LocaleService, public constantsService: ConstantsService, public appDataService: AppDataService) { }

    ngOnInit() {


    }


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
