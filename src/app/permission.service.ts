import { Injectable } from '@angular/core';

@Injectable()
export class PermissionService {

  permissions = new Map<string, PermissionObj>();
  proposalPermissions = new Map<string, PermissionObj>();
  qualPermissions = new Map<string, PermissionObj>();
  localPermissions = new Map<string, PermissionObj>();
  isProposalPermission = false;
  isQualificationPermission = false;

  // qualifications permissions
  qualReOpen = false;
  qualEdit = false;
  qualManageTeam = false;
  qualFederalCustomer = false;

  proposalReOpen = false;
  proposalEdit = false;
  proposalSplit = false;

  allowComplianceHold = false;
  constructor() { }

  isProposalPermissionPage(isProposal) {

    if (isProposal) {
      this.localPermissions = this.proposalPermissions;
    } else {
      this.localPermissions = this.qualPermissions;
    }
    // this.isProposalPermission =  isProposal;
    // this.isQualificationPermission =  !isProposal;
  }

}

export interface PermissionObj {
  name: string;
  description: string;
  disabled: boolean;
}