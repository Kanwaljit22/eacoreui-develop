import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ParameterFeatureComponent } from '@app/modal/parameter-features/parameter-features.component';

@Component({
    selector: 'app-feature-group',
    templateUrl: './feature-group.component.html'

})
export class FeatureGroupComponent implements OnInit {
    data: any;
    i = 0;
    params: any;
    showArr = [];
    arr = [];
    showView: boolean;
    arrLength = 0;
    constructor(private modalVar: NgbModal) { }
    agInit(params) {
        this.params = params;
        this.data = params.data.features;
        //    if (params.node.level !== 0) {
        //        this.showView = true;
        //        this.showArr = ['Fnd-Primelife', 'Fnd-Prime Assurance', 'Fnd-StealthWatch'];
        //        for (let i = 0; i < this.showArr.length; i++) {
        //         this.showArr = this.showArr.slice(0, 2);
        //         this.arr = this.showArr.slice(1, this.showArr.length);
        //         //this.params.context.parentChildIstance.updateRow(this.showArr, params.node.id);
        //      // params.value = this.showArr;
        //        }
        //    }
    }

    ngOnInit() {
        //  console.log("hi")
        this.updateFeatures();
    }


    updateFeatures() {
        if (this.data) {
            if (this.data.length > 3) {
                this.showArr = this.data.slice(0, 3);
            } else {
                this.showArr = this.data;
            }
            if (this.data.length > this.showArr.length) {
                this.arrLength = this.data.length - this.showArr.length;
            }
        }
    }

    removeSelected(c, a) {
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i] === c) {
                this.data.splice(i, 1);
                this.params.context.parentChildIstance.updateRow(this.data, this.params.node.id);
            }
        }
    }

    showAll() {
        const modalRef = this.modalVar.open(ParameterFeatureComponent, { windowClass: 'add-specialist' });
        if (this.params.node.level !== 0) {
            // console.log(modalRef.componentInstance);
            modalRef.componentInstance.listOfFeatures = this.params.data.featuresForModel;
            modalRef.componentInstance.suiteName = this.params.data.suite_Name;
            modalRef.componentInstance.suiteId = this.params.data.suiteId;
            modalRef.componentInstance.hardwareDiscount = this.params.data.hwDiscount;
            modalRef.componentInstance.hardwareServiceDiscount = this.params.data.hwServiceDiscount;
            modalRef.componentInstance.yearlyGrowthRate = this.params.data.tcoGrowthRate;
            modalRef.componentInstance.foo = this.params.data.features;
            if (this.params.data.suiteItem) {
                modalRef.componentInstance.suiteItem = true;
            } else {
                modalRef.componentInstance.suiteItem = false;
            }
        }
        // console.log(this.params);
        if (modalRef.componentInstance.out) {
            modalRef.componentInstance.out.subscribe(($e) => {
                //  console.log(this.params.node.id, $e);
                this.params.context.parentChildIstance.updated(this.params.node.id, $e);
                // this.updateFeatures();
            });
        }
    }

    // refresh(): boolean {
    //     return false;
    // }

}
