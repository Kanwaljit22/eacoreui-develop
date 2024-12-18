import { Injectable } from '@angular/core';
import { IPartnerInfo } from 'vnext/commons/services/vnext-store.service';
import { ICustomerInfo, ISmartAccountInfo } from 'vnext/project/project-store.service';
import { ISubscription, ISubscriptionInfo } from 'vnext/proposal/proposal-store.service';

@Injectable({
  providedIn: 'root'
})
export class CreateLinkProjectStoreService {

  constructor() { }
}


export interface IDealInfoDetails{
  id?:number;
  dealName?:string;
  expectedBookDate?: string;
  optyOwner?: string;
  statusDesc?:string;
  customerInfo?: ICustomerInfo;
  partnerInfo?: IPartnerInfo;
  subscriptionInfo?: ISubscriptionDetail;
  subscriptionUpgradeDeal?: boolean;
}

export interface ISubscriptionDetail{
  subRefId?: string;
  statusDesc?: string;
  enrollments?: Array<string>;
  endDateStr?: string;
  smartAccount?: ISmartAccountInfo;
}


