import { Injectable } from '@angular/core';
import { VnextResolversModule } from 'vnext/vnext-resolvers.module';

@Injectable({
  providedIn: VnextResolversModule
})
export class EaidStoreService {

  // isBpRequestChangeScope = false;
  confirmationToSubmitScopeChange = false;
  //scopeChangeDetails: IScopeChangeDetailsObj; // to store eaid scopechangedetials ,
  encryptedEaId = ''; // to store eaid from landing api
  eaIdData: IEaIdData = {};
  scopeChangeComplete = false;
  viewOnlyScopeMode = false;
  allowSubmitScopeChange = true; // set to false to disable submit scope change button
  subscriptionsNotPresent = false; // set if there are no subscriptions present for EAID
  selectedBuMap = new Map<number, boolean>(); // to map bu's and selection
  partiesSelectionMap = new Map<string,boolean>();
  isAnyBuSelected = false; // set if any bu was selected in cav deatails
  isShowBuOverlapMessage = false; // set if bp overlap message is coming from api
  disableContinue = false; // set if any error present in review/save api

  constructor() { }
}

export interface IScopeChangeDetailsObj {
  requestId?: string;
  expirationDate?:string;
  status?: string;
  reasonInfo?: IReasonInfoObj;
}

export interface IReasonInfoObj {
  id?: string;
  desc?: string;
  reasonDetails?: string;
}

export interface IEaIdData {
  eaid?: string;
  scopeChangeDetails?: IScopeChangeDetailsObj
  overlapBuData?: IOvelapBuDataObj
  activeSelectedBus?: Array<any>;
  cavs?: Array<any>;
}

export interface IOvelapBuDataObj {
  overlapBus?: Array<any>;
  overlapBu?:boolean;
}