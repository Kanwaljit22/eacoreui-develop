export enum PermissionEnum {
  // admin
  Admin = 'admin',

  Debug = 'debug',

  // common
  RoMessage = 'dashboard.header.ro_message',
  RwMessage = 'dashboard.header.rw_message',

  // prospect
  Favorite = 'favorite',

  //Smart Subsidiaries
  Smart_Subsidiary = 'smart_subsidiary',

  // dashboard
  Qualification = 'qualification',
  Proposal = 'proposal',
  Prospect = 'prospect',

  // Qualification
  QualReOpen = 'qualification.reopen',
  QualEdit = 'qualification.edit',
  QualDelete = 'qualification.delete',
  QualManageTeam = 'qualification.manage_team',
  QualEditName = 'qualification.edit.name',
  EditDealId = 'qualification.change_deal_id',
  QualFederalCustomer = 'qualificaton.federal_customer',
  QualViewOnly = 'qualification.view_only',

  // Proposal
  ProposalReOpen = 'proposal.reopen',
  ProposalEdit = 'proposal.edit',
  ProposalDelete = 'proposal.delete',
  ProposalManageTeam = 'proposal.manage_team',
  ProposalCreate = 'proposal.create',
  ProposalEditName = 'proposal.edit_name',
  ProposalLinkDelink = 'proposal.link_delink',
  ProposalClone = 'proposal.duplicate',
  ProposalQuote = 'proposal.preview_quote',
  ProposalRequestDocuments = 'proposal.request.documents',
  ProposalInitiateFollowon = 'proposal.initiate_followon',
  ProposalViewOnly = 'proposal.view_only',

  DocCenter = 'proposal.document_center',
  SalesReadiness = 'proposal.sales_readiness',

  // TCO
  TCOEdit = 'proposal.tco.edit',
  TCODuplicate = 'proposal.tco.duplicate',
  TCODelete = 'proposal.tco.delete',

  // Threshold Approvers
  DnaThreshold = 'proposal.dna.threshold.approval',
  DcThreshold = 'proposal.dc.threshold.approval',
  SecThreshold = 'proposal.sec.threshold.approval',

  // DNA max subscription discount Approvers
  DnaDiscountApprover = 'proposal.dna.discount.approval',

  // proposal purchase adjustment
  PurchaseAdjustmentPermit = 'proposal.pa',
  PurchaseAdjustmentApprover = 'proposal.pa.approval',

  // TCO
  Tco = 'proposal.tco',

  // Admin
 

  // compliance hold release
  Compliance_Hold = 'compliance.hold',
  Compliance_Hold_Release = 'compliance.hold.release',
  Compliance_Hold_Audit = 'compliance.hold.audit',
  Compliance_Hold_Export = 'compliance.hold.export',
  Compliance_Hold_Cancel = 'compliance.hold.cancel_order',

  // Proposal Exception
  Proposal_Exception_Access = 'admin.proposal_exceptions',
  Proposal_Exception_New = 'admin.new_proposal_exception',

  // reporting center
  ReportCenter = 'report_center',

  // activity log
  ActivityLog = 'activity.log',

  // proxy
  ProxyUser = 'proxy',

  // Download Bom
  DownloadBom = 'download_bom',
  CHANGE_SMART_ACCOUNT = 'smart_account_change',
  DEMO_PROPOSAL = 'proposal.demo_proposal',

  // Change Subscription
  Change_Subscription = 'change_subscription',
  OPS_TEAM_MEMBER = ' opsTeamMember'
}
