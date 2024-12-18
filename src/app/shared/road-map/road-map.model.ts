import { CanDeactivate } from '@angular/router';
import { Subject } from 'rxjs';

export interface IRoadMap {
    name: string;
    component: any;
    eventWithHandlers: any;
    canDeactivate?: any;
}


export class RoadMapGrid {
    roadMaps: Array<IRoadMap>;
    roadMapSubject: Subject<any>;

    constructor(roadMaps: Array<IRoadMap>) {
        this.roadMaps = roadMaps;
        this.roadMapSubject = new Subject<any>();
    }

    loadComponent(roadMap: number) {
        this.roadMapSubject.next(roadMap);
    }
}