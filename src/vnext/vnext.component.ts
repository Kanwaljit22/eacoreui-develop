import { EaStoreService } from './../ea/ea-store.service';
import { ProjectService } from './project/project.service';
import { VnextService } from './vnext.service';
import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { BlockUiService } from './commons/services/block-ui.service';
import {  VnextStoreService } from './commons/services/vnext-store.service';
//import { ActivatedRoute } from '@angular/router';
import { ConstantsService } from './commons/services/constants.service';
import { EaService } from 'ea/ea.service';
//import { ISessionObject } from 'ea/ea-store.service';


@Component({
  selector: 'app-vnext',
  templateUrl: './vnext.component.html',
  styleUrls: ['./vnext.component.scss']
})
export class VnextComponent implements OnInit {

  constructor(public projectService: ProjectService,public vnextService:VnextService,
    public blockUiService:BlockUiService, public eaStoreService: EaStoreService, private constantsService: ConstantsService,
    public vnextStoreService: VnextStoreService,private cdr: ChangeDetectorRef,
    public eaService:EaService) { }

  ngOnInit() {
    this.eaStoreService.isEa2 = false;
    this.vnextService.getUserDetails(this.eaStoreService.userInfo); 
    //sessionStorage.removeItem('sessionObject');
  }

   ngAfterViewChecked(){
    //your code to update the model
    this.cdr.detectChanges();
    }

}
