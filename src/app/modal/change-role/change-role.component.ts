import { Component, OnInit, ViewChild } from '@angular/core';
import { LocaleService } from '@app/shared/services/locale.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppDataService } from '@app/shared/services/app.data.service';
import { AppRestService } from '@app/shared/services/app.rest.service';
import { MessageService } from '@app/shared/services/message.service';

@Component({
  selector: 'app-change-role',
  templateUrl: './change-role.component.html',
  styleUrls: ['./change-role.component.scss']
})
export class ChangeRoleComponent implements OnInit {
  @ViewChild('myDropsearch', { static: true }) myDropsearch;
  selectedRole: string;
  enableProceed = false;

  constructor(public appRestService: AppRestService, public localeService: LocaleService,
    public activeModal: NgbActiveModal, public appDataService: AppDataService, public messageService: MessageService) { }

  ngOnInit() {
    this.selectedRole = 'Select Role';
  }

  changeRole(value) {
    this.selectedRole = value;
    this.enableProceed = true;
    setTimeout(() => {
      this.myDropsearch.close();
    });
  }

  /*close(){
    this.activeModal.close();
  }*/

  proceed() {
    this.appRestService.applyUserRole(this.appDataService.userInfo.userId, this.selectedRole).subscribe((res: any) => {
      if (res && res.data && !res.error) {
        this.appDataService.showUserRolePopup = false;
        this.activeModal.close();
      } else {
        this.messageService.displayMessagesFromResponse(res, false);
      }
    });
  }

}
