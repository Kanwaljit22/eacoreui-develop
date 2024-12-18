
import { Component, OnInit, Input, Renderer2, OnDestroy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { IQuestion } from '../../price-estimation/price-estimate-store.service';
import { PriceEstimateService } from '../../price-estimation/price-estimate.service';
import { QuestionnaireStoreService } from '../../price-estimation/questionnaire/questionnaire-store.service';
import { QuestionnaireService } from '../../price-estimation/questionnaire/questionnaire.service';


@Component({
  selector: 'app-spna-questionnaire',
  templateUrl: './spna-questionnaire.component.html',
  styleUrls: ['./spna-questionnaire.component.scss']
})
export class SpnaQuestionnaireComponent implements OnInit, OnDestroy {
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
