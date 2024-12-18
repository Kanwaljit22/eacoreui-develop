import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TcoApiCallService } from '@app/tco/tco-api-call.service';
import { TcoDataService } from '@app/tco/tco.data.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { ConstantsService } from '@app/shared/services/constants.service';

@Injectable()
export class TcoModelingService {

  META_DATA_ID = ['Pricing', 'True Forward benefits', 'Growth benefits', 'Operational Efficiencies'];

  initialValueMap = new Map<string, any>();




  constructor(private http: HttpClient, private tcoDataService: TcoDataService, private utilitiesService: UtilitiesService,
    private constantsService: ConstantsService) { }

  getGraphData() {
    return this.http
      .get("assets/data/tco-configuration/cisco-one/priceComparison.json");
  }

  getModelingData() {
    return this.http
      .get("assets/data/tco-configuration/tcoModeling.json");
  }

  prepareModelingData(priceComparisonObj, modellingData, tcoMetaData) {

    const tcoDataObj = this.tcoDataService.tcoDataObj;
    // let priceComparisonObj = pricingData['priceComparison'];
    priceComparisonObj['bauDiscount'] = this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(tcoDataObj['businessAsUsual']['averageDiscount'])) + '% ';
    priceComparisonObj['bauPrice'] = tcoDataObj['businessAsUsual']['totalTcoValueWithPA'];
    priceComparisonObj['eaPrice'] = tcoDataObj['enterpriseAgreement']['totalTcoValueWithPA'];
    priceComparisonObj['eaDiscount'] = this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(tcoDataObj['enterpriseAgreement']['averageDiscount'])) + '% ';
    priceComparisonObj['eaBenefitValue'] = tcoDataObj['savings'];
    priceComparisonObj['eabenefitPerc'] = this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(tcoDataObj['benefitsPercent']));
    priceComparisonObj['bauPriceForPrettifyNo'] = tcoDataObj['businessAsUsual']['totalTcoValueWithPA'];
    priceComparisonObj['eaPriceForPrettifyNo'] = tcoDataObj['enterpriseAgreement']['totalTcoValueWithPA'];
    const metaData = tcoMetaData.metadata;
    this.initialValueMap.clear();
    for (let i = 0; i < metaData.length; i++) {

      // commenting out for further development
      // check and hide solution sarter if not present for DNA
      // if (metaData[i].id === this.constantsService.TCO_METADATA_IDS.PromotionCost && tcoDataObj.archName === this.constantsService.DNA){
      //   this.setSolutionStarter(tcoDataObj, metaData[i]);
      // }
      // Filter list values which visible flag as true
      metaData[i]['list'] = metaData[i]['list'].filter((pricingList: any) => pricingList.visible);

      if (metaData[i].id === this.constantsService.TCO_METADATA_IDS.Pricing) {


        const pricingList = metaData[i]['list'];
        for (let j = 0; j < pricingList.length; j++) {
          if (pricingList[j].id === this.constantsService.TCO_METADATA_IDS.avgMultiSuiteDiscount) {
            // Pricing: Average Multi suite Discount             
            pricingList[j]['eavalue'] = this.utilitiesService.formatValue(tcoDataObj['enterpriseAgreement'][this.constantsService.TCO_METADATA_IDS.avgMultiSuiteDiscount]);
            this.initialValueMap.set(this.constantsService.TCO_METADATA_IDS.avgMultiSuiteDiscount + '_eavalue', pricingList[j]['eavalue']);
            this.initialValueMap.set(this.constantsService.TCO_METADATA_IDS.avgMultiSuiteDiscount + '_bauValue', pricingList[j]['bauValue']);
          }else if (pricingList[j].id === this.constantsService.TCO_METADATA_IDS.productListPrice) {
            // Pricing: Product List Price                
            pricingList[j]['eavalue'] = this.utilitiesService.formatWithNoDecimalForDashboard(tcoDataObj['enterpriseAgreement'][this.constantsService.TCO_METADATA_IDS.productListPrice]);
            pricingList[j]['bauValue'] = this.utilitiesService.formatWithNoDecimalForDashboard(tcoDataObj['businessAsUsual'][this.constantsService.TCO_METADATA_IDS.productListPrice]);
            this.initialValueMap.set(this.constantsService.TCO_METADATA_IDS.productListPrice + '_eavalue', pricingList[j]['eavalue']);
            this.initialValueMap.set(this.constantsService.TCO_METADATA_IDS.productListPrice + '_bauValue', pricingList[j]['bauValue']);
          } else if (pricingList[j].id === this.constantsService.TCO_METADATA_IDS.serviceListPrice) {
            // Pricing: Service List Price
            pricingList[j]['eavalue'] = this.utilitiesService.formatWithNoDecimalForDashboard(tcoDataObj['enterpriseAgreement'][this.constantsService.TCO_METADATA_IDS.serviceListPrice]);
            pricingList[j]['bauValue'] = this.utilitiesService.formatWithNoDecimalForDashboard(tcoDataObj['businessAsUsual'][this.constantsService.TCO_METADATA_IDS.serviceListPrice]);
            if (!pricingList[j]['eavalue']) {
              pricingList[j]['eavalue'] = 0.00;
            }
            if (!pricingList[j]['bauValue']) {
              pricingList[j]['bauValue'] = 0.00;
            }
            this.initialValueMap.set(this.constantsService.TCO_METADATA_IDS.serviceListPrice + '_eavalue', pricingList[j]['eavalue']);
            this.initialValueMap.set(this.constantsService.TCO_METADATA_IDS.serviceListPrice + '_bauValue', pricingList[j]['bauValue']);
          } else if (pricingList[j].id === this.constantsService.TCO_METADATA_IDS.averageDiscount) {
            // Pricing: Average Discount
            pricingList[j]['eavalue'] = this.utilitiesService.formatValue(tcoDataObj['enterpriseAgreement'][this.constantsService.TCO_METADATA_IDS.averageDiscount]);
            pricingList[j]['bauValue'] = this.utilitiesService.formatValue(tcoDataObj['businessAsUsual'][this.constantsService.TCO_METADATA_IDS.averageDiscount]);
            this.initialValueMap.set(this.constantsService.TCO_METADATA_IDS.averageDiscount + '_eavalue', pricingList[j]['eavalue']);
            this.initialValueMap.set(this.constantsService.TCO_METADATA_IDS.averageDiscount + '_bauValue', pricingList[j]['bauValue']);
          } else if (pricingList[j].id === this.constantsService.TCO_METADATA_IDS.purchaseAdjustment) {
            // Pricing: Purchase Adjustment
            pricingList[j]['eavalue'] = this.utilitiesService.formatWithNoDecimalForDashboard(tcoDataObj['enterpriseAgreement'][this.constantsService.TCO_METADATA_IDS.purchaseAdjustment]);
            pricingList[j]['bauValue'] = this.utilitiesService.formatWithNoDecimalForDashboard(tcoDataObj['businessAsUsual'][this.constantsService.TCO_METADATA_IDS.purchaseAdjustment]);
            this.initialValueMap.set(this.constantsService.TCO_METADATA_IDS.purchaseAdjustment + '_eavalue', pricingList[j]['eavalue']);
            this.initialValueMap.set(this.constantsService.TCO_METADATA_IDS.purchaseAdjustment + '_bauValue', pricingList[j]['bauValue']);
          } else if (pricingList[j].id === this.constantsService.TCO_METADATA_IDS.rampPurchaseAdjustment) {
            pricingList[j]['eavalue'] = this.utilitiesService.formatWithNoDecimalForDashboard(tcoDataObj['enterpriseAgreement'][this.constantsService.TCO_METADATA_IDS.rampPurchaseAdjustment]);
            pricingList[j]['bauValue'] = this.utilitiesService.formatWithNoDecimalForDashboard(tcoDataObj['businessAsUsual'][this.constantsService.TCO_METADATA_IDS.rampPurchaseAdjustment]);
            if (!pricingList[j]['eavalue']) {
              pricingList[j]['eavalue'] = 0;
            }
            if (!pricingList[j]['bauValue']) {
              pricingList[j]['bauValue'] = 0;
            }
            this.initialValueMap.set(this.constantsService.TCO_METADATA_IDS.rampPurchaseAdjustment + '_eavalue', pricingList[j]['eavalue']);
            this.initialValueMap.set(this.constantsService.TCO_METADATA_IDS.rampPurchaseAdjustment + '_bauValue', pricingList[j]['bauValue']);
            /*} else if (pricingList[j].id === this.constantsService.TCO_METADATA_IDS.markupMargin) {
              //Pricing: Markup Margin
              if (tcoDataObj['enterpriseAgreement'][this.constantsService.TCO_METADATA_IDS.markupMargin] && tcoDataObj['enterpriseAgreement'][this.constantsService.TCO_METADATA_IDS.markupMargin]['value']) {
                pricingList[j]['eavalue'] = this.utilitiesService.formatWithNoDecimalForDashboard(tcoDataObj['enterpriseAgreement'][this.constantsService.TCO_METADATA_IDS.markupMargin]['value']);
                pricingList[j]['eaPercentage'] = this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(tcoDataObj['enterpriseAgreement'][this.constantsService.TCO_METADATA_IDS.markupMargin]['percentage']));
                this.initialValueMap.set(this.constantsService.TCO_METADATA_IDS.markupMargin + '_eavalue', pricingList[j]['eavalue']);
                this.initialValueMap.set(this.constantsService.TCO_METADATA_IDS.markupMargin + '_eaPercentage', pricingList[j]['eaPercentage']);
              } else {
                pricingList[j]['eavalue'] = '';
              }
              if (tcoDataObj['businessAsUsual'][this.constantsService.TCO_METADATA_IDS.markupMargin] && tcoDataObj['businessAsUsual'][this.constantsService.TCO_METADATA_IDS.markupMargin]['value']) {
                pricingList[j]['bauValue'] = this.utilitiesService.formatWithNoDecimalForDashboard(tcoDataObj['businessAsUsual'][this.constantsService.TCO_METADATA_IDS.markupMargin]['value']);
                pricingList[j]['bauPercentage'] = this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(tcoDataObj['businessAsUsual'][this.constantsService.TCO_METADATA_IDS.markupMargin]['percentage']));
                this.initialValueMap.set(this.constantsService.TCO_METADATA_IDS.markupMargin + '_bauValue', pricingList[j]['bauValue']);
                this.initialValueMap.set(this.constantsService.TCO_METADATA_IDS.markupMargin + '_bauPercentage', pricingList[j]['bauPercentage']);
              } else {
                pricingList[j]['bauValue'] = '-';
              }*/
          } else if (pricingList[j].id === this.constantsService.TCO_METADATA_IDS.netPrice) {
            // Pricing: Net Price
            pricingList[j]['eavalue'] = this.utilitiesService.formatWithNoDecimalForDashboard(tcoDataObj['enterpriseAgreement'][this.constantsService.TCO_METADATA_IDS.netPrice]);
            pricingList[j]['bauValue'] = this.utilitiesService.formatWithNoDecimalForDashboard(tcoDataObj['businessAsUsual'][this.constantsService.TCO_METADATA_IDS.netPrice]);
            this.initialValueMap.set(this.constantsService.TCO_METADATA_IDS.netPrice + '_eavalue', pricingList[j]['eavalue']);
            this.initialValueMap.set(this.constantsService.TCO_METADATA_IDS.netPrice + '_bauValue', pricingList[j]['bauValue']);
          } else if (pricingList[j].id === this.constantsService.TCO_METADATA_IDS.netPriceWithPA) {
            // Pricing: Net Price with PA
            pricingList[j]['eavalue'] = this.utilitiesService.formatWithNoDecimalForDashboard(tcoDataObj['enterpriseAgreement'][this.constantsService.TCO_METADATA_IDS.netPriceWithPA]);
            pricingList[j]['bauValue'] = this.utilitiesService.formatWithNoDecimalForDashboard(tcoDataObj['businessAsUsual'][this.constantsService.TCO_METADATA_IDS.netPriceWithPA]);
            this.initialValueMap.set(this.constantsService.TCO_METADATA_IDS.netPriceWithPA + '_eavalue', pricingList[j]['eavalue']);
            this.initialValueMap.set(this.constantsService.TCO_METADATA_IDS.netPriceWithPA + '_bauValue', pricingList[j]['bauValue']);
          } else if (pricingList[j].id === this.constantsService.TCO_METADATA_IDS.netPriceWithoutPA) {
            // Pricing: Net Price with PA
            pricingList[j]['eavalue'] = this.utilitiesService.formatWithNoDecimalForDashboard(tcoDataObj['enterpriseAgreement'][this.constantsService.TCO_METADATA_IDS.netPriceWithoutPA]);
            pricingList[j]['bauValue'] = this.utilitiesService.formatWithNoDecimalForDashboard(tcoDataObj['businessAsUsual'][this.constantsService.TCO_METADATA_IDS.netPriceWithoutPA]);
            this.initialValueMap.set(this.constantsService.TCO_METADATA_IDS.netPriceWithoutPA + '_eavalue', pricingList[j]['eavalue']);
            this.initialValueMap.set(this.constantsService.TCO_METADATA_IDS.netPriceWithoutPA + '_bauValue', pricingList[j]['bauValue']);
          }

        }
      } else if (metaData[i].id === this.constantsService.TCO_METADATA_IDS.partnerMarkupMargin) {
        // Pricing: Markup Margin
        const pricingList = metaData[i]['list'];
        for (let j = 0; j < pricingList.length; j++) {
          if (pricingList[j].id === this.constantsService.TCO_METADATA_IDS.markupMargin) {
            if (tcoDataObj['enterpriseAgreement'][this.constantsService.TCO_METADATA_IDS.markupMargin] && tcoDataObj['enterpriseAgreement'][this.constantsService.TCO_METADATA_IDS.markupMargin]['value']) {
              pricingList[j]['eavalue'] = this.utilitiesService.formatWithNoDecimalForDashboard(tcoDataObj['enterpriseAgreement'][this.constantsService.TCO_METADATA_IDS.markupMargin]['value']);
              pricingList[j]['eaPercentage'] = this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(tcoDataObj['enterpriseAgreement'][this.constantsService.TCO_METADATA_IDS.markupMargin]['percentage']));
              this.initialValueMap.set(this.constantsService.TCO_METADATA_IDS.markupMargin + '_eavalue', pricingList[j]['eavalue']);
              this.initialValueMap.set(this.constantsService.TCO_METADATA_IDS.markupMargin + '_eaPercentage', pricingList[j]['eaPercentage']);
            } else {
              pricingList[j]['eavalue'] = '';
            }
            if (tcoDataObj['businessAsUsual'][this.constantsService.TCO_METADATA_IDS.markupMargin] && tcoDataObj['businessAsUsual'][this.constantsService.TCO_METADATA_IDS.markupMargin]['value']) {
              pricingList[j]['bauValue'] = this.utilitiesService.formatWithNoDecimalForDashboard(tcoDataObj['businessAsUsual'][this.constantsService.TCO_METADATA_IDS.markupMargin]['value']);
              pricingList[j]['bauPercentage'] = this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(tcoDataObj['businessAsUsual'][this.constantsService.TCO_METADATA_IDS.markupMargin]['percentage']));
              this.initialValueMap.set(this.constantsService.TCO_METADATA_IDS.markupMargin + '_bauValue', pricingList[j]['bauValue']);
              this.initialValueMap.set(this.constantsService.TCO_METADATA_IDS.markupMargin + '_bauPercentage', pricingList[j]['bauPercentage']);
            } else {
              pricingList[j]['bauValue'] = '-';
            }
          }
        }
      } else if (metaData[i].id === this.constantsService.TCO_METADATA_IDS.trueForwardBenefits) {
        const pricingList = metaData[i]['list'];
        for (let j = 0; j < pricingList.length; j++) {
          if (pricingList[j].id === this.constantsService.TCO_METADATA_IDS.trueFroward) {
            this.tcoDataService.idNameMap.set(this.constantsService.TCO_METADATA_IDS.trueFroward, pricingList[j].name);
            pricingList[j]['eavalue'] = ' '
            if (tcoDataObj['businessAsUsual'][this.constantsService.TCO_METADATA_IDS.trueFroward] || tcoDataObj['businessAsUsual'][this.constantsService.TCO_METADATA_IDS.trueFroward] === 0) {
              pricingList[j]['bauValue'] = this.utilitiesService.formatWithNoDecimalForDashboard(tcoDataObj['businessAsUsual'][this.constantsService.TCO_METADATA_IDS.trueFroward]);
              if (pricingList[j]['bauValue'] === undefined) {
                pricingList[j]['bauValue'] = 0;
              }
              this.initialValueMap.set(this.constantsService.TCO_METADATA_IDS.trueFroward + '_bauValue', pricingList[j]['bauValue']);
            }
          }
          // commented out for further use
          // else if(pricingList[j].id === this.constantsService.TCO_METADATA_IDS.rampCost){
          //   pricingList[j]['eavalue'] = ' '
          //   if(tcoDataObj['businessAsUsual'][this.constantsService.TCO_METADATA_IDS.rampCost] || tcoDataObj['businessAsUsual'][this.constantsService.TCO_METADATA_IDS.rampCost] === 0) {
          //     pricingList[j]['bauValue'] = this.utilitiesService.formatWithNoDecimalForDashboard(tcoDataObj['businessAsUsual'][this.constantsService.TCO_METADATA_IDS.rampCost]);
          //     if( pricingList[j]['bauValue'] === undefined){
          //       pricingList[j]['bauValue'] = 0;
          //     }
          //     this.initialValueMap.set(this.constantsService.TCO_METADATA_IDS.rampCost + '_bauValue',pricingList[j]['bauValue']);
          //     this.tcoDataService.idNameMap.set(this.constantsService.TCO_METADATA_IDS.rampCost,pricingList[j].name);
          //   }
          // }
        }
      } else if (metaData[i].id === this.constantsService.TCO_METADATA_IDS.GrowthBenefits) {
        const pricingList = metaData[i]['list'];
        for (let j = 0; j < pricingList.length; j++) {
          if (pricingList[j].id === this.constantsService.TCO_METADATA_IDS.growth) {
            // Growth Benefits: Growth
            pricingList[j]['eavalue'] = ' '
            pricingList[j]['bauValue'] = this.utilitiesService.formatWithNoDecimalForDashboard(tcoDataObj['businessAsUsual'][this.constantsService.TCO_METADATA_IDS.growth]['value']);
            pricingList[j]['bauPercentage'] = this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(tcoDataObj['businessAsUsual'][this.constantsService.TCO_METADATA_IDS.growth]['percent']));
            this.initialValueMap.set(this.constantsService.TCO_METADATA_IDS.growth + '_bauValue', pricingList[j]['bauValue']);
            this.initialValueMap.set(this.constantsService.TCO_METADATA_IDS.growth + '_bauPercentage', pricingList[j]['bauPercentage']);
            this.tcoDataService.idNameMap.set(this.constantsService.TCO_METADATA_IDS.growth, pricingList[j].name);
          } else if (pricingList[j].id === this.constantsService.TCO_METADATA_IDS.timeValueMoney) {
            // Growth Benefits: Time Value Money
            this.tcoDataService.idNameMap.set(this.constantsService.TCO_METADATA_IDS.timeValueMoney, pricingList[j].name);
            pricingList[j]['eavalue'] = ' ';
            if (tcoDataObj['businessAsUsual'][this.constantsService.TCO_METADATA_IDS.timeValueMoney]) {
              pricingList[j]['bauValue'] = this.utilitiesService.formatWithNoDecimalForDashboard(tcoDataObj['businessAsUsual'][this.constantsService.TCO_METADATA_IDS.timeValueMoney]['value']);
            }
            if (pricingList[j]['bauValue'] === undefined) {
              pricingList[j]['bauValue'] = 0;
            }
            pricingList[j]['bauPercentage'] = this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(tcoDataObj['businessAsUsual'][this.constantsService.TCO_METADATA_IDS.timeValueMoney]['percent']));
            if (pricingList[j]['bauPercentage'] === undefined) {
              pricingList[j]['bauPercentage'] = 0;
            }
            this.initialValueMap.set(this.constantsService.TCO_METADATA_IDS.timeValueMoney + '_bauValue', pricingList[j]['bauValue']);
            this.initialValueMap.set(this.constantsService.TCO_METADATA_IDS.timeValueMoney + '_bauPercentage', pricingList[j]['bauPercentage']);
          } else if (pricingList[j].id === this.constantsService.TCO_METADATA_IDS.alaCarte1yrSku) {
            // Growth Benefits: A La Carte
            pricingList[j]['eavalue'] = ' ';
            pricingList[j]['bauValue'] = this.utilitiesService.formatWithNoDecimalForDashboard(tcoDataObj['businessAsUsual'][this.constantsService.TCO_METADATA_IDS.alaCarte1yrSku]['value']);
            pricingList[j]['bauPercentage'] = this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(tcoDataObj['businessAsUsual'][this.constantsService.TCO_METADATA_IDS.alaCarte1yrSku]['percent']));
            this.initialValueMap.set(this.constantsService.TCO_METADATA_IDS.alaCarte1yrSku + '_bauValue', pricingList[j]['bauValue']);
            this.initialValueMap.set(this.constantsService.TCO_METADATA_IDS.alaCarte1yrSku + '_bauPercentage', pricingList[j]['bauPercentage']);
            this.tcoDataService.idNameMap.set(this.constantsService.TCO_METADATA_IDS.alaCarte1yrSku, pricingList[j].name);
          }
        }
      } else if (metaData[i].id === this.constantsService.TCO_METADATA_IDS.operationalEfficiency) {
        const pricingList = metaData[i]['list'];
        for (let j = 0; j < pricingList.length; j++) {
          if (pricingList[j].id === this.constantsService.TCO_METADATA_IDS.operationalEffieciency) {
            this.tcoDataService.idNameMap.set(this.constantsService.TCO_METADATA_IDS.operationalEffieciency, pricingList[j].name);
            pricingList[j]['eavalue'] = this.utilitiesService.formatWithNoDecimalForDashboard(tcoDataObj['enterpriseAgreement'][this.constantsService.TCO_METADATA_IDS.operationalEffieciency]);
            if (tcoDataObj['businessAsUsual'][this.constantsService.TCO_METADATA_IDS.operationalEffieciency] || tcoDataObj['businessAsUsual'][this.constantsService.TCO_METADATA_IDS.operationalEffieciency] === 0) {
              pricingList[j]['bauValue'] = this.utilitiesService.formatWithNoDecimalForDashboard(tcoDataObj['businessAsUsual'][this.constantsService.TCO_METADATA_IDS.operationalEffieciency]);
              if (pricingList[j]['bauValue'] === undefined) {
                pricingList[j]['bauValue'] = 0;
              }
              this.initialValueMap.set(this.constantsService.TCO_METADATA_IDS.operationalEffieciency + '_bauValue', pricingList[j]['bauValue']);
            }
          }
          //  else if(pricingList[j].name === 'Additional Cost'){
          //   pricingList[j]['eavalue'] = '-';
          //   pricingList[j]['bauValue'] = this.utilitiesService.formatWithNoDecimalForDashboard(tcoDataObj['businessAsUsual']['additionalCost']);
          // }
        }
      } else if (metaData[i].id === this.constantsService.TCO_METADATA_IDS.PromotionCost) {
        const pricingList = metaData[i]['list'];
        for (let j = 0; j < pricingList.length; j++) {
          if (pricingList[j].id === this.constantsService.TCO_METADATA_IDS.ramp) {
            // Pricing: ramp
            pricingList[j]['eavalue'] = '',
              pricingList[j]['bauValue'] = this.utilitiesService.formatWithNoDecimalForDashboard(tcoDataObj['businessAsUsual'][this.constantsService.TCO_METADATA_IDS.promotionCost][this.constantsService.TCO_METADATA_IDS.ramp]);
            if (!pricingList[j]['bauValue']) {
              pricingList[j]['bauValue'] = 0;
            }
            this.initialValueMap.set(this.constantsService.TCO_METADATA_IDS.ramp + '_bauValue', pricingList[j]['bauValue']);
          } else if (pricingList[j].id === this.constantsService.TCO_METADATA_IDS.dnac) {
            // Pricing: ramp
            pricingList[j]['eavalue'] = '',
              pricingList[j]['bauValue'] = this.utilitiesService.formatWithNoDecimalForDashboard(tcoDataObj['businessAsUsual'][this.constantsService.TCO_METADATA_IDS.promotionCost][this.constantsService.TCO_METADATA_IDS.dnac]);
            if (!pricingList[j]['bauValue']) {
              pricingList[j]['bauValue'] = 0;
            }
            this.initialValueMap.set(this.constantsService.TCO_METADATA_IDS.dnac + '_eavalue', pricingList[j]['eavalue']);
            this.initialValueMap.set(this.constantsService.TCO_METADATA_IDS.dnac + '_bauValue', pricingList[j]['bauValue']);
          } else if (pricingList[j].id === this.constantsService.TCO_METADATA_IDS.starterKit) {
            // Pricing: ramp
            pricingList[j]['eavalue'] = '',
              pricingList[j]['bauValue'] = this.utilitiesService.formatWithNoDecimalForDashboard(tcoDataObj['businessAsUsual'][this.constantsService.TCO_METADATA_IDS.promotionCost][this.constantsService.TCO_METADATA_IDS.starterKit]);
            if (!pricingList[j]['bauValue']) {
              pricingList[j]['bauValue'] = 0;
            }
            this.initialValueMap.set(this.constantsService.TCO_METADATA_IDS.starterKit + '_eavalue', pricingList[j]['eavalue']);
            this.initialValueMap.set(this.constantsService.TCO_METADATA_IDS.starterKit + '_bauValue', pricingList[j]['bauValue']);
          } else if (pricingList[j].id === this.constantsService.TCO_METADATA_IDS.dcnFreeAppliance) {
            // Pricing: ramp
            pricingList[j]['eavalue'] = '',
              pricingList[j]['bauValue'] = this.utilitiesService.formatWithNoDecimalForDashboard(tcoDataObj['businessAsUsual'][this.constantsService.TCO_METADATA_IDS.promotionCost][this.constantsService.TCO_METADATA_IDS.dcnFreeAppliance]);
            if (!pricingList[j]['bauValue']) {
              pricingList[j]['bauValue'] = 0;
            }
            this.initialValueMap.set(this.constantsService.TCO_METADATA_IDS.dcnFreeAppliance + '_eavalue', pricingList[j]['eavalue']);
            this.initialValueMap.set(this.constantsService.TCO_METADATA_IDS.dcnFreeAppliance + '_bauValue', pricingList[j]['bauValue']);
          } 
        }
      }
    }
  }


  getPricingObject() {
    const pricingObj = {
      'bauDiscount': 0,
      'bauPrice': '',
      'eaPrice': '',
      'eaDiscount': '',
      'eaBenefitValue': '',
      'eabenefitPerc': ''
    };
    return pricingObj;
  }

  checkValueChanged(changedObj, editedValue): boolean {
    // using == to check for string and number
    if (this.initialValueMap.get(changedObj.id + '_' + editedValue) == changedObj[editedValue]) {
      return false;
    } else {
      return true;
    }
  }

  // method to check set visible false for DNA/DCN solution starter if value not present in the TCO data
  setSolutionStarter(tcoDataObj, tcoMetaData){
    for (const data of tcoMetaData.list){
      if(data.id === this.constantsService.TCO_METADATA_IDS.starterKit && (tcoDataObj['businessAsUsual'][this.constantsService.TCO_METADATA_IDS.promotionCost][data.id] === undefined)){
        data.visible = false;
        return;
      }
    }
  }
}
