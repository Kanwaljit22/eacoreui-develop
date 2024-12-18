import { QuestionnaireService } from './questionnaire.service';
import { IQuestion } from './../price-estimate-store.service';
import { Component, OnInit, Input, Renderer2, OnDestroy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { PriceEstimateService } from '../price-estimate.service';
import { QuestionnaireStoreService } from './questionnaire-store.service';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss']
})
export class QuestionnaireComponent implements OnInit, OnDestroy {
  showTiers = false;
  constructor(public questionnaireService:QuestionnaireService,public priceEstimateService:PriceEstimateService, 
    public renderer: Renderer2,private cdr: ChangeDetectorRef,private questionnaireStoreService: QuestionnaireStoreService) { }

  @Input() questions: Array<IQuestion>;
  @Output() qnaSubmitEvent = new EventEmitter();
  
 

  ngOnInit() {
    this.questionnaireStoreService.tierTooltipMap.clear();
    this.questionnaireService.nextLevelQuestionsMap = new Map<string,Array<IQuestion>>();
  }
  ngOnDestroy() {
    // this.renderer.removeClass(document.body, 'position-fixed')
    // this.renderer.removeClass(document.body, 'w-100')
    // this.questionnaireService.mandatoryQuestCount = 0;
    // this.questionnaireService.selectedAnswerMap.clear();
    // this.questionnaireService.nextLevelQuestionsMap.clear();
    // this.questionnaireStoreService.tierTooltipMap.clear();
  }

  public submitQnA(){
    this.qnaSubmitEvent.emit();
  }

  close(){
    this.priceEstimateService.displayQuestionnaire = false;
  }

  ngAfterViewChecked(){
    //your code to update the model
    this.cdr.detectChanges();
    }

}
