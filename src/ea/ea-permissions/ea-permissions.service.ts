import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EaPermissionsService {

  userPermissionsMap = new Map<string, PermissionObj>();
  proposalPermissionsMap = new Map<string, PermissionObj>();
  projectPermissionsMap = new Map<string, PermissionObj>();

  constructor() { }

}

export interface PermissionObj {
  name?: string;
  description?: string;
  disabled?: boolean;
}