import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppDataService } from '@app/shared/services/app.data.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { ConstantsService } from '@app/shared/services/constants.service';


@Injectable()
export class TcoDataService {

  // This variable is use to value will change in case of create scenario.
  conponentNumToLoad = 0;
  tcoId: number; // This will be center place where we'll store tco Id
  tcoDataObj: any; // This will store tco selected data.
  tcoMetaData: any; // This will store tco all three pages meta data.
  tcoModelingData: any = []; // This will store tcoModeling data
  tcoSummaryData = []; // This will store tcoSummary data
  isTcoMetadataLoaded = false; // metadataloaded flag to check if loaded not for reducing api calls
  catalogueMetaData: any; // to store catalogue data from metadata Api
  selectedCatalogueData: any;
  isHeaderLoaded = false;
  idNameMap = new Map<string, string>();
  disableMode = false;
  isMetaDataLoaded = false;
  tcoCreateAccess = false;
  loadReviewFinalize = false;
  tcoBarData: any = [
    {
      'quarter': 'Business-As-Usual',
      'areas': [
        {
          'state': 'ALC',
          'freq': {
            'EP': 0,
            'OB': 0,
            'GB': 0,
            'LCB': 0,
            'PC': 0,
            'eaBenefit': 0
          },
          'operationalEfficiency': {
            'operationalEffieciency': 0,
            'rOperations': 0,
            'ngTime': 0,
            'svPricing': 0
          },
          'GrowthBenefits': {
            'growth': 0,
            'timeValueMoney': 0,
            'alaCarte1yrSku': 0
          },
          'trueForwardBenefits': {
            'trueFroward': 0,
            'rbValue': 0
          },
          'PromotionCost': {
            'ramp': 0,
            'starterKit': 0,
          }
        }
      ]
    },
    {
      'quarter': 'Enterprise Agreement',
      'areas': [
        {
          'state': 'EA Net Price',
          'freq': {
            'eaBenefit': 0,
            'EP': 0,
            'OB': 0,
            'GB': 0,
            'LCB': 0,
            'PC': 0
          },
          'eaBenefits': {
            'eaPricing': 0,
            'benefit': 0
          }
        }
      ]
    }
  ];

  constructor(private http: HttpClient, private appDataService: AppDataService, private utilitiesService: UtilitiesService,
    private constantsService: ConstantsService) {
  }

  // method to check and set dcn free appliance for DC arch in promotion cost graph data
  setDcnInGraphData(arcName){
    let businessGraph = this.tcoBarData[0]['areas'];
    if(arcName === this.constantsService.DC){
      businessGraph[0][this.constantsService.TCO_METADATA_IDS.PromotionCost][this.constantsService.TCO_METADATA_IDS.dcnFreeAppliance] = 0
    } else {
      businessGraph[0][this.constantsService.TCO_METADATA_IDS.PromotionCost][this.constantsService.TCO_METADATA_IDS.dnac] = 0
    }
    return;
  }

  // this method will set the summary data for showing selected outcomes on TCO review & finalize page
  getTcoSummaryData(data, metadata) {
    if (data) {
      // check and take each prop from outcome data
      for (let prop in data) {
        // check each prop from outcome data in metadata and if data of prop is not empty
        if (metadata['catalogueCategory'][prop]['label'] && data[prop].length > 0) {
          // get the lebel of that prop from metadata and set to name in summary data
          const name = metadata['catalogueCategory'][prop]['label'];
          // push the name and data of the prop to summarydata
          this.tcoSummaryData.push({ 'title': name, 'value': data[prop] });
        }
      }
      return this.tcoSummaryData; // return the data
    }
  }

  prepareGraph1(tcoDataObject) {
    const graphData = tcoDataObject.graph;
    const bussinessAsUsual = graphData.businessAsUsual;
    const enterpriceValues = graphData.enterpriseAgreement;

    // to set dnac/dcnfreeappliance for DC arch
    this.setDcnInGraphData(tcoDataObject.archName);
    const bgraphArea = this.tcoBarData[0]['areas'];
    const egraphArea = this.tcoBarData[1]['areas'];
    let visible;
    if (bussinessAsUsual) {
      for (let i = 0; i < bussinessAsUsual.length; i++) {
        if (bussinessAsUsual[i]['key'] === this.constantsService.TCO_METADATA_IDS.Pricing) {
          bgraphArea[0]['freq']['EP'] = bussinessAsUsual[i]['value'];
          bgraphArea[0].pricingName = 'BAU ' + this.constantsService.TCO_METADATA_NAMES.netPrice;
        } else if (bussinessAsUsual[i]['key'] === this.constantsService.TCO_METADATA_IDS.trueForwardBenefits) {
          bgraphArea[0]['freq']['LCB'] = bussinessAsUsual[i]['value'];
          const distributions = bussinessAsUsual[i]['distributions'];
          if (distributions) {
            for (let j = 0; j < distributions.length; j++) {
              if (distributions[j]['key'] === this.constantsService.TCO_METADATA_IDS.trueFroward) {
                visible = this.getVisibleFlag(bussinessAsUsual[i]['key'], distributions[j]['key']);
                bgraphArea[0][this.constantsService.TCO_METADATA_IDS.trueForwardBenefits][this.constantsService.TCO_METADATA_IDS.trueFroward + '_visible'] = visible;
                bgraphArea[0][this.constantsService.TCO_METADATA_IDS.trueForwardBenefits][this.constantsService.TCO_METADATA_IDS.trueFroward] = distributions[j]['value'];
                const name = this.idNameMap.get(this.constantsService.TCO_METADATA_IDS.trueFroward);
                bgraphArea[0][this.constantsService.TCO_METADATA_IDS.trueForwardBenefits][this.constantsService.TCO_METADATA_IDS.trueFroward + 'Name'] = this.constantsService.TCO_METADATA_NAMES.trueFroward;
              }
              // commented out for further use
              // else if(distributions[j]['key'] === this.constantsService.TCO_METADATA_IDS.rampCost){
              //   bgraphArea[0][this.constantsService.TCO_METADATA_IDS.trueForwardBenefits]['rbValue'] = distributions[j]['value'];
              //    visible = this.getVisibleFlag(bussinessAsUsual[i]['key'],distributions[j]['key']); 
              //   bgraphArea[0][this.constantsService.TCO_METADATA_IDS.trueForwardBenefits]['rbValue_visible'] = visible; 
              //   const name  = this.idNameMap.get(this.constantsService.TCO_METADATA_IDS.rampCost);
              //   bgraphArea[0][this.constantsService.TCO_METADATA_IDS.trueForwardBenefits][this.constantsService.TCO_METADATA_IDS.rampCost + 'Name'] = this.constantsService.TCO_METADATA_NAMES.rampCost;
              // }
            }
          }
        } else if (bussinessAsUsual[i]['key'] === this.constantsService.TCO_METADATA_IDS.GrowthBenefits) {
          bgraphArea[0]['freq']['GB'] = bussinessAsUsual[i]['value'];
          const distributions = bussinessAsUsual[i]['distributions'];
          if (distributions) {
            for (let j = 0; j < distributions.length; j++) {
              if (distributions[j]['key'] === this.constantsService.TCO_METADATA_IDS.growth) {
                bgraphArea[0][this.constantsService.TCO_METADATA_IDS.GrowthBenefits][this.constantsService.TCO_METADATA_IDS.growth] = distributions[j]['value'];
                visible = this.getVisibleFlag(bussinessAsUsual[i]['key'], distributions[j]['key']);
                bgraphArea[0][this.constantsService.TCO_METADATA_IDS.GrowthBenefits][this.constantsService.TCO_METADATA_IDS.growth + '_visible'] = visible;
                const name = this.idNameMap.get(this.constantsService.TCO_METADATA_IDS.growth);
                bgraphArea[0][this.constantsService.TCO_METADATA_IDS.GrowthBenefits][this.constantsService.TCO_METADATA_IDS.growth + 'Name'] = this.constantsService.TCO_METADATA_NAMES.growth;
              } else if (distributions[j]['key'] === this.constantsService.TCO_METADATA_IDS.alaCarte1yrSku) {
                bgraphArea[0][this.constantsService.TCO_METADATA_IDS.GrowthBenefits][this.constantsService.TCO_METADATA_IDS.alaCarte1yrSku] = distributions[j]['value'];
                visible = this.getVisibleFlag(bussinessAsUsual[i]['key'], distributions[j]['key']);
                const name = this.idNameMap.get(this.constantsService.TCO_METADATA_IDS.alaCarte1yrSku);
                bgraphArea[0][this.constantsService.TCO_METADATA_IDS.GrowthBenefits][this.constantsService.TCO_METADATA_IDS.alaCarte1yrSku + 'Name'] = this.constantsService.TCO_METADATA_NAMES.alaCarte1yrSku;
                bgraphArea[0][this.constantsService.TCO_METADATA_IDS.GrowthBenefits][this.constantsService.TCO_METADATA_IDS.alaCarte1yrSku + '_visible'] = visible;
              } else if (distributions[j]['key'] === this.constantsService.TCO_METADATA_IDS.timeValueMoney) {
                bgraphArea[0][this.constantsService.TCO_METADATA_IDS.GrowthBenefits][this.constantsService.TCO_METADATA_IDS.timeValueMoney] = distributions[j]['value'];
                visible = this.getVisibleFlag(bussinessAsUsual[i]['key'], distributions[j]['key']);
                bgraphArea[0][this.constantsService.TCO_METADATA_IDS.GrowthBenefits][this.constantsService.TCO_METADATA_IDS.timeValueMoney + '_visible'] = visible;
                const name = this.idNameMap.get(this.constantsService.TCO_METADATA_IDS.timeValueMoney);
                bgraphArea[0][this.constantsService.TCO_METADATA_IDS.GrowthBenefits][this.constantsService.TCO_METADATA_IDS.timeValueMoney + 'Name'] = this.constantsService.TCO_METADATA_NAMES.timeValueMoney;
              }
            }
          }
        } else if (bussinessAsUsual[i]['key'] === this.constantsService.TCO_METADATA_IDS.operationalEfficiency) {
          bgraphArea[0]['freq']['OB'] = bussinessAsUsual[i]['value'];
          const distributions = bussinessAsUsual[i]['distributions'];
          if (distributions) {
            for (let j = 0; j < distributions.length; j++) {
              if (distributions[j]['key'] === this.constantsService.TCO_METADATA_IDS.operationalEffieciency) {
                bgraphArea[0][this.constantsService.TCO_METADATA_IDS.operationalEfficiency][this.constantsService.TCO_METADATA_IDS.operationalEffieciency] = distributions[j]['value'];
                visible = this.getVisibleFlag(bussinessAsUsual[i]['key'], distributions[j]['key']);
                bgraphArea[0][this.constantsService.TCO_METADATA_IDS.operationalEfficiency][this.constantsService.TCO_METADATA_IDS.operationalEffieciency + '_visible'] = visible;
                const name = this.idNameMap.get(this.constantsService.TCO_METADATA_IDS.operationalEffieciency);
                bgraphArea[0][this.constantsService.TCO_METADATA_IDS.operationalEfficiency][this.constantsService.TCO_METADATA_IDS.operationalEffieciency + 'Name'] = this.constantsService.TCO_METADATA_NAMES.operationalEffieciency;
              } else if (distributions[j]['key'] === this.constantsService.TCO_METADATA_IDS.roperationalEffieciencyName) {
                bgraphArea[0][this.constantsService.TCO_METADATA_IDS.operationalEfficiency][this.constantsService.TCO_METADATA_IDS.rOperations] = distributions[j]['value'];
                visible = this.getVisibleFlag(bussinessAsUsual[i]['key'], distributions[j]['key']);
                bgraphArea[0][this.constantsService.TCO_METADATA_IDS.operationalEfficiency][this.constantsService.TCO_METADATA_IDS.rOperations + '_visible'] = visible;
                const name = this.idNameMap.get(this.constantsService.TCO_METADATA_IDS.roperationalEffieciencyName);
                bgraphArea[0][this.constantsService.TCO_METADATA_IDS.operationalEfficiency][this.constantsService.TCO_METADATA_IDS.rOperations + 'Name'] = this.constantsService.TCO_METADATA_NAMES.rOperations;
              } else if (distributions[j]['key'] === this.constantsService.TCO_METADATA_IDS.FLEX_COST) {
                bgraphArea[0][this.constantsService.TCO_METADATA_IDS.operationalEfficiency][this.constantsService.TCO_METADATA_IDS.flexCost] = distributions[j]['value'];
                visible = this.getVisibleFlag(bussinessAsUsual[i]['key'], distributions[j]['key']);
                bgraphArea[0][this.constantsService.TCO_METADATA_IDS.operationalEfficiency][this.constantsService.TCO_METADATA_IDS.flexCost + '_visible'] = true;
                const name = this.idNameMap.get(this.constantsService.TCO_METADATA_IDS.FLEX_COST);
                bgraphArea[0][this.constantsService.TCO_METADATA_IDS.operationalEfficiency][this.constantsService.TCO_METADATA_IDS.flexCost + 'Name'] = this.constantsService.TCO_METADATA_NAMES.flexCost;
              }
            }
          }
        } else if (bussinessAsUsual[i]['key'] === this.constantsService.TCO_METADATA_IDS.promotionCost) {
          bgraphArea[0]['freq']['PC'] = bussinessAsUsual[i]['value'];
          const distributions = bussinessAsUsual[i]['distributions'];
          if (distributions) {
            for (let j = 0; j < distributions.length; j++) {
              if (distributions[j]['key'] === this.constantsService.TCO_METADATA_IDS.ramp) {
                bgraphArea[0][this.constantsService.TCO_METADATA_IDS.PromotionCost][this.constantsService.TCO_METADATA_IDS.ramp] = distributions[j]['value'];
                visible = this.getVisibleFlag(this.constantsService.TCO_METADATA_IDS.promotionCost, distributions[j]['key']);
                bgraphArea[0][this.constantsService.TCO_METADATA_IDS.PromotionCost][this.constantsService.TCO_METADATA_IDS.ramp + '_visible'] = visible;
                const name = this.idNameMap.get(this.constantsService.TCO_METADATA_IDS.ramp);
                bgraphArea[0][this.constantsService.TCO_METADATA_IDS.PromotionCost][this.constantsService.TCO_METADATA_IDS.ramp + 'Name'] = this.constantsService.TCO_METADATA_NAMES.ramp;
              } else if (distributions[j]['key'] === this.constantsService.TCO_METADATA_IDS.starterKit) {
                bgraphArea[0][this.constantsService.TCO_METADATA_IDS.PromotionCost][this.constantsService.TCO_METADATA_IDS.starterKit] = distributions[j]['value'];
                visible = this.getVisibleFlag(this.constantsService.TCO_METADATA_IDS.promotionCost, distributions[j]['key']);
                const name = this.idNameMap.get(this.constantsService.TCO_METADATA_IDS.starterKit);
                bgraphArea[0][this.constantsService.TCO_METADATA_IDS.PromotionCost][this.constantsService.TCO_METADATA_IDS.starterKit + 'Name'] = this.constantsService.TCO_METADATA_NAMES.starterKit;
                bgraphArea[0][this.constantsService.TCO_METADATA_IDS.PromotionCost][this.constantsService.TCO_METADATA_IDS.starterKit + '_visible'] = visible;
              } else if (distributions[j]['key'] === this.constantsService.TCO_METADATA_IDS.dnac) {
                bgraphArea[0][this.constantsService.TCO_METADATA_IDS.PromotionCost][this.constantsService.TCO_METADATA_IDS.dnac] = distributions[j]['value'];
                visible = this.getVisibleFlag(this.constantsService.TCO_METADATA_IDS.promotionCost, distributions[j]['key']);
                bgraphArea[0][this.constantsService.TCO_METADATA_IDS.PromotionCost][this.constantsService.TCO_METADATA_IDS.dnac + '_visible'] = visible;
                const name = this.idNameMap.get(this.constantsService.TCO_METADATA_IDS.dnac);
                bgraphArea[0][this.constantsService.TCO_METADATA_IDS.PromotionCost][this.constantsService.TCO_METADATA_IDS.dnac + 'Name'] = this.constantsService.TCO_METADATA_NAMES.dnac;
              } else if (distributions[j]['key'] === this.constantsService.TCO_METADATA_IDS.dcnFreeAppliance) {
                bgraphArea[0][this.constantsService.TCO_METADATA_IDS.PromotionCost][this.constantsService.TCO_METADATA_IDS.dcnFreeAppliance] = distributions[j]['value'];
                visible = this.getVisibleFlag(this.constantsService.TCO_METADATA_IDS.promotionCost, distributions[j]['key']);
                bgraphArea[0][this.constantsService.TCO_METADATA_IDS.PromotionCost][this.constantsService.TCO_METADATA_IDS.dcnFreeAppliance + '_visible'] = visible;
                const name = this.idNameMap.get(this.constantsService.TCO_METADATA_IDS.dcnFreeAppliance);
                bgraphArea[0][this.constantsService.TCO_METADATA_IDS.PromotionCost][this.constantsService.TCO_METADATA_IDS.dcnFreeAppliance + 'Name'] = this.constantsService.TCO_METADATA_NAMES.dcnFreeAppliance;
              }
            }
          }
        }
      }
    }
    if (enterpriceValues) {
      for (let i = 0; i < enterpriceValues.length; i++) {
        if (enterpriceValues[i]['key'] === this.constantsService.TCO_METADATA_IDS.Pricing) {
          egraphArea[0]['freq']['EP'] = enterpriceValues[i]['value'];
          egraphArea[0]['eaBenefits']['eaPricing'] = enterpriceValues[i]['value'];
          egraphArea[0].pricingName = 'EA ' + this.constantsService.TCO_METADATA_NAMES.netPrice;
        } else if (enterpriceValues[i]['key'] === 'BENEFITS') {
          egraphArea[0]['eaBenefits']['benefit'] = enterpriceValues[i]['value'];
          // egraphArea[0]['freq']['LCB'] = enterpriceValues[i]['value'];
          const distributions = enterpriceValues[i]['distributions'];
          if (distributions) {
            for (let j = 0; j < distributions.length; j++) {
              if (distributions[j]['key'] === 'SAVINGS') {
                egraphArea[0]['freq']['eaBenefit'] = distributions[j]['value'];
              }
            }
          }
        }
      }
    }
    return this.tcoBarData;
  }

  getVisibleFlag(bauId, distributionId) {
    let distribution;
    let visible = false;
    const metadata = this.tcoMetaData.metadata;
    for (let i = 0; i < metadata.length; i++) {
      if (metadata[i].id === bauId) {
        distribution = metadata[i].list;
        break;
      }
    }
    if (distribution) {
      for (let i = 0; i < distribution.length; i++) {
        if (distribution[i].id === distributionId) {
          visible = distribution[i].visible;
          break;
        }
      }
    }
    return visible;
  }
}
