import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { MessageService } from '@app/shared/services/message.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { LocaleService } from '@app/shared/services/locale.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { PriceEstimationService, RecalculateAllEmitterObj } from '@app/proposal/edit-proposal/price-estimation/price-estimation.service';
import { ProposalSummaryService } from '@app/proposal/edit-proposal/proposal-summary/proposal-summary.service';
import { IonRangeSliderCallback, IonRangeSliderComponent } from '@app/shared/ion-range-slider/ion-range-slider.component';

@Component({
  selector: 'app-override-msd',
  templateUrl: './override-msd.component.html',
  styleUrls: ['./override-msd.component.scss']
})
export class OverrideMsdComponent implements OnInit {

  @Input() manualOverrideMsd: any;
  isDisableApply = false;
  public sliders = [];
  displayGridView = false;
  public isDisableSlider: boolean = false;
  selectedView = 'flat';
  globalView: any;
  simpleSlider: any;
  @ViewChild('sliderElement', { static: false }) sliderElement: IonRangeSliderComponent;
  @ViewChild('inputSelected', { static: false }) inputSelected: ElementRef;
  showTab: boolean;

  constructor(public localeService: LocaleService,
    public bsModalRef: BsModalRef,
    public priceEstimationService: PriceEstimationService,
    public proposalDataService: ProposalDataService,
    public constantsService: ConstantsService,
    public appDataService: AppDataService,
    public utilitiesService: UtilitiesService,
    public messageService: MessageService,
    public proposalSummaryService: ProposalSummaryService) { }

  ngOnInit() {
    this.globalView = false;
    // this.setReadOnlyMode();
    //console.log(this.appDataService.overrideMsd)
    if(this.appDataService.overrideMsd.manualOverridenMSDSuiteCount === undefined){
      this.isDisableSlider = true;
    } else {
      this.globalView = true;
    }
    this.manualOverrideMsd = this.appDataService.overrideMsd.manualOverridenMSDSuiteCount ? this.appDataService.overrideMsd.manualOverridenMSDSuiteCount: 0 ;
    if (!this.appDataService.overrideMsd || this.appDataService.overrideMsd.manualOverridenMSDSuiteCount < 0) {
      this.isDisableSlider = true;
    }
    this.simpleSlider = this.convertToSliderObj(this.appDataService.overrideMsd);
    if (this.simpleSlider.slider.selected) {
      this.showTab = true;
    }
  }

  globalSwitchChange(event) {
    this.globalView = event;
    if (event) {
      this.isDisableSlider = false;
    } else {
      this.isDisableSlider = true;
    }
    
    // else if (!event && (!this.appDataService.overrideMsd || this.appDataService.overrideMsd.manualOverridenMSDSuiteCount < 0)) {
    //   this.isDisableSlider = true
    // }
  }

  // get and set the discount obj for slider 
  convertToSliderObj(obj) {
    const newObj = headerSliderObjFactory.getHeaderSliderObj();
    newObj.min = 0;
    newObj.name = 'Change MSD';
    newObj.from = this.appDataService.overrideMsd.manualOverridenMSDSuiteCount ? this.appDataService.overrideMsd.manualOverridenMSDSuiteCount : this.appDataService.overrideMsd.systematicallyOverridenMSDSuiteCount ? this.appDataService.overrideMsd.systematicallyOverridenMSDSuiteCount :this.appDataService.overrideMsd.originalMSDSuiteCount;
    newObj.max = this.appDataService.overrideMsd.originalMSDSuiteCount;
    let slider = newObj;
    return { slider };
  }

  sliderChange(event: IonRangeSliderCallback, name, id) {
    this.manualOverrideMsd = event.from;
    if (this.simpleSlider.slider.onUpdate) {
      this.simpleSlider.slider.onUpdate(event);
    }
    this.inputSelected.nativeElement.value = event.from;
    this.onValueChanged();
  }
  
  inputValueChange(event: any, name, id) {
    setTimeout(() => {
      if (!this.utilitiesService.isNumberKey(event)) {
        event.target.value = "";
      }
      this.manualOverrideMsd = event.target.value; //softwareServiceDiscount
      if (event.target.value) {
        if (event.target.value > this.simpleSlider.slider.max) {
          this.inputSelected.nativeElement.value = this.manualOverrideMsd = event.target.value = this.simpleSlider.slider.max;
          this.sliderElement.update({ from: event.target.value });
          this.onValueChanged();
          return;
        } else if (event.target.value < this.simpleSlider.slider.min) {
          this.inputSelected.nativeElement.value = this.manualOverrideMsd = event.target.value = this.simpleSlider.slider.min;
          this.sliderElement.update({ from: event.target.value });
          this.onValueChanged();
          return;
        }
      }
      this.manualOverrideMsd = event.target.value;
      this.sliderElement.update({ from: event.target.value });
      this.onValueChanged();
    }, 1500);
  }

  //Enable / Disable Apply Discount button on value change
  onValueChanged() {

    if (this.manualOverrideMsd <= 0) {
      this.isDisableApply = true;
    } else {
      this.isDisableApply = false;
    }
    
    // this.setReadOnlyMode();
  }

  // method to call api and recalculate after msd count is sent
  confirm(){
    this.priceEstimationService.msdSuiteCountSubmit(this.globalView, this.manualOverrideMsd).subscribe((res: any) => {
      if (res && !res.error) {
        const recalculateAllObject: RecalculateAllEmitterObj = {
          recalculateButtonEnable: true,
          recalculateAllApiCall: true
        }
        this.priceEstimationService.isEmitterSubscribe = true;
        this.priceEstimationService.recalculateAllEmitter.emit(recalculateAllObject);
        this.priceEstimationService.isContinue = true;
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
    this.bsModalRef.hide();
  }

  decline() {
    this.bsModalRef.hide();
  }

  setReadOnlyMode(){
    if (this.appDataService.userInfo.roSuperUser && !this.appDataService.isReadWriteAccess) {
      this.isDisableApply = this.appDataService.userInfo.roSuperUser;
    } else if (this.appDataService.roadMapPath) {
      this.isDisableApply = this.appDataService.roadMapPath;
    }
  }
}
export class headerSliderObjFactory {
  static getHeaderSliderObj() {
    return {
      id: 0,
      name: "",
      min: 0,
      max: 100,
      from: 0,
      grid: true,
      grid_num: 1,
      tab: false,
      selected: false
    };
  }
}