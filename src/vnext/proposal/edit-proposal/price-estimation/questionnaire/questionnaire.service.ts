import { IQuestion } from './../price-estimate-store.service';
import { IEnrollmentsInfo } from './../../../proposal-store.service';

import { VnextResolversModule } from 'vnext/vnext-resolvers.module';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: VnextResolversModule
})
export class QuestionnaireService {
  selectedEnrollment:IEnrollmentsInfo;
  nextLevelQuestionsMap: Map<string,Array<IQuestion>>;
  selectedAnswerMap =  new Map<string,IQuestion>();
  mandatoryQuestCount = 0;
  isMinUserCount: boolean;
  selectedScuCount: number;
  
}
