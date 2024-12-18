import { Component, OnInit, Renderer2 } from '@angular/core';
import { HeaderService } from '@app/header/header.service';
import { NewReleaseFeatureService } from '@app/shared/new-release-feature/new-release-feature.service';
import { MessageService } from '@app/shared/services/message.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { AppDataService, SessionData } from '@app/shared/services/app.data.service';

@Component({
  selector: 'app-new-release-feature',
  templateUrl: './new-release-feature.component.html',
  styleUrls: ['./new-release-feature.component.scss']
})
export class NewReleaseFeatureComponent implements OnInit {

  showRelease = false;
  versions = [];
  releaseData: any;

  constructor(public headerService: HeaderService, private renderer: Renderer2, private newReleaseFeatureService: NewReleaseFeatureService,
    private messageService: MessageService,
    private appDataService: AppDataService, public localeService: LocaleService) { }

  ngOnInit() {
    if (!this.newReleaseFeatureService.latestRelease || !this.newReleaseFeatureService.versions) {
      this.loadReleaseData();
    } else {
      this.releaseData = this.newReleaseFeatureService.latestRelease;
      this.versions = this.newReleaseFeatureService.versions;
    }
    const sessionObj: SessionData = this.appDataService.getSessionObject();
    sessionObj.isNewReleaseDisplayed = true;
    this.appDataService.setSessionObject(sessionObj);
  }

  showAllReleases() {
    this.showRelease = !this.showRelease;
  }

  skipNow() {
    this.appDataService.showAnnounceBanneer = false;
    this.renderer.removeClass(document.body, 'position-fixed');
  }

  neverShow() {
    this.newReleaseFeatureService.hideReleaseNote().subscribe((res: any) => {
      if (res && !res.error) {
        try {
          this.appDataService.showAnnounceBanneer = false;
          this.renderer.removeClass(document.body, 'position-fixed');
          // this.appDataService.hideReleaseNote = true;
        } catch (error) {
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  loadReleaseData() {
    this.newReleaseFeatureService.getAllRelease().subscribe((res: any) => {
      if (res && !res.error && res.data) {
        try {
          this.newReleaseFeatureService.allReleaseData = res.data;
          this.versions = this.newReleaseFeatureService.getAllVersions();
          this.releaseData = this.newReleaseFeatureService.latestRelease;
        } catch (error) {
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  changeRelease(event, version) {
    this.releaseData = this.newReleaseFeatureService.changeRelease(version);
    this.showRelease = false;
  }

}
