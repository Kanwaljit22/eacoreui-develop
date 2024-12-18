import { Component, OnInit } from '@angular/core';
import { LocaleService } from '@app/shared/services/locale.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(public localeService : LocaleService) { }

  ngOnInit() {
  }

}
