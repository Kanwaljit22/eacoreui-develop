import { CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule, NgbPopover, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import * as exp from 'constants';
import { EaRestService } from 'ea/ea-rest.service';
import { EaService } from 'ea/ea.service';
import { of } from 'rxjs';
import { MessageService } from 'vnext/commons/message/message.service';
import { BlockUiService } from 'vnext/commons/services/block-ui.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { ProposalRestService } from 'vnext/proposal/proposal-rest.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { VnextService } from 'vnext/vnext.service';
import { IPoolForGrid, PriceEstimateStoreService } from '../price-estimate-store.service';
import { PriceEstimateService } from '../price-estimate.service';

import { AdjustDesiredQtyComponent } from './adjust-desired-qty.component';
import { AdjustDesiredQtyService } from './adjust-desired-qty.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';

class MockProposalRestService {

  postApiCall() {
    return of({
      data: {
       enrollments: [
                      {
                        id: 1,
                        priceInfo:{
                          totalNetBeforeCredit: 1323
                        },
                        pools: [
                          {
                            suites: [
                              {
                                pids: [{
                                  dtls: [
                                    {
                                      name: 'test',
                                      type: 'test',
                                      mappedLineId: 1
                                    }
                                  ],
                                  name: 'test',
                                  type: 'test'
                                }]
                              }
                            ]
                          }
                        ]
                      }
                    ],
          proposal: {
            message: {
              hasError : true
            }
          }          
           } 
      })
    }

  getApiCall(){
    return of({
      data: {
      test: "test"
      },
      error: false
      })
  }

  putApiCall(){
    return of({
      data: {
      test: "test"
      },
      error: false
      })
  }

  getApiCallJson(){
    return of({
      data: {
      test: "test"
      },
      error: false
      })
  }
}


class MockNgbpopver {
  close() {

  }

  open() {

  }
}
let mockNgbPopover: MockNgbpopver;
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
  getApiCallJson(){
    return of({
      data: {

      },
    });
  }
}


describe('AdjustDesiredQtyComponent', () => {
  let component: AdjustDesiredQtyComponent;
  let fixture: ComponentFixture<AdjustDesiredQtyComponent>;

  beforeEach(waitForAsync(() => {
    
    TestBed.configureTestingModule({
      declarations: [ AdjustDesiredQtyComponent, LocalizationPipe ],
      providers: [LocalizationService, VnextService, PriceEstimateService, {provide : EaRestService, useClass: MockEaRestService}, MessageService, EaService, BlockUiService, VnextStoreService, UtilitiesService, CurrencyPipe, ProposalStoreService, PriceEstimateStoreService, {provide: ProposalRestService, useClass: MockProposalRestService}, ProjectStoreService, AdjustDesiredQtyService, {provide : NgbPopover, useClass: MockNgbpopver}, DataIdConstantsService, ElementIdConstantsService, ConstantsService],
      imports: [HttpClientModule, RouterTestingModule,NgbModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustDesiredQtyComponent);
    component = fixture.componentInstance;
    mockNgbPopover = new MockNgbpopver();
    component.poolArray = [
      {
      "enrollmentId": 2,
      "expand": true,
      "poolSuiteLineName": "Full Stack Observability",
      "childs": [
                  {
                    "poolName": "Full Stack Observability",
                    "poolSuiteLineName": "HyperFlex",
                    "purchaseAdjustment": "--",
                    "serviceDiscount": 61,
                    "totalConsumedQty": 0,
                    "totalContractValue": "128,702.40",
                    "weightedDisc": 0,
                    "commitNetPrice": "128,702.40",
                    "desiredQty": 10,
                    "duration": "48 Months",
                    "enrollmentId": 2,
                    "id": null,
                    "inclusion": true,
                    "listPrice": "330,000.00",
                    "maxDiscount": 100,
                    "migration": false,
                    "minDiscount": 0,
                    "ato": "E3-A-HXDP",
                    "commitInfo": {
                      "committed": true,
                      "ibQtyThreshold": { "achieved": 10, "required": 0 },
                      "qtyThreshold": null,
                      "threshold": 50000
                    },
                    "multiProgramDesc": { "msd": 0, "mpd": 0, "med": 0, "bundleDiscount": 0 },
                    "childs": [{
                      "ato": "E3-A-HXDP",
                    }]
                  }
               ]
        }
      ];

    component.selectedAto = 'E3-A-HXDP';
    component.selectedPool = 'Full Stack Observability';
    component.selectedSuite = {
      hasPids: false,
      childs : [
        {
          pidName: 'test',
          ato: 'E3-A-HXDP',
          id: 1
        }
      ]
    }
    fixture.detectChanges();
  });

  it('should create', () => {
    const arr =  [
      {
      "enrollmentId": 1,
      "expand": true,
      "poolSuiteLineName": "Full Stack Observability",
      "childs": [
                  {
                    "poolName": "Full Stack Observability",
                    "poolSuiteLineName": "HyperFlex",
                    "purchaseAdjustment": "--",
                    "serviceDiscount": 61,
                    "totalConsumedQty": 0,
                    "totalContractValue": "128,702.40",
                    "weightedDisc": 0,
                    "commitNetPrice": "128,702.40",
                    "desiredQty": 10,
                    "duration": "48 Months",
                    "enrollmentId": 2,
                    "id": null,
                    "inclusion": true,
                    "listPrice": "330,000.00",
                    "maxDiscount": 100,
                    "migration": false,
                    "minDiscount": 0,
                    "ato": "E3-A-HXDP",
                    "commitInfo": {
                      "committed": true,
                      "ibQtyThreshold": { "achieved": 10, "required": 0 },
                      "qtyThreshold": null,
                      "threshold": 50000
                    },
                    "multiProgramDesc": { "msd": 0, "mpd": 0, "med": 0, "bundleDiscount": 0 },
                    "childs": [{
                      "ato": "E3-A-HXDP",
                    }]
                  }
               ]
        }
      ];
    expect(component).toBeTruthy();
  });

  it('should call ngOnChanges', () => {
    const arr =  [
      {
      "enrollmentId": 1,
      "expand": true,
      "poolSuiteLineName": "Full Stack Observability",
      "childs": [
                  {
                    "poolName": "Full Stack Observability",
                    "poolSuiteLineName": "HyperFlex",
                    "purchaseAdjustment": "--",
                    "serviceDiscount": 61,
                    "totalConsumedQty": 0,
                    "totalContractValue": "128,702.40",
                    "weightedDisc": 0,
                    "commitNetPrice": "128,702.40",
                    "desiredQty": 10,
                    "duration": "48 Months",
                    "enrollmentId": 2,
                    "id": null,
                    "inclusion": true,
                    "listPrice": "330,000.00",
                    "maxDiscount": 100,
                    "migration": false,
                    "minDiscount": 0,
                    "ato": "E3-A-HXDP",
                    "commitInfo": {
                      "committed": true,
                      "ibQtyThreshold": { "achieved": 10, "required": 0 },
                      "qtyThreshold": null,
                      "threshold": 50000
                    },
                    "multiProgramDesc": { "msd": 0, "mpd": 0, "med": 0, "bundleDiscount": 0 },
                    "childs": [{
                      "ato": "E3-A-HXDP",
                    }]
                  }
               ]
        }
      ];
      const getSelected = jest.spyOn(component, 'getSelectedSuiteDetails');
      component.selectedSuite = {
        hasPids: false,
        childs : [
          {
            pidName: 'test',
            ato: 'E3-A-HXDP',
            id: 1
          }
        ]
      }
      component.ngOnChanges({
        poolArray: new SimpleChange(null, arr, false)
      });
    fixture.detectChanges();
    expect(getSelected).toHaveBeenCalled();
  });

  it('should call ngOnChanges', () => {
    const arr =  [
      {
      "enrollmentId": 1,
      "expand": true,
      "poolSuiteLineName": "Full Stack Observability",
      "childs": [
                  {
                    "poolName": "Full Stack Observability",
                    "poolSuiteLineName": "HyperFlex",
                    "purchaseAdjustment": "--",
                    "serviceDiscount": 61,
                    "totalConsumedQty": 0,
                    "totalContractValue": "128,702.40",
                    "weightedDisc": 0,
                    "commitNetPrice": "128,702.40",
                    "desiredQty": 10,
                    "duration": "48 Months",
                    "enrollmentId": 2,
                    "id": null,
                    "inclusion": true,
                    "listPrice": "330,000.00",
                    "maxDiscount": 100,
                    "migration": false,
                    "minDiscount": 0,
                    "ato": "E3-A-HXDP",
                    "commitInfo": {
                      "committed": true,
                      "ibQtyThreshold": { "achieved": 10, "required": 0 },
                      "qtyThreshold": null,
                      "threshold": 50000
                    },
                    "multiProgramDesc": { "msd": 0, "mpd": 0, "med": 0, "bundleDiscount": 0 },
                    "childs": [{
                      "ato": "E3-A-HXDP",
                    }]
                  }
               ]
        }
      ];
      component.selectedSuite = {
      hasPids: false,
      childs : [
        {
          pidName: 'test',
          ato: 'E3-A-HXDP',
          id: 1
        }
      ]
    }
      component.ngOnChanges({
        poolArray: new SimpleChange(null, arr, true)
      });
      
    fixture.detectChanges();
  });

  it('should call ngOnInit', () => {
    component.poolArray = [
      {
      "enrollmentId": 2,
      "expand": true,
      "poolSuiteLineName": "Full Stack Observability",
      "childs": [
                  {
                    "poolName": "Full Stack Observability",
                    "poolSuiteLineName": "HyperFlex",
                    "purchaseAdjustment": "--",
                    "serviceDiscount": 61,
                    "totalConsumedQty": 0,
                    "totalContractValue": "128,702.40",
                    "weightedDisc": 0,
                    "commitNetPrice": "128,702.40",
                    "desiredQty": 10,
                    "duration": "48 Months",
                    "enrollmentId": 2,
                    "id": null,
                    "inclusion": true,
                    "listPrice": "330,000.00",
                    "maxDiscount": 100,
                    "migration": false,
                    "minDiscount": 0,
                    "ato": "E3-A-HXDP",
                    "commitInfo": {
                      "committed": true,
                      "ibQtyThreshold": { "achieved": 10, "required": 0 },
                      "qtyThreshold": null,
                      "threshold": 50000
                    },
                    "multiProgramDesc": { "msd": 0, "mpd": 0, "med": 0, "bundleDiscount": 0 },
                    "childs": [{
                      "ato": "E3-A-HXDP",
                    }]
                  }
               ]
        }
      ];
    const adjustService = fixture.debugElement.injector.get(AdjustDesiredQtyService);
    const proposalStoreService = fixture.debugElement.injector.get(ProposalStoreService);
    proposalStoreService.proposalData.currencyCode = 'USD';
    const getSelected = jest.spyOn(component, 'getSelectedSuiteDetails');
    component.ngOnInit();
    
   expect(adjustService.displayMsgForAdjDesiredQty).toBe(false);
   expect(component.currencyCode).toEqual(proposalStoreService.proposalData.currencyCode)
    expect(getSelected).toHaveBeenCalled();
  });

  it('should call showConfigError', () => {
    const msgObj = {
      text: 'test',
      severity: 'ERROR',
      code: ''
    }
    component.showConfigError();
  })

  it('should call getSelectedSuiteDetails', () => {

    const resetFunc = jest.spyOn(component, 'resetColumnsValue');
    component.selectedSuite = {
      hasPids: false,
      childs : [
        {
          pidName: 'test',
          ato: 'E3-A-HXDP',
          id: 1
        }
      ]
    }
    component.poolArray = [
      {
      "enrollmentId": 2,
      "expand": true,
      "poolSuiteLineName": "Full Stack Observability",
      "childs": [
                  {
                    "poolName": "Full Stack Observability",
                    "poolSuiteLineName": "HyperFlex",
                    "purchaseAdjustment": "--",
                    "serviceDiscount": 61,
                    "totalConsumedQty": 0,
                    "totalContractValue": "128,702.40",
                    "weightedDisc": 0,
                    "commitNetPrice": "128,702.40",
                    "desiredQty": 10,
                    "duration": "48 Months",
                    "enrollmentId": 2,
                    "id": null,
                    "inclusion": true,
                    "listPrice": "330,000.00",
                    "maxDiscount": 100,
                    "migration": false,
                    "hasPids": true,
                    "minDiscount": 0,
                    "ato": "E3-A-HXDP",
                    "commitInfo": {
                      "committed": true,
                      "ibQtyThreshold": { "achieved": 10, "required": 0 },
                      "qtyThreshold": null,
                      "threshold": 50000
                    },
                    "multiProgramDesc": { "msd": 0, "mpd": 0, "med": 0, "bundleDiscount": 0 },
                    "childs": [{
                      "ato": "E3-A-HXDP",
                      "hasPids": true
                    }]
                  }
               ]
        }
      ];
    
    component.getSelectedSuiteDetails();
    expect(resetFunc).toHaveBeenCalled();
  });

  it('should call mapValuesForLine', () => {
    component.selectedSuite = {
      hasPids: false,
      childs : [
        {
          pidName: 'test',
          id: 1
        }
      ]
    }

    let pid = [{
      dtls: [
        {
          name: 'test',
          type: 'test',
          mappedLineId: 1
        }
      ],
      name: 'test',
      type: 'test'
    }]
    component.mapValuesForLine(pid);
  });

  it('should call changeSuite', () => {
    let suite = {
      "poolSuiteLineName" : "test"
    }
    component.selectedSuite = {
      poolSuiteLineName : "test1",
      hasPids: true
    }
    component.changeSuite(suite);

     suite = {
      "poolSuiteLineName" : "test"
    }
    component.selectedSuite = {
      "poolSuiteLineName" : "test"
    }
    component.changeSuite(suite);

  })

  it('should call done with updatedPidsArray length', () => {
    component.updatedPidsArray  = [
      {
        "name": "test",
        "dtls": [{
          "mappedLineId": 1
        }]
      }
    ]
    component.done();
  })

  it('should call done without updatedPidsArray length', () => {
    component.updatedPidsArray  = [ ];
    const closed = jest.spyOn(component, 'close');
    component.done();
    expect(closed).toHaveBeenCalled();
  })

  it('should call changePool ', () => {
    let pool = {
          "poolSuiteLineName" : "test"
        }
      component.selectedPool  = "test1"
     component.changePool(pool);
     pool = {
      "poolSuiteLineName" : "test"
    }
   component.selectedPool  = "test"
   component.changePool(pool);
  })

  it('should call updateQty ', () => {
    component.isValuesUpdated = true;
    let lineItem = {
      poolName: "group"
    }
    let type = 'ADVANTAGE';
    component.updateQty(lineItem, type)

    component.isValuesUpdated = false;
    component.updateQty(lineItem, type)
  })

  it('should call updateQtyForPid ', () => {
    component.isValuesUpdated = true;
    let pid = {
      poolName: "group"
    }
    let type = 'ADVANTAGE';
    component.updateQtyForPid(pid, type)

    component.isValuesUpdated = false;
    component.updateQtyForPid(pid, type)
  })

  it('should call selectSupport ', () => {
    let pidItem = {
      pidName: 'test'
    }

    const service = fixture.debugElement.injector.get(AdjustDesiredQtyService);
    service.selectedSupportPid.pidName = 'test'
    component.selectSupport(pidItem);

    component.updatedPidsArray  = [
      {
        "name": "test",
        "dtls": [{
          "mappedLineId": 1
        }]
      }
    ]

    service.selectedSupportPid.pidName = 'test1'
    component.selectSupport(pidItem);
  })

  it('should call recalculatePidData ', () => {
    let proposalStoreService = fixture.debugElement.injector.get(ProposalStoreService)
    proposalStoreService.proposalData.enrollments = [{
      id:1
    }]
    component.recalculatePidData();

    proposalStoreService = fixture.debugElement.injector.get(ProposalStoreService)
    proposalStoreService.proposalData.enrollments = [{
      id:2
    }]
    component.recalculatePidData();

    component.updatedPidsArray  = [
      {
        "name": "test",
        "dtls": [{
          "mappedLineId": 1
        }]
      }
    ]
    component.recalculatePidData(true);
  });

  it('should call onChange ', () => {
    const event = 'test';
    component.onChange(event);
  })

  it('should call checkUpdatedQty ', () => {
    
    const event = {
      keyCode:8,
      key:8
    };
    component.checkUpdatedQty(event);

    const event1 = {
      keyCode: 'test'
    };
    const e = { preventDefault: () => {} }
    jest.spyOn(e, 'preventDefault')
    component.checkUpdatedQty(e);

    component.checkUpdatedQty(e);
    expect(e.preventDefault).toHaveBeenCalled();

    
  })

  it('should call checkUpdatedQty ', () => {
    const event = {
      keyCode:8,
      key: 'Tab'
    };
    component.checkUpdatedQty(event);
 })

it('should call showCommitMessage ', () => {
   component.selectedSuite = {
      commitInfo : {
        committed: true
      }
   }
  
   component.showCommitMessage();

   component.selectedSuite = {
      commitInfo : {
        committed: false
      }
    }
    component.showCommitMessage();
  })

  // it('should call showCommitMessage ', () => {
  //   const msgObj = {
  //     severity: 'SUCCESS'
  //   }
  //   const adjustService = fixture.debugElement.injector.get(AdjustDesiredQtyService);
  //   const msgService = fixture.debugElement.injector.get(MessageService);
  //   component.showCommitMessage();
  //    tick(5000);
  //    expect(adjustService.displayMsgForAdjDesiredQty).toBeFalsy();
  //    flush();
  // })

  it('should call getSelectedSupportPid', () => {
    const message = ['test'];
    const set = new Set(message);
    const service = fixture.debugElement.injector.get(PriceEstimateService);
    service.messageMap.set('PID-test', set)
    component.selectedSuite = {
      childs : [
        {
          pidName: 'test',
          ato: 'test'
        }
      ]
    }
    component.getSelectedSupportPid();

    service.messageMap.set('ATO-test', set)
    component.getSelectedSupportPid();

  })

  it('should call getSelectedSupportPid', () => {
    const message = ['test'];
    const set = new Set(message);
    const service = fixture.debugElement.injector.get(PriceEstimateService);
    service.messageMap.set('AT-test', set)
    component.selectedSuite = {
      childs : [
        {
          pidName: 'test',
          ato: 'test'
        }
      ]
    }
    component.getSelectedSupportPid();
    expect(component.showModifyReq).toBe(false)
  })

  it('should call checkForSecurityTier', () => {
    let securityTier = 'Tier 0'
    component.checkForSecurityTier(securityTier);

    securityTier = 'Tier 1'
    component.checkForSecurityTier(securityTier);
  })

  it('should call redirectToCommitRulesPage', () => {
    window.open = function () { return window; }
    let call = jest.spyOn(window, "open");
    component.redirectToCommitRulesPage();
    expect(call).toHaveBeenCalled();
  })

  it('should call showOrHideTotalConsumedQty', () => {
    component.showQtyForFollowOn = false;
    component.showOrHideTotalConsumedQty();

    component.showQtyForFollowOn = true;
    component.showOrHideTotalConsumedQty();
  })

  it('should call selectReason', () => {
    const reason = 'test'
    component.selectReason(reason);
  })  
  it('should call onPaste', () => {
    const mockClipboardData = {
      getData: (format: string) => 'mocked pasted data'
    };
    
    const mockEvent = {
      clipboardData: mockClipboardData,
      preventDefault: function(){}
    } as ClipboardEvent;
    component.onPaste(mockEvent);
    expect(component.showModifyReq).toBe(false)
  })
  it('should call removeWebexSuite', () => {
    component.selectedPoolObj = {childs:[]}
    component.removeWebexSuite();
    expect(component.showModifyReq).toBe(false)
  })  
  it('should call withdrawRequest', fakeAsync(() => {
    component.proposalStoreService.proposalData = {objId:'1'}
    const response = {data:{}}
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "postApiCall").mockReturnValue(of(response));
    component.withdrawRequest();
    expect(component.showModifyReq).toBe(false)
    flush();
  })  )
  it('should call reqOverrideCommit', fakeAsync(() => {
    component.overRideExceptionInfo = {selectedReasons:[{}]}
    component.proposalStoreService.proposalData = {objId:'1'}
    const response = {data:{}}
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "postApiCall").mockReturnValue(of(response));
    component.reqOverrideCommit();
    expect(component.showModifyReq).toBe(false)
    flush();
  })  )
  it('should call showPopover', () => {
    component.selectedSuite = {commitInfo:{overrideReason:'test'}}
    component.proposalStoreService.proposalData = {objId:'1'}
    const response = {data:{}}
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "getApiCall").mockReturnValue(of(response));
    component.showPopover();
    expect(component.showModifyReq).toBe(false)

  })  
  it('should call showCommitMessage 1', fakeAsync(() => {
    component.selectedSuite = {commitInfo:{overrideReason:'test'}}
    component.selectedPoolObj = {childs:[]}
    component.eaService.features.STO_REL = true
    component.showCommitMessage();
    expect(component.showModifyReq).toBe(false)
    flush();
  }) )
  it('should call showCommitMessage 2', fakeAsync(() => {
    component.selectedSuite = {commitInfo:{committed:true,overrideReason:'test'}}
    component.selectedPoolObj = {childs:[]}
    component.eaService.features.STO_REL = true
    component.showCommitMessage();
    expect(component.showModifyReq).toBe(false)
    flush();
  }) )
  it('should call updateQty 1 ', () => {
    component.adjustDesiredQtyService.desiredQtyColumnsData = [{type:'test'}]
    component.eaService.features.FIRESTORM_REL = true
    component.selectedSuite = {isDnxTierSuite:true}
    component.isValuesUpdated = true;
    let lineItem = {
      poolName: "group",
      ADVANTAGE_maxQty:0,
      test_maxQtyInvalid:5
    }
    let type = 'ADVANTAGE';
    component.updateQty(lineItem, type)
    expect(component.showModifyReq).toBe(false)
  })
  it('should call updateQty 2', () => {
    component.adjustDesiredQtyService.desiredQtyColumnsData = [{type:''}]
    component.eaService.features.FIRESTORM_REL = true
    component.selectedSuite = {isDnxTierSuite:true,childs:[{dnxQtyError:true}]}
    component.isValuesUpdated = true;
    component.qtyLineError = true
    let lineItem = {
      poolName: "group",
      ADVANTAGE_maxQty:0,
      test_maxQtyInvalid:5
    }
    let type = 'ADVANTAGE';
    component.updateQty(lineItem, type)
    expect(component.showModifyReq).toBe(false)
  })
  it('should call mapValuesForLine 1', () => {
    component.eaService.features.FIRESTORM_REL = true
    component.isValidationUI = true
    component.selectedSuite = {
      hasPids: false,
      childs : [
        {
          pidName: 'test',
          id: 1,
          ato:'',
          pidNameCX_HW_SUPPORT:'test'
        }
      ]
    }

    let pid = [{
      dtls: [
        {
          name: 'test',
          type: 'test',
          mappedLineId: 1
        }
      ],
      name: 'test',
      type: 'test'
    }]
    const set1 = new Set<string>()
    set1.add('12442124')
    component.selectedSuite ={tiers:[{hasEmbeddedHwSupport:true}]}
    component.mapValuesForLine(pid);
    expect(component.showModifyReq).toBe(false)
  });
  
});
