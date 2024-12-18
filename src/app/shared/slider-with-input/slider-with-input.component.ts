import { PriceEstimationService } from '@app/proposal/edit-proposal/price-estimation/price-estimation.service';
import { PricingParameterComponent } from './../../modal/pricing-parameter/pricing-parameter.component';
import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonRangeSliderComponent, IonRangeSliderCallback } from '@app/shared/ion-range-slider/ion-range-slider.component';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { LocaleService } from "@app/shared/services/locale.service";
import { UtilitiesService } from '../services/utilities.service';

@Component({
    moduleId: module.id,
    selector: 'app-slider-with-input',
    templateUrl: 'slider-with-input.component.html',
    styleUrls: ['slider-with-input.component.scss']
})

export class SliderWithInputComponent implements OnInit{
    @ViewChild('sliderElement', { static: false }) sliderElement: IonRangeSliderComponent;
    @ViewChild('inputSelected', { static: false }) inputSelected: ElementRef;
    @Input() simpleSlider;
    @Output() valueChange = new EventEmitter();

    showTab: boolean;
    discontType;
    constructor(public priceEstimationService: PriceEstimationService, public proposalDataService: ProposalDataService,
        public constantsService: ConstantsService, public localeService: LocaleService, public utilitiesService: UtilitiesService) {
    }

    ngOnInit() {
        console.log(this.simpleSlider);
        if (this.simpleSlider.slider.selected) {
            this.showTab = true;
        }
    }

    sliderChange(event: IonRangeSliderCallback, name, id) {
        if (id) {

            this.updateDialDownRampMap(id, event.from);
        } else {
            name = name.split(" ").join(""); // Join the name to store it in object
            this.priceEstimationService.discountsOnSuites[name] = event.from;
        }

        if (this.simpleSlider.slider.onUpdate) {
            this.simpleSlider.slider.onUpdate(event);
        }
        this.inputSelected.nativeElement.value = event.from;
        this.valueChange.emit();
    }

    inputValueChange(event: any, name, id) {
        setTimeout(() => {
            if (!this.utilitiesService.isNumberKey(event)) {
                event.target.value = "";
            }
            name = name.split(" ").join(""); // Join the name to store it in object
            if (name === "advancedDeployment") {
                if (event.target.value > 100) {
                    this.inputSelected.nativeElement.value = 100;
                    this.priceEstimationService.discountsOnSuites[name] = event.target.value;
                    this.valueChange.emit();
                    return;
                }
                this.priceEstimationService.discountsOnSuites[name] = event.target.value;
                this.valueChange.emit();
                this.sliderElement.update({ from: event.target.value });
                setTimeout(() => {
                    this.onBlur(event, name, id);
                }, 800);
                return;
            }
            // adding check for min and max vlaues for slider
            if (event.target.value > this.simpleSlider.slider.max) {
                this.inputSelected.nativeElement.value = this.simpleSlider.slider.max;
                this.sliderElement.update({ from: event.target.value });
                this.priceEstimationService.discountsOnSuites[name] = event.target.value;
                if (id) {
                    this.updateDialDownRampMap(id, event.target.value);
                } else {
                    this.priceEstimationService.discountsOnSuites[name] = event.target.value;
                }
                this.valueChange.emit();
                return;
            } else if (event.target.value < this.simpleSlider.slider.min) {
                this.inputSelected.nativeElement.value = this.simpleSlider.slider.min;
                this.sliderElement.update({ from: event.target.value });
                this.priceEstimationService.discountsOnSuites[name] = event.target.value;
                if (id) {
                    this.updateDialDownRampMap(id, event.target.value);
                } else {
                    this.priceEstimationService.discountsOnSuites[name] = event.target.value;
                }
                this.valueChange.emit();

                return;
            }

            this.priceEstimationService.discountsOnSuites[name] = event.target.value; // softwareServiceDiscount
            if (id) {
                this.updateDialDownRampMap(id, event.target.value);
            } else {
                this.priceEstimationService.discountsOnSuites[name] = event.target.value;
            } // softwareServiceDiscount
            this.sliderElement.update({ from: event.target.value });
            this.valueChange.emit();
        }, 1500);
    }


    onBlur(event: any, name, id) {
        name = name.split(" ").join(""); // Join the name to store it in object
        if (name === "advancedDeployment") {
            if (event.target.value > 100) {
                this.inputSelected.nativeElement.value = 100;
                this.sliderElement.update({ from: event.target.value });
                this.priceEstimationService.discountsOnSuites[name] = event.target.value;
                if (id) {
                    this.updateDialDownRampMap(id, event.target.value);
                } else {
                    this.priceEstimationService.discountsOnSuites[name] = event.target.value;
                }
                this.valueChange.emit();
                return;
            }
            if (event.target.value < this.priceEstimationService.discountsOnSuites[name]) {
                this.inputSelected.nativeElement.value = this.priceEstimationService.discountsOnSuites[name];
                this.sliderElement.update({ from: event.target.value });
                this.priceEstimationService.discountsOnSuites[name] = event.target.value;
                this.valueChange.emit();
                return;
            }
        }
    }

    checkDurationsSelected(event) {
        if (event.target.id === 'yes') {
            this.showTab = true;
            this.priceEstimationService.discountsOnSuites['advancedDeploymentSelected'] = true;
        } else {
            this.showTab = false;
            this.priceEstimationService.discountsOnSuites['advancedDeploymentSelected'] = false;
        }
        this.valueChange.emit();
    }

    hasCategoriesSelected(val) {
        if (!val.tab) {
            return true;
        }
    }
    updateDialDownRampMap(id, value) {
        if (this.priceEstimationService.dialDownRampChangeMap.has(id)) {
            const dialDownRampObj = this.priceEstimationService.dialDownRampChangeMap.get(id);
            dialDownRampObj['changeValue'] = value;
        } else {
            const dialDownRampObj = {
                'id': id,
                'changeValue': value
            };
            this.priceEstimationService.dialDownRampChangeMap.set(id, dialDownRampObj);
        }
    }

}
