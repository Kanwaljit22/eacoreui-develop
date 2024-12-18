import { Component } from '@angular/core';
import {
  state,
  style,
  trigger
} from '@angular/animations';
import { Toast, ToastrService, ToastPackage } from 'ngx-toastr';

@Component({
  selector: 'app-toastr',
  templateUrl: './toastr.component.html',
  styleUrls: ['./toastr.component.scss'],
  animations: [
    trigger('flyInOut', [
        state('inactive', style({
            display: 'none',
            opacity: 0
        })),
        state('active', style({})),
        state('removed', style({})),
    ])
  ],
  preserveWhitespaces: false
})
export class ToastrComponent extends Toast {

  constructor(
    protected toastrService: ToastrService,
    public toastPackage: ToastPackage,
  ) {
    super(toastrService, toastPackage);
  }

}
