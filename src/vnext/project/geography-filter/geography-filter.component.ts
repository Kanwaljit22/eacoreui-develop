import { LocalizationService } from 'vnext/commons/services/localization.service';
import { Component, OnInit, Output, Renderer2,EventEmitter } from '@angular/core';
import { EaRestService } from 'ea/ea-rest.service';
import { VnextService } from 'vnext/vnext.service';
import { ICountry, ITheater, ProjectStoreService } from '../project-store.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { EaService } from 'ea/ea.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
@Component({
  selector: 'app-geography-filter',
  templateUrl: './geography-filter.component.html',
  styleUrls: ['./geography-filter.component.scss']
})
export class GeographyFilterComponent implements OnInit {


  dealCountry:string;
  allSelected = false;
  theatreList = new Array<ITheater>();
  selectedCountryMap = new Map<string, boolean>();
  @Output() updateSiteList = new EventEmitter();
  constructor(public projectStoreService: ProjectStoreService, public renderer: Renderer2,private eaRestService:EaRestService,private vnextService:VnextService, public localizationService: LocalizationService, public eaService: EaService, public dataIdConstantsService: DataIdConstantsService, public elementIdConstantsService: ElementIdConstantsService) { }

  ngOnInit(): void {
    this.getCountriesList();
  }



  getCountriesList() {
    const url = 'project/'+this.projectStoreService.projectData.objId+'/cav/country-list';
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      if(this.vnextService.isValidResponseWithData(response)){
      let data = response.data;
      this.dealCountry = data.dealCountry;
      //this.theatreList = data.list; 
      if(data.selected === undefined || data.selected === null ){
          this.allSelected = true;
         
      }else{
        this.selectedCountryMap.clear();
        this.allSelected = false;
        for(let i=0;i<data.selected.length;i++){
          this.selectedCountryMap.set(data.selected[i],true);
        }
      }
       for(let tempTheater in data.list){
          let countryList = data.list[tempTheater];
          let theater:ITheater = {
                name:tempTheater,
                defaultCountryPresent:false
          }
          theater.countries = new Array<ICountry>();
          theater.totalCountriesCount = countryList.length;
          theater.selectedCountriesCount = 0;
          theater.selected = true;
          for(let i=0;i<countryList.length;i++){
              let country = countryList[i];
              if(this.dealCountry === country.code){
                  theater.defaultCountryPresent = true;
              }
              if(this.allSelected || this.selectedCountryMap.has(country.code)){
                country.selected = true;
                theater.selectedCountriesCount++;
                this.selectedCountryMap.set(country.code,true);
              }else{
                country.selected = false;
                theater.selected = false;
              }
              theater.countries.push(country);
          }
          this.theatreList.push(theater);
      }
    }
    });
  }

  close() {
    this.projectStoreService.showHideFilterMenu = false;
    this.renderer.removeClass(document.body, 'position-fixed');
  }

  changeCountryStatus(event,countryObj:ICountry,theater:ITheater){
      if(event.target.checked){
          this.selectedCountryMap.set(countryObj.code,true);
          countryObj.selected = true;
          theater.selectedCountriesCount++;
      }else {
        this.selectedCountryMap.delete(countryObj.code);
        countryObj.selected = false;
        theater.selectedCountriesCount--;
      }
      if(theater.selectedCountriesCount === theater.totalCountriesCount){
          theater.selected = true;
      } else {
          theater.selected = false;
      }
  }



  saveSelectedCountries(){
    let selectedCountries = new Array<string>();
    let allCountriesSelected = true;
    let request:any;
    for(let theater of this.theatreList){
        if(theater.totalCountriesCount !== theater.selectedCountriesCount){
          allCountriesSelected = false;
        }
    }
    if(!allCountriesSelected){
      this.selectedCountryMap.forEach((value: boolean, key: string) => {
        selectedCountries.push(key);
      });
      request = {
        "data":{
          "selectedCountries":selectedCountries
        }
    }
    } else {
      request = {
        "data":{
          "selectAll":true
        }
    }
    }
    const url = 'project/'+this.projectStoreService.projectData.objId+'/cav/country-filter';
    this.eaRestService.postApiCall(url,request).subscribe((response: any) => {
      if(this.vnextService.isValidResponseWithoutData(response)){
        this.updateSiteList.emit();
        this.close();
      }
    });

  }


  deSelectAll(theater:ITheater){
      theater.selected = false;
      if(theater.defaultCountryPresent){
        theater.selectedCountriesCount =  1;
      } else {
        theater.selectedCountriesCount =  0;
      }
      for(let country of theater.countries){
        if(this.dealCountry !== country.code){
          country.selected = false;
          this.selectedCountryMap.delete(country.code);
        }
      }
  }

  selectAll(theater:ITheater){
      theater.selected = true;
      theater.selectedCountriesCount = theater.totalCountriesCount;
      for(let country of theater.countries){
          country.selected = true;
          this.selectedCountryMap.set(country.code,true);
        }
  }

  selectDeselectAll(event, theater: ITheater) {
    if(event.target.checked) {
    this.selectAll(theater);
    } else {
    this.deSelectAll(theater);
    }
    }

}
