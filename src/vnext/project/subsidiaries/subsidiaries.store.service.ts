import { Injectable } from '@angular/core';
import { VnextResolversModule } from 'vnext/vnext-resolvers.module';
import { ProjectResolversModule } from '../project-resolvers.module';


@Injectable({
  providedIn: VnextResolversModule
})
export class SubsidiariesStoreService {

  buId:number;
  bu: ICustomerBU = {};
  cavName:string;
  subsidiariesData:Array<ICavDetails> = null // to store cavDetails/subsidiariesData
  constructor() { }
}

export interface ICavDetails
{
  cavName?:string;
  cavId? : number;
  selected?:boolean;
  bus?:Array<ICustomerBU>;

}

export interface ICustomerBU{
  buId? : number;
  buSegment?:string;
  buSubSegment?:string;
  buName?:string;
  selected?:string;
  dealCrPartyBU?: boolean;
  checked?: boolean;
  showSites?: boolean
}