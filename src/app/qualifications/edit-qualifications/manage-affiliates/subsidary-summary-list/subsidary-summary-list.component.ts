import { Component, OnInit, EventEmitter, Output, Renderer2, OnDestroy, Input } from '@angular/core';
import { ManageAffiliatesService } from '../manage-affiliates.service';
@Component({
  selector: 'app-subsidary-summary-list',
  templateUrl: './subsidary-summary-list.component.html',
  styleUrls: ['./subsidary-summary-list.component.scss']
})
export class SubsidarySummaryListComponent implements OnInit, OnDestroy {
  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();
  @Input() selectedRow: any = {};

  constructor(private renderer: Renderer2, public affiliatesService: ManageAffiliatesService) { }

  ngOnInit() {
    this.affiliatesService.selectedRow = this.selectedRow 
    this.affiliatesService.showFlyoutView = true;
    this.renderer.addClass(document.body, 'position-fixed');
  }
  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'position-fixed');
  }

}
