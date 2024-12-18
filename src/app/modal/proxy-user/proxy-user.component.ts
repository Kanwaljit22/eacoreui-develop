import { Component, OnInit, Renderer2 } from '@angular/core';
import { LocaleService } from '@app/shared/services/locale.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-proxy-user',
  templateUrl: './proxy-user.component.html',
  styleUrls: ['./proxy-user.component.scss']
})
export class ProxyUserComponent implements OnInit {

  cecId = '';

  constructor(public localeService: LocaleService, public activeModal: NgbActiveModal, public renderer: Renderer2) { }

  ngOnInit() {
  }

  switchToProxy() {
    if (this.cecId) {
      this.activeModal.close(this.cecId);
    } else {
      this.activeModal.close();
    }
  }

  focusInput(val) {
    const element = this.renderer.selectRootElement('#' + val);
    element.focus();
  }

}
