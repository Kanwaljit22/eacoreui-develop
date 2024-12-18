import { Injectable } from '@angular/core';
import { VnextResolversModule } from 'vnext/vnext-resolvers.module';
import { IAdditionalCost, IGrowthExpence, IInflation, IPartnerMarkup, ITcoData, ITcoMetaData } from './tco.service';

@Injectable({
  providedIn: VnextResolversModule
})
export class TcoStoreService {
  tcoData: ITcoData = {};
  additionalCosts:IAdditionalCost = {};
  pricing	:any = {};
  partnerMarkup:IPartnerMarkup = {};
  growthExpenses: IGrowthExpence = {};
  inflation:IInflation = {};
  metaData:ITcoMetaData = {};
  isDataloaded = false;
  constructor() { }
}
