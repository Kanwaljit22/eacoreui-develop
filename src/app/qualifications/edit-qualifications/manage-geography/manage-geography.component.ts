import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { Router, RouterModule } from '@angular/router';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { ManageGeographyService } from '@app/qualifications/edit-qualifications/manage-geography/manage-geography.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { GridInitializationService } from '@app/shared/ag-grid/grid-initialization.service';
import { MessageService } from '@app/shared/services/message.service';
import { ProspectDetailsService } from '@app/prospect-details/prospect-details.service';
import { ArchitectureMetaDataFactory } from '@app/dashboard/product-summary/product-summary.component';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { IRoadMap, RoadMapConstants } from '@app/shared';
import { SubHeaderComponent } from '../../../shared/sub-header/sub-header.component';
import { LocaleService } from '@app/shared/services/locale.service';
import { ConstantsService } from '../../../shared/services/constants.service';
import { PermissionService } from '@app/permission.service';

@Component({
  selector: 'app-manage-geography',
  templateUrl: './manage-geography.component.html',
  styleUrls: ['./manage-geography.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ManageGeographyComponent implements OnInit, OnDestroy {

  roadMap: IRoadMap;
  public gridOptions: GridOptions;
  public showGrid: boolean;
  public rowData: any[];
  public columnDefs: any[];
  public autoGroupColumnDef: any;
  public rowCount: string;
  public qualGeoColumnDefs: any;
  qualGeoData: Array<any>;
  sortingObject: any;
  public fullScreen = false;
  theaterNames: Array<string>;
  response: any;
  isQualStatusUpdated = false;
  updatedvalues: any = new Set();
  excludedCountriesSet = new Set();
  includedCountriesSet = new Set();
  isUpdatedByUser = false;
  public subscribers: any = {};
  theatres = new Map<string, any>();


  constructor(public localeService: LocaleService, private utilitiesService: UtilitiesService, private router: Router,
    public manageService: ManageGeographyService, private messageService: MessageService, public manageGeoService: ManageGeographyService,
    public qualService: QualificationsService, 
    public appDataService: AppDataService, private gridInitialization: GridInitializationService, public prospectDetailsService: ProspectDetailsService,
    public constantsService: ConstantsService, public permissionService: PermissionService) {
    this.gridOptions = <GridOptions>{};
    gridInitialization.initGrid(this.gridOptions);
    this.qualGeographyColumnDefs();
    this.showGrid = true;
    this.qualService.prepareSubHeaderObject(SubHeaderComponent.EDIT_QUALIFICATION, true);


    this.gridOptions.defaultColDef = {
      headerComponentParams: {
        menuIcon: 'fa-bars'
      }
    };
    this.gridOptions.getRowClass = function (params) {
      if (!params.data.children && params.node.lastChild === true) {
        return 'lastChild';
      }
    };
  }

  ngOnInit() {

    this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.qualificationDefineGeographyStep;
    this.appDataService.showEngageCPS = false;
    this.appDataService.engageCPSsubject.next(this.appDataService.showEngageCPS);
    this.appDataService.showActivityLogIcon(true);
    // this.appDataService.isProposalIconEditable = true;
    // enable edit icon only if qual edit is present
    if (this.permissionService.qualEdit) {
      this.appDataService.isProposalIconEditable = true;
    } else {
      this.appDataService.isProposalIconEditable = false;
    }
    try {
      this.theaterNames = [];
      // get geography data 
      this.getQualGeographyData();
    } catch (error) {
      this.messageService.displayUiTechnicalError(error);
    }
  }

  // get geography column
  private qualGeographyColumnDefs() {

    this.qualGeoColumnDefs = [];
    let data = this.qualService.getQualGeographyColumn();
    const firstColumn = ArchitectureMetaDataFactory.getFirstColoumn();
    firstColumn.cellRenderer = this.nodeRenderer;

    const columnData = data.columns;

    for (let i = 0; i < columnData.length; i++) {

      if (columnData[i].displayName) {
        const columnDef = ArchitectureMetaDataFactory.getDataColoumn();
        columnDef.headerName = columnData[i].displayName;
        columnDef.field = columnData[i].persistanceColumn;
        if (columnDef.headerName == 'THEATER' || columnData[i].dataType === 'String') {
          columnDef.cellRenderer = 'group';
          columnDef.filterParams = { cellHeight: 20 };
          columnDef.checkboxSelection = true;
          columnDef.cellClass = 'expandable-header';
          columnDef.width = 1478;
        }
        this.qualGeoColumnDefs.push(columnDef);
      }
    }
  }

  // get Geography data from service
  getQualGeographyData() {
    if (!this.permissionService.qualEdit) {
      this.gridOptions.rowClassRules = {
        'checkboxDisable': function (params) {
          return true;
        }
      };
    }

    if (this.appDataService.roadMapPath || this.appDataService.roSalesTeam || this.qualService.qualification.prevChangeSubQualId) {
      this.gridOptions.rowClassRules = {
        'checkboxDisable': function (params) {
          return true;
        }
      };
    }
    this.qualGeoData = new Array<any>();
    // to get the geography list with exclusion/inclusion flag to pre-define countries as checked/unchecked
    this.qualService.listGeography().subscribe(
      ((response: any) => {
        if (response && !response.error) {
          try {
            const qualGeoData = response.data;
            if (qualGeoData) {
              for (let i = 0; i < qualGeoData.length; i++) {
                const qualGeoRow = qualGeoData[i];
                const colData = qualGeoRow.name;
                const record = { THEATER: qualGeoRow.name, selected: qualGeoRow.exclusion, children: [] };
                this.theatres.set(qualGeoRow.name, []);
                // to handle the children data
                const childrenRow = qualGeoRow.countries;
                if (childrenRow) {
                  record.children = new Array<any>();
                  for (let j = 0; j < childrenRow.length; j++) {
                    const qualGeoChildData = childrenRow[j];
                    const childrenRowCol = qualGeoChildData.name;
                    const childRecord = { THEATER: qualGeoChildData.name, code: qualGeoChildData.code, selected: qualGeoChildData.exclusion };

                    // Set exluded countries from service data 
                    if (qualGeoChildData.exclusion) {
                      this.excludedCountriesSet.add(qualGeoChildData.code);
                      const arr = this.theatres.get(qualGeoRow.name)
                      arr.push(qualGeoChildData.code)
                      this.theatres.set(qualGeoRow.name, arr);
                       
                    } else {
                      this.includedCountriesSet.add(qualGeoChildData.code)
                    }
                    record.children.push(childRecord);
                  }
                }
                this.qualGeoData.push(record);
              }
            }

            // console.log(JSON.stringify(this.qualGeoData));
            if (this.gridOptions.api) {
              this.gridOptions.api.setRowData(this.qualGeoData);
            }

            // to check/uncheck checkboxes in geography according to exclusion flag
            this.setCheckboxValue(this.qualGeoData);
          } catch (error) {
            this.messageService.displayUiTechnicalError(error);
          }
        } else {
          this.messageService.displayMessagesFromResponse(response);
        }
      }),
      error => {
        this.messageService.displayUiTechnicalError(error);
      }
    );
    setTimeout(() => {
      this.utilitiesService.setTableHeight();
      // to add vertical scroll
      this.gridOptions.api.sizeColumnsToFit();
    });
  }


  public onRowSelected($event) {
    // if a row is unchecked (or excluded), form an excluded countries array to pass to backend
    //need changes for updating map for selection/deselection.
    //$event.node.parent.data.THEATER
    const theatherId = ($event.node.parent.data && $event.node.parent.data.THEATER) ? $event.node.parent.data.THEATER : ''
    if (!($event.node.selected) && $event.node.data.code !== undefined) {

      // if user unselected countries
      this.isUpdatedByUser = true;
      // excludedCountriesSet<> keeps track of unique country codes
      this.excludedCountriesSet.add($event.node.data.code);
      if (theatherId) {
        
          const arr = this.theatres.get(theatherId);
          if (!arr.includes($event.node.data.code)) {
            arr.push($event.node.data.code)
          }
          this.theatres.set(theatherId, arr);
        

      }

    } else {
      // if user selected countries
      if (this.excludedCountriesSet.has($event.node.data.code)) {
        this.isUpdatedByUser = true;
      }

      this.excludedCountriesSet.delete($event.node.data.code);
      if (theatherId) {
        const arr = this.theatres.get(theatherId);
        const index = arr.indexOf($event.node.data.code)
        if (index >= 0) {
          arr.splice(index, 1);
          this.theatres.set(theatherId, arr);
        }
      }
    }

    // Set updatevalues by user
    if (this.isUpdatedByUser && $event.node.data.code !== undefined) {

      // to get the values user is selecting or excluding
      if (this.includedCountriesSet.has($event.node.data.code)) {
        // Remove deselected countries
        this.includedCountriesSet.delete($event.node.data.code);
      } else {
        // Add selected countries
        this.includedCountriesSet.add($event.node.data.code);
      }

      // to get the values user is selecting or excluding
      if (this.updatedvalues.has($event.node.data.code)) {
        this.updatedvalues.delete($event.node.data.code);
      } else {
        this.updatedvalues.add($event.node.data.code);
      }
    }
  }

  getBooleanValue(cssSelector) {
    return document.querySelector(cssSelector).checked === true;
  }

  // Saving geography in all scenario icluding back,continue etc
  public ngOnDestroy() {
    this.appDataService.showActivityLogIcon(false);
    // Only call service when data is updated
    if (this.updatedvalues.size > 0) {
      const theatresArr = []
      let index = 0;
      this.theatres.forEach((value, key) => {
        const inclusion = (this.qualGeoData[index].children.length === value.length) ? false: true;
        theatresArr.push({'id': key, 
        'excludedCountries': value,
        'inclusion': inclusion
      })
      index++;
    })
      // Save geography selection data
      this.manageGeoService.saveGeographySelection(theatresArr).subscribe((response: any) => {
        if (response && response.error) {
          this.messageService.displayMessagesFromResponse(response);
        }
      }
      );
    }
    // unsubscribe to roadmap emitter after reopening
    this.qualService.unSubscribe();
  }

  continueGeoraphy() {
    this.roadMap.eventWithHandlers.continue();
  }

  backToInvolved() {
    this.roadMap.eventWithHandlers.back();
  }


  setCheckboxValue(qualGeoData) {
    // goes through each node data & sets checkbox default value as received from backend api
    try {
      this.gridOptions.api.forEachNode(function (rowNode) {
        qualGeoData.forEach(element => {
          if (element.THEATER === rowNode.data.THEATER) {
            rowNode.setSelected(!element.selected);
            // to expand the row which has any(1 or more) children as unchecked
            // rowNode.setExpanded(element.selected);
            for (let i = 0; i < element.children.length; i++) {
              if (!element.children[i].selected) {
                rowNode.setExpanded(element.selected);
              }
            }
          }
          if (element.children) {
            for (let i = 0; i < element.children.length; i++) {
              if (element.children[i].THEATER === rowNode.data.THEATER) {
                rowNode.setSelected(!element.children[i].selected);
              }
            }
          }
        });
      });
    } catch (error) {
      this.messageService.displayUiTechnicalError(error);
    }
  }

  getNodeChildDetails(rowItem) {
    if (rowItem.children) {
      return {
        group: true,
        children: rowItem.children,
        key: rowItem.group
      };
    } else {
      return null;
    }
  }

  nodeRenderer($event) {

    return '';
  }

  public onCellClicked($event) {

  }

  public onModelUpdated($event) {

  }

  public onReady($event) {

  }

  public onCellValueChanged($event) {
    // console.log('onCellValueChanged: ' + $event.oldValue + ' to ' + $event.newValue);
  }

  public onCellDoubleClicked($event) {
    // console.log('onCellDoubleClicked: ' + $event.rowIndex + ' ' + $event.colDef.field);
  }

  public onCellContextMenu($event) {
    // console.log('onCellContextMenu: ' + $event.rowIndex + ' ' + $event.colDef.field);
  }

  public onCellFocused($event) {
    // console.log('onCellFocused: (' + $event.rowIndex + ',' + $event.colIndex + ')');
  }


  viewQualification() {
    this.qualService.goToQualification();
  }



  public onSelectionChanged($event) {
    // console.log('selectionChanged');
  }

  public onBeforeFilterChanged() {
    // console.log('beforeFilterChanged');
  }

  public onAfterFilterChanged() {
    // console.log('afterFilterChanged');
  }

  public onFilterModified() {
    // console.log('onFilterModified');
  }

  public onBeforeSortChanged() {
    //  console.log('onBeforeSortChanged');
  }

  public onAfterSortChanged() {
    // console.log('onAfterSortChanged');
  }

  public onVirtualRowRemoved($event) {
    // because this event gets fired LOTS of times, we don't print it to the
    // console. if you want to see it, just uncomment out this line
    // console.log('onVirtualRowRemoved: ' + $event.rowIndex);
  }

  public onRowClicked($event) {
    //  console.log('onRowClicked: ' + $event.node.data.name);
  }

  public onQuickFilterChanged($event) {
    this.gridOptions.api.setQuickFilter($event.target.value);
  }

  // here we use one generic event to handle all the column type events.
  // the method just prints the event name
  public onColumnEvent($event) {
    // console.log('onColumnEvent: ' + $event);
  }

  // reopen qual at page level
  reopenQual() {
    this.qualService.reopenQual();
    // subscibe to emitter to get value of roadmappath
    this.subscribers.roadMapEmitter = this.qualService.roadMapEmitter.subscribe((roadMapPath: any) => {
      // enable edit icon only if qual edit is present
      if (this.permissionService.qualEdit) {
        this.appDataService.isProposalIconEditable = true;
      } else {
        this.appDataService.isProposalIconEditable = false;
      }
      // if roadmappath is false, reopen the page
      if (!roadMapPath) {
        this.gridOptions.rowClassRules = {
          'checkboxDisable': function (params) {
            return false;
          }
        };
        // set the grid after reopened
        this.gridOptions.api.redrawRows();
      }
    });
  }

  redirect(){
    window.open('http://go2.cisco.com/CX+EA+Partner');
  }

}
