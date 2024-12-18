import { VnextStoreService } from './../services/vnext-store.service';
import { Component, OnInit } from '@angular/core';
import { LocalizationService } from '../services/localization.service';
import { EaStoreService } from 'ea/ea-store.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public vnextStoreService:VnextStoreService, public localizationService:LocalizationService, public eaStoreService: EaStoreService ) { }

  ngOnInit() {
  }

}
