import { Component, OnInit } from '@angular/core';
import { RoadMapGrid, IRoadMap } from '../../shared/road-map/road-map.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-lookup-new-subsidiaries',
  templateUrl: './lookup-new-subsidiaries.component.html',
  styleUrls: ['./lookup-new-subsidiaries.component.scss']
})
export class LookupNewSubsidiariesComponent implements OnInit {
  roadMaps: Array<IRoadMap>;
  roadMapGrid: RoadMapGrid;
  componentNumToLoad: number;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.roadMaps = [
      {
        name: 'Select Subsidiaries',
        component: '',
        eventWithHandlers: {
          continue: () => {
            this.roadMapGrid.loadComponent(1);
          },
          back: () => {
          }
        }
      },
      {
        name: 'Summary',
        component: '',
        eventWithHandlers: {
          continue: () => {
            this.roadMapGrid.loadComponent(2);
          },
          back: () => {
          }
        }
      }
    ];
    this.roadMapGrid = new RoadMapGrid(this.roadMaps);
  }

  continue() {

  }
}
