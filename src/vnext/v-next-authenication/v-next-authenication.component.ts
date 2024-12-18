import { Component, OnInit } from '@angular/core';
import { LocalizationService } from 'vnext/commons/services/localization.service';

@Component({
  selector: 'app-v-next-authenication',
  templateUrl: './v-next-authenication.component.html',
  styleUrls: ['./v-next-authenication.component.scss']
})
export class VNextAuthenicationComponent implements OnInit {

  constructor(public localizationService: LocalizationService) { }

  ngOnInit() {
  }

}
