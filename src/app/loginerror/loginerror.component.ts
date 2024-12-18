import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loginerror',
  templateUrl: './loginerror.component.html',
  styleUrls: ['./loginerror.component.scss']
})
export class LoginerrorComponent implements OnInit {
  errorMessage = 'You are not authorized to access this tool.';

  constructor() { }

  ngOnInit() {
  }

}
