import { Component, Input, OnInit } from '@angular/core';
import { ITitleWithButtons, ICustomButtons } from './title-with-buttons.model';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
    moduleId: module.id,
    selector: 'app-title-with-buttons',
    templateUrl: 'title-with-buttons.component.html',
    styleUrls : ['title-with-buttons.component.scss']
})

export class TitleWithButtonsComponent implements OnInit {
    @Input() titleWithButton: ITitleWithButtons;
    title: any;
    constructor(private sanitizer: DomSanitizer) {
    }

    ngOnInit() {
        this.title = this.sanitizer.bypassSecurityTrustHtml(this.titleWithButton.title ? this.titleWithButton.title : '');
        //console.log(this.titleWithButton.buttons);
    }
}
