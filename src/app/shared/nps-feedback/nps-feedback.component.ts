import { LocaleService } from '@app/shared/services/locale.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { Component, OnInit } from '@angular/core';
import { NpsFeedbackService } from '@app/shared/nps-feedback/nps-feedback.service';
import { CopyLinkService } from '@app/shared/copy-link/copy-link.service';


@Component({
  selector: 'app-nps-feedback',
  templateUrl: './nps-feedback.component.html',
  styleUrls: ['./nps-feedback.component.scss']
})
export class NpsFeedbackComponent implements OnInit {
  openForm = false;
  selectedSatisfaction: any;
  selectedDifficulty: string;
  percentageComplete: number;
  val: number;
  comments: string;
  contactByEmail = false;
  invalidEmail = false;
  manadatoryComment = false;

  satisfied = [
    {
      val: 'Highly Satisfied',
      class: 'ten',
      satisfaction: 10
    },
    {
      val: 'Mostly Satisfied',
      class: 'nine',
      satisfaction: 9
    },
    {
      val: 'Satisfied',
      class: 'eight',
      satisfaction: 8
    },
    {
      val: 'Satisfied',
      class: 'seven',
      satisfaction: 7
    },
    {
      val: 'Satisfied',
      class: 'six',
      satisfaction: 6
    },
    {
      val: 'Neutral',
      class: 'five',
      satisfaction: 5
    },
    {
      val: 'Unsatisfied',
      class: 'four',
      satisfaction: 4
    },
    {
      val: 'Unsatisfied',
      class: 'three',
      satisfaction: 3
    },
    {
      val: 'Unsatisfied',
      class: 'two',
      satisfaction: 2
    },
    {
      val: 'Mostly Unsatisfied',
      class: 'one',
      satisfaction: 1
    },
    {
      val: 'Highly Unsatisfied',
      class: 'zero',
      satisfaction: 0
    }
  ];

  difficulty = [{ val: 'Extremely Easy', class: 'icon-extremely-easy' }, { val: 'Easy', class: 'icon-easy' },
  { val: 'Neither Difficult Nor Easy', class: 'icon-difficult-easy' }, { val: 'Difficult', class: 'icon-difficult' },
  { val: 'Extremely Difficult', class: 'icon-extremely-difficult' }];
  emailId: string;
  constructor(private feedbackService: NpsFeedbackService, public appDataService: AppDataService,
    public constantsService: ConstantsService, private copyLinkService: CopyLinkService, public localeService: LocaleService) { }

  ngOnInit() {
    this.percentageComplete = 0;
    this.emailId = this.appDataService.userInfo.emailId;
  }

  showForm() {
    this.openForm = !this.openForm;
  }

  selectValue(a) {

    this.selectedSatisfaction = a;

    if (this.mandatoryCommentAsPerSatisfaction()) {
      this.manadatoryComment = true;
      if (this.comments && this.comments.length > 0) {
        this.manadatoryComment = false;
      }
    } else {
      if (this.mandatoryCommentAsPerDifficulty()) {
        this.manadatoryComment = true;
        if (this.comments && this.comments.length > 0) {
          this.manadatoryComment = false;
        }
      } else {
        this.manadatoryComment = false;
      }
    }
  }

  selectDifficulty(value, index) {

    this.selectedDifficulty = value.val;
    this.val = index;
    this.percentageComplete = this.val * (100 / (this.difficulty.length - 1));

    if (this.mandatoryCommentAsPerDifficulty()) {
      this.manadatoryComment = true;
      if (this.comments && this.comments.length > 0) {
        this.manadatoryComment = false;
      }
    } else {
      if (this.mandatoryCommentAsPerSatisfaction()) {
        this.manadatoryComment = true;
        if (this.comments && this.comments.length > 0) {
          this.manadatoryComment = false;
        }
      } else {
        this.manadatoryComment = false;
      }
    }

  }


  mandatoryCommentAsPerSatisfaction() {

    let isMandatoryComment = false;

    // Make it mandatory comment when below value selected 
    if (this.selectedSatisfaction && (this.selectedSatisfaction.val === 'Unsatisfied' ||
      this.selectedSatisfaction.val === 'Mostly Unsatisfied' || this.selectedSatisfaction.val === 'Highly Unsatisfied')) {
      isMandatoryComment = true;
    } else {
      isMandatoryComment = false;
    }

    return isMandatoryComment;
  }

  mandatoryCommentAsPerDifficulty() {

    let isMandatoryComment = false;

    // Make it mandatory comment when below value selected
    if (this.selectedDifficulty && this.selectedDifficulty === 'Difficult' || this.selectedDifficulty === 'Extremely Difficult') {
      isMandatoryComment = true;
    } else {
      isMandatoryComment = false;
    }
    return isMandatoryComment;
  }

  close() {
    this.openForm = false;
  }

  emailValidation() {
    if (!this.emailId) {
      this.invalidEmail = false;
      return;
    }
    if (this.appDataService.emailValidationRegx.test(this.emailId) === false) {
      this.invalidEmail = true;
    } else {
      this.invalidEmail = false;
    }
  }

  emailContact(val) {
    this.contactByEmail = val.checked;
  }


  commentUpdated() {

    if (this.mandatoryCommentAsPerDifficulty() || this.mandatoryCommentAsPerSatisfaction()) {
      if (!this.comments.trim()) {
        this.manadatoryComment = true;
      }
    }
  }

  submit() {

    let reqestObj: any = {};
    reqestObj['easeOfUse'] = (100 - this.percentageComplete);  // Start with 100% ease of use
    reqestObj['satisfectionLevel'] = this.selectedSatisfaction.satisfaction;
    reqestObj['comments'] = this.comments;
    reqestObj['contactEmail'] = this.emailId;
    reqestObj['contactByEmail'] = this.contactByEmail;
    this.feedbackService.submitFeedback(reqestObj).subscribe(
      (res: any) => {
        if (!res.error) {

          this.copyLinkService.showMessage('Thank you for providing the feedback.');
          this.openForm = false;
          this.appDataService.isShowFeedback = false;

        } else {
          this.openForm = false;
          // this.messageService.displayMessagesFromResponse(res);
        }
      },
      error => {
        this.openForm = false;
        // this.messageService.displayUiTechnicalError(error);
      }
    );

  }

}
