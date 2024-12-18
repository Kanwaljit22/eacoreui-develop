import { VnextResolversModule } from 'vnext/vnext-resolvers.module';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: VnextResolversModule
})
export class QuestionnaireStoreService {

  tierTooltipMap = new Map<string,ITooltip>();
  questionsArray = [];
  isEducationInstituteSelected = false;
  constructor() { }
}




export interface ITooltip{
  atoName?:string;
  suiteName?:string;
  qtyUnit?:string;
  count?:string;
  qtyUnitDisplaySeq?: number;
  displaySeq?: number;
}
