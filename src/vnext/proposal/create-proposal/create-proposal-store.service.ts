import { VnextResolversModule } from './../../vnext-resolvers.module';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: VnextResolversModule
})
export class CreateProposalStoreService {

  renewalId: number;
  renewalJustification: string;
  hybridSelected: boolean; // to set selection of hybrid qna 
  constructor() { }
}
