import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-upcoming-agreements',
  templateUrl: './upcoming-agreements.component.html',
  styleUrls: ['./upcoming-agreements.component.scss']
})
export class UpcomingAgreementsComponent implements OnInit {
  @Input() upcomingTfData: any;
  @Input() upcomingRenewalData: any;

  constructor() { }

  ngOnInit() {
  }

}
