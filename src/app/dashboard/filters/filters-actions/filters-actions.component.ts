import { ViewAppliedFiltersComponent } from './../../../modal/view-applied-filters/view-applied-filters.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FiltersService } from './../filters.service';
import { Component, OnInit } from '@angular/core';
import { ProductSummaryService } from '../../product-summary/product-summary.service';
import { LocaleService } from '@app/shared/services/locale.service';

@Component({
  selector: 'app-filters-actions',
  templateUrl: './filters-actions.component.html',
  styleUrls: ['./filters-actions.component.scss']
})
export class FiltersActionsComponent implements OnInit {

  constructor(public localeService: LocaleService, public filtersService: FiltersService,
    private modalVar: NgbModal, public productSummaryService: ProductSummaryService) { }

  ngOnInit() {
  }

  openViewAppliedFiltersModal() {
    const modalRef = this.modalVar.open(ViewAppliedFiltersComponent, { windowClass: 'applied-filters-modal' });
  }

}
