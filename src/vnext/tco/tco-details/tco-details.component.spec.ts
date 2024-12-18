import { CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EaRestService } from 'ea/ea-rest.service';
import { of } from 'rxjs';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { VnextService } from 'vnext/vnext.service';
import { TcoStoreService } from '../tco-store.service';
import { TcoService } from '../tco.service';

import { TcoDetailsComponent } from './tco-details.component';
class MockEaRestService {
  getApiCall() {
    return of({
      data: {
        smartAccounts: [
          {
            smartAccName: "test",
          },
        ],
        hasEa2Entity: false,
      },
    });
  }
  postApiCall() {
    return of({
      data: {

      },
    });
  }
  putApiCall() {
    return of({
      data: {

      },
    });
  }
  getApiCallJson(){
    return of({
      data: {

      },
    });
  }
  getEampApiCall(){
    return of({
      data: {

      },
    });
  }
}
const mockMetaData = {
  "rid": "EAMP1731533869500",
  "user": "rbinwani",
  "error": false,
  "data": {
      "tcoMetaData": {
          "pricing": {
              "label": "Pricing",
              "advancedModelingAllowed": false,
              "childs": [
                  {
                      "name": "listPrice",
                      "label": "List Price",
                      "info": "Total Price included products as listed in the Cisco List Price Catalog",
                      "referenceId": "listPrice",
                      "isPercentageValue": false,
                      "displaySeq": 1,
                      "alc": {
                          "sw": {
                              "available": true,
                              "enabled": true,
                              "editable": false
                          },
                          "cx": {
                              "available": true,
                              "enabled": true,
                              "editable": false
                          }
                      },
                      "ea": {
                          "sw": {
                              "available": true,
                              "enabled": true,
                              "editable": false
                          },
                          "cx": {
                              "available": true,
                              "enabled": true,
                              "editable": false
                          }
                      }
                  },
                  {
                      "name": "residualValue",
                      "label": "Residual Value",
                      "info": "Remaining value of an existing contract or subscription",
                      "referenceId": "residualValue",
                      "isPercentageValue": false,
                      "displaySeq": 2,
                      "alc": {
                          "sw": {
                              "available": true,
                              "enabled": true,
                              "editable": true
                          },
                          "cx": {
                              "available": true,
                              "enabled": true,
                              "editable": true
                          }
                      },
                      "ea": {
                          "sw": {
                              "available": true,
                              "enabled": true,
                              "editable": true
                          },
                          "cx": {
                              "available": true,
                              "enabled": true,
                              "editable": true
                          }
                      }
                  },
                  {
                      "name": "eaBundleDiscount",
                      "label": "EA Bundle Discount",
                      "info": "Program incentive for building multiple suites within a singal aggrement",
                      "referenceId": "eaBundleDiscount",
                      "isPercentageValue": false,
                      "displaySeq": 3,
                      "alc": {
                          "sw": {
                              "available": true,
                              "enabled": true,
                              "editable": false
                          },
                          "cx": {
                              "available": true,
                              "enabled": true,
                              "editable": false
                          }
                      },
                      "ea": {
                          "sw": {
                              "available": true,
                              "enabled": true,
                              "editable": false
                          },
                          "cx": {
                              "available": true,
                              "enabled": true,
                              "editable": false
                          }
                      }
                  },
                  {
                      "name": "mydDiscount",
                      "label": "Multi-Year Discount",
                      "info": "Multi-Year Discount",
                      "referenceId": "mydDiscount",
                      "isPercentageValue": false,
                      "displaySeq": 3,
                      "alc": {
                          "sw": {
                              "available": true,
                              "enabled": true,
                              "editable": false
                          },
                          "cx": {
                              "available": true,
                              "enabled": true,
                              "editable": false
                          }
                      },
                      "ea": {
                          "sw": {
                              "available": true,
                              "enabled": true,
                              "editable": false
                          },
                          "cx": {
                              "available": true,
                              "enabled": true,
                              "editable": false
                          }
                      }
                  },
                  {
                      "name": "programMigrationDiscount",
                      "label": "Program Migration Discount",
                      "info": "Program Migration Discount",
                      "referenceId": "programMigrationDiscount",
                      "isPercentageValue": false,
                      "displaySeq": 3,
                      "alc": {
                          "sw": {
                              "available": true,
                              "enabled": true,
                              "editable": false
                          },
                          "cx": {
                              "available": true,
                              "enabled": true,
                              "editable": false
                          }
                      },
                      "ea": {
                          "sw": {
                              "available": true,
                              "enabled": true,
                              "editable": false
                          },
                          "cx": {
                              "available": true,
                              "enabled": true,
                              "editable": false
                          }
                      }
                  },
                  {
                      "name": "uncoveredAssetCredit",
                      "label": "Uncovered Asset Credit",
                      "info": "Uncovered Asset Credit",
                      "referenceId": "uncoveredAssetCredit",
                      "isPercentageValue": false,
                      "displaySeq": 3,
                      "alc": {
                          "sw": {
                              "available": true,
                              "enabled": true,
                              "editable": false
                          },
                          "cx": {
                              "available": true,
                              "enabled": true,
                              "editable": false
                          }
                      },
                      "ea": {
                          "sw": {
                              "available": true,
                              "enabled": true,
                              "editable": false
                          },
                          "cx": {
                              "available": true,
                              "enabled": true,
                              "editable": false
                          }
                      }
                  },
                  {
                      "name": "rampPriceAdjustment",
                      "label": "Ramp Price Adjustment",
                      "info": "Ramp Price Adjustment",
                      "referenceId": "rampPriceAdjustment",
                      "isPercentageValue": false,
                      "displaySeq": 3,
                      "alc": {
                          "sw": {
                              "available": true,
                              "enabled": true,
                              "editable": false
                          },
                          "cx": {
                              "available": true,
                              "enabled": true,
                              "editable": false
                          }
                      },
                      "ea": {
                          "sw": {
                              "available": true,
                              "enabled": true,
                              "editable": false
                          },
                          "cx": {
                              "available": true,
                              "enabled": true,
                              "editable": false
                          }
                      }
                  },
                  {
                      "name": "competivePriceAdjustment",
                      "label": "Competive Price Adjustment",
                      "info": "Competive Price Adjustment",
                      "referenceId": "competivePriceAdjustment",
                      "isPercentageValue": false,
                      "displaySeq": 3,
                      "alc": {
                          "sw": {
                              "available": true,
                              "enabled": true,
                              "editable": false
                          },
                          "cx": {
                              "available": true,
                              "enabled": true,
                              "editable": false
                          }
                      },
                      "ea": {
                          "sw": {
                              "available": true,
                              "enabled": true,
                              "editable": false
                          },
                          "cx": {
                              "available": true,
                              "enabled": true,
                              "editable": false
                          }
                      }
                  },
                  {
                      "name": "multiYearDiscount",
                      "label": "Multi Year Discount",
                      "info": "Multi Year Discount",
                      "referenceId": "multiYearDiscount",
                      "isPercentageValue": false,
                      "displaySeq": 3,
                      "alc": {
                          "sw": {
                              "available": true,
                              "enabled": true,
                              "editable": false
                          },
                          "cx": {
                              "available": true,
                              "enabled": true,
                              "editable": false
                          }
                      },
                      "ea": {
                          "sw": {
                              "available": true,
                              "enabled": true,
                              "editable": false
                          },
                          "cx": {
                              "available": true,
                              "enabled": true,
                              "editable": false
                          }
                      }
                  },
                  {
                      "name": "strategicOfferPriceAdjustment",
                      "label": "Strategic Offer Price Adjustment",
                      "info": "Strategic Offer Price Adjustment",
                      "referenceId": "strategicOfferPriceAdjustment",
                      "isPercentageValue": false,
                      "displaySeq": 3,
                      "alc": {
                          "sw": {
                              "available": true,
                              "enabled": true,
                              "editable": false
                          },
                          "cx": {
                              "available": true,
                              "enabled": true,
                              "editable": false
                          }
                      },
                      "ea": {
                          "sw": {
                              "available": true,
                              "enabled": true,
                              "editable": false
                          },
                          "cx": {
                              "available": true,
                              "enabled": true,
                              "editable": false
                          }
                      }
                  },
                  {
                      "name": "discount",
                      "label": "Discount",
                      "info": "Discount",
                      "referenceId": "discount",
                      "isPercentageValue": false,
                      "displaySeq": 3,
                      "alc": {
                          "sw": {
                              "available": true,
                              "enabled": true,
                              "editable": false
                          },
                          "cx": {
                              "available": true,
                              "enabled": true,
                              "editable": false
                          }
                      },
                      "ea": {
                          "sw": {
                              "available": true,
                              "enabled": true,
                              "editable": false
                          },
                          "cx": {
                              "available": true,
                              "enabled": true,
                              "editable": false
                          }
                      }
                  }
              ]
          },
          "partnerMarkup": {
              "label": "Partner Markup",
              "advancedModelingAllowed": false,
              "info": "Additional Premium charged by Partner to cover their cost"
          },
          "growthExpenses": {
              "label": "Growth Expenses",
              "advancedModelingAllowed": true,
              "info": "Additional Premium charged by Partner to cover their cost"
          },
          "inflation": {
              "label": "Time Value of Money",
              "advancedModelingAllowed": true,
              "info": "Esitmated Inflation Cost"
          },
          "additionalCosts": {
              "label": "Additional Costs",
              "advancedModelingAllowed": false,
              "info": "Esitmated Inflation Cost"
          },
          "defaults": {
              "partnerMarkup": 15,
              "growthParameter": 2,
              "inflation": 7
          }
      },
      "enrollmentsConfig": [
          {
              "id": 1,
              "name": "Networking Infrastructure",
              "displaySeq": 1
          },
          {
              "id": 3,
              "name": "Security",
              "displaySeq": 4
          },
          {
              "id": 2,
              "name": "Applications Infrastructure",
              "displaySeq": 2
          },
          {
              "id": 5,
              "name": "Services",
              "displaySeq": 5
          },
          {
              "id": 6,
              "name": "Hybrid Work",
              "displaySeq": 6
          },
          {
              "id": 4,
              "name": "Collaboration",
              "displaySeq": 3
          },
          {
              "id": 10,
              "name": "Provider Connectivity",
              "displaySeq": 5
          }
      ]
  }
}
const mockTcoData = {
  "data":
  {
    "objId":"123",
    "name": "Test TCO",

    "enrollmentsConfig" : [
      {
        "id" : 1,
        "name" : "networking",
        "displaySeq" : 2
      },
      {
        "id" : 2,
        "name" : "application",
        "displaySeq" : 1
      }
    ],
    "savingsInfo": {
      "percent" : "100",
      "amount" : "2",
      "pricing" : {
        "percent" : "99",
        "amount" : "00"
      },
      "partnerMarkup" : {
        "percent" : "99",
        "amount" : "00"
      },
      "growthExpenses" : {
        "percent" : "00",
        "amount" : "00"
      },
      "inflation" : {
        "percent" : "00",
        "amount" : "00"
      },
  
      "softwareEnrollments" : {
        "percent" : "1",
        "amount" : "1",
        "enrollments" : [{
          "id" : 1,
          "name":"application",
          "percent" : "1",
          "amount" : "1"
        },
        {
          "id" : 1,
          "name":"networking",
          "percent" : "1",
          "amount" : "1"
        }]
      },
      "servicesEnrollments" : {
        "percent" : "01",
        "amount" : "01",
        "enrollments" : [{
          "id" : 1,
          "name":"networking",
          "percent" : "01",
          "amount" : "01"
        },
        {
          "id" : 1,
          "name":"application",
          "percent" : "1",
          "amount" : "1"
        }]
      }
    },
    "alc" : {
          "partnerNetPrice" : "101",
          "customerTCO" : "501",
          "pricing" : {
        "sw" : {
          
          "residualValue" : "11",
          "eaBundleDiscount" : "12",
          "discount" : "13"
        },
  
        "cx" : {
          "listPrice" : "14",
          "residualValue" : "15",
          "mydDiscount" : "16",
          "discount" : "17"
        }
          },
          "partnerMarkup" : [
              {
                  "enrollmentId" : 1,
                  "swPercent" : "11",
                  "cxPercent" : "77"
          
              }
          ],
          "growthExpenses" : [
              {
                  "enrollmentId" : 1,
                  "name":"networking",
                  "swPercent" : "",
                  "swCxPercent" : "",
                  "hwCxPercent" : ""
              },
              {
                  "enrollmentId" : 2,
          "swPercent" : "",
                  "swCxPercent" : "",
                  "hwCxPercent" : ""
              }
          ],
      "inflation" : {
              "swPercent" : "4",
              "swCxPercent" : "5",
              "hwCxPercent" : "6"
          },
          "additionalCosts" : [
              {
                  "name" : "Operational Inefficiencies",
                  "id":123,
                  "swPercent" : "9",
                  "cxPercent" : "9"
              },
              {
                "name" : "Operational Inefficiencies 3",
                "id":101,
                "swPercent" : "9",
                "cxPercent" : "9"
            }
          ]
      },
    "ea" : {
      "partnerNetPrice" : "1100",
          "customerTCO" : "5100",
          "pricing" : {
        "sw" : {
          "listPrice" : "21",
          "residualValue" : "22",
          "eaBundleDiscount" : "23",
          "discount" : "24",
          "rampDiscount" : "25"
        },
  
        "cx" : {
          "listPrice" : "26",
          "residualValue" : "27",
          "mydDiscount" : "28",
          "discount" : "29"
        }
          },
      "partnerMarkup" : [
              {
                  "enrollmentId" : 1,
          "name":"networking",
                  "swPercent" : "33",
                  "cxPercent" : "77"
              }
          ],
      "growthExpenses" : [
              {
                  "enrollmentId" : 1,
                  "name":"networking",
                  "swPercent" : "1",
                  "swCxPercent" : "1",
                  "hwCxPercent" : "1"
              },
              {
                  "enrollmentId" : 2,
                  "name":"application",
                  "swPercent" : "2",
                  "swCxPercent" : "2",
                  "hwCxPercent" : "2"
              }
          ],
      "inflation" : {
              "swPercent" : "1",
              "swCxPercent" : "2",
              "hwCxPercent" : "3"
          },
      "additionalCosts" : [
        
        {
          "name" : "Operational Inefficiencies 1",
          "id": 213,
          "swPercent" : "44",
          "cxPercent" : "44"
        },
        {
          "name" : "Operational Inefficiencies 3",
          "id":101,
          "swPercent" : "9",
          "cxPercent" : "9"
      }
      ]
    }
  }
  
}



describe('TcoDetailsComponent', () => {
  let component: TcoDetailsComponent;
  let fixture: ComponentFixture<TcoDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TcoDetailsComponent , LocalizationPipe],
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([
        { path: "ea/project/proposal/:proposalObjId", redirectTo: "" }
      ])],
      providers: [
        TcoService, ProposalStoreService,Router, Renderer2,  VnextService,  { provide: EaRestService, useClass: MockEaRestService },TcoStoreService, CurrencyPipe,ProjectStoreService,
         UtilitiesService,  ConstantsService, LocalizationService, DataIdConstantsService, ElementIdConstantsService ,VnextStoreService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    })
    .compileComponents();

    fixture = TestBed.createComponent(TcoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call oninit', () => {
    component.proposalStoreService.proposalData.objId = '123'
    component.proposalStoreService.tcoCreateFlow = true
    component.ngOnInit()
    expect(component.editName).toBe(false);
  });
  it('should call oninit 1', () => {
    component.proposalStoreService.proposalData.objId = '123'
    component.proposalStoreService.proposalData.buyingProgramTransactionType = component.constantsService.MSEA
    component.ngOnInit()
    expect(component.editName).toBe(false);
  });
  it('should call showHideAppliedDiscounts', () => {
    component.showHideAppliedDiscounts()
    expect(component.showDiscountsApplied).toBe(false);
  });
  it('should call cancelNameChange', () => {
    component.cancelNameChange()
    expect(component.editName).toBe(false);
  });
  it('should call editTcoName', () => {
    component.editTcoName()
    expect(component.editName).toBe(true);
  });
  it('should keyUp 1',  fakeAsync(() => {
    const event = {preventDefault : ()=>{},target:{value: 4311}}
    component.keyUp(event,true);
    expect(component.updatedByUser).toBe(false);
    flush();
  }));
  it('should keyUp 2',  fakeAsync(() => {
    const event = {preventDefault : ()=>{},target:{value: 0}}
    component.keyUp(event,true);
    expect(component.updatedByUser).toBe(false);
    flush();
  }));
  it('should keyUp 3',  fakeAsync(() => {
    const event = {preventDefault : ()=>{},target:{value: 0}}
    component.keyUp(event,false,true);
    expect(component.updatedByUser).toBe(false);
    flush();
  }));
  it('should keyUp 4',  fakeAsync(() => {
    const event = {preventDefault : ()=>{},target:{value: 10}}
    component.keyUp(event,false,true);
    expect(component.updatedByUser).toBe(false);
    flush();
  }));
  it('should keyDown',  () => {
    const event = {keyCode:9,preventDefault : ()=>{},target:{value: 0}}
    component.keyDown(event,true);
    expect(component.updatedByUser).toBe(true);
  });
  it('should keyDown 1',  () => {
    const event = {preventDefault : ()=>{},target:{value: 120}}
    component.keyDown(event,true);
    expect(component.updatedByUser).toBe(false);
  });
  it('should openAdditionalCost',  () => {
    component.openAdditionalCost();
    expect(component.tcoService.addAdditionalCost).toBe(true);
  });
  it('should openAdvancedModelling',  () => {
    component.openAdvancedModelling('Growth Expence');
    expect(component.tcoService.advancedModelling).toBe(true);
  });
  it('should backToProposal',  () => {
    component.backToProposal();
    expect(component.updatedByUser).toBe(false);
  });
  it('should getTcoMetaData',  () => {
    const response = mockMetaData
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.getTcoMetaData();
    expect(component.updatedByUser).toBe(false);
  });
  it('should updateValue 1',  () => {
    const response = mockMetaData
    component.updatedByUser = true
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "putApiCall").mockReturnValue(of(response));
    component.updateValue('pricing','ea','residualValue','cx');
    expect(component.updatedByUser).toBe(false);
  });
  it('should updateValue 2',  () => {
    const response = mockMetaData
    component.updatedByUser = true
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "putApiCall").mockReturnValue(of(response));
    component.updateValue('pricing','ea','residualValue');
    expect(component.updatedByUser).toBe(false);
  });
  it('should updateValue 3',  () => {
    const response = mockMetaData
    component.updatedByUser = true
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "putApiCall").mockReturnValue(of(response));
    component.updateValue('pricing','ea','residualValue', null, {enrollmentId:1});
    expect(component.updatedByUser).toBe(false);
  });
  it('should updateValue 4',  () => {
    const response = mockMetaData
    component.updatedByUser = true
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "putApiCall").mockReturnValue(of(response));
    component.updateValue('pricing','ea','residualValue', null, null, 1);
    expect(component.updatedByUser).toBe(false);
  });
  it('should saveUpdatedName',  () => {
    const response = mockMetaData
    component.tcoName = '  '
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "putApiCall").mockReturnValue(of(response));
    component.saveUpdatedName();
    expect(component.updatedByUser).toBe(false);
  });
  it('should saveUpdatedName 1',  () => {
    const response = mockMetaData
    component.tcoName = 'test'
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "putApiCall").mockReturnValue(of(response));
    component.saveUpdatedName();
    expect(component.updatedByUser).toBe(false);
  });
  it('should fetchTcoData',  () => {
    component.isMetadataLoaded = true
    const response = mockTcoData
    component.tcoStoreService.metaData = mockMetaData.data
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.fetchTcoData();
    expect(component.updatedByUser).toBe(false);
  });
});
