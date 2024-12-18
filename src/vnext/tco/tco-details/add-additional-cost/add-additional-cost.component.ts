import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TcoService } from 'vnext/tco/tco.service';
import { EaRestService } from "ea/ea-rest.service";
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { TcoStoreService } from '../../tco-store.service';
import { VnextService } from 'vnext/vnext.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';

@Component({
  selector: 'app-add-additional-cost',
  templateUrl: './add-additional-cost.component.html',
  styleUrls: ['./add-additional-cost.component.scss']
})
export class AddAdditionalCostComponent implements OnInit {
  existingAdditionalCosts = [];
  @Input() tcoObjId;
  @Input() isMsea = false;
  isDoubleClick = false;

  additionalCosts = [
    { name: '', swPercent: "", cxPercent: "", bau: true, ea: true },
  ];

  constructor(
    public tcoService: TcoService, 
    private eaRestService: EaRestService, 
    public localizationService: LocalizationService,
    public tcoStoreService: TcoStoreService,
    public vnextService: VnextService,
    public utilitiesService: UtilitiesService
  ) {}

  ngOnInit() {
    this.existingAdditionalCosts = this.tcoStoreService.tcoData.alc.additionalCosts || [];
  }

  addNewCost() {
    if ((this.additionalCosts.length + this.existingAdditionalCosts.length) < 10) {
      this.additionalCosts.push({
        name: '',
        swPercent: "",
        cxPercent: "",
        bau: true,
        ea: true
      });
    }
  }

  removeCost(index: number) {
    this.additionalCosts.splice(index, 1);
  }

  isAddCostDisabled(): boolean {
    return (this.additionalCosts.length + this.existingAdditionalCosts.length) >= 10;
  }

  keyDown(event) {// to prevent char and special char 
    // use utilitiesService.isNumberKey if decimal required
    if (!this.utilitiesService.isNumberOnlyKey(event) || event.key == 'Tab') {
      event.preventDefault();
    } else {
      let value = ((+event.target.value) + (+event.key))
      const stringValue = (event.target.value) + (event.key) 
      if(this.isDoubleClick){
        value = (+event.key)
      }
      if(value > 100 && !isNaN(value)){
        event.preventDefault();
      }
       else if(stringValue > 100 && !this.isDoubleClick){
        event.preventDefault();
      }
      this.isDoubleClick = false
    }
  }
  onDoubleClick(){
    this.isDoubleClick = true;
  }
  blurEvent(){
    this.isDoubleClick = false;
  }

  saveAndContinue() {
    const url = `proposal/tco/${this.tcoObjId}/additional-cost`;
    const reqObject = { 
      data: {
        additionalCostAttributes: this.additionalCosts
      }
    };
    this.eaRestService.putApiCall(url, reqObject).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) {
        this.tcoStoreService.tcoData = response.data;
        this.tcoService.mapTcoData();
        this.tcoService.addAdditionalCost = false;
        this.tcoService.refreshGraph.next(true);
      }
    });
  }

  isSaveDisabled() {
    return this.additionalCosts.some(cost => 
      !cost.name.trim() || 
      ( (!this.hasValue(cost.swPercent) || this.tcoStoreService.inflation.cxOnlyPurchased) && 
       (!this.tcoStoreService.inflation.cxAvailable || !this.hasValue(cost.cxPercent))) || 
      (!cost.bau && !cost.ea)
    );
  }

  hasValue(value: any): boolean {
    return value !== null && value !== undefined && value !== '';
  }
}
