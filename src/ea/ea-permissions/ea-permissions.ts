export enum EaPermissionEnum {
    // admin
    Admin = 'admin',
  
    Debug = 'debug',
    LookupDealQuote = 'ea.lookup_deal_quote',
  
    // common
    RoMessage = 'dashboard.header.ro_message',
    RwMessage = 'dashboard.header.rw_message',
  
  //project 
  ProjectEdit = 'project.edit',
  ProjectReopen ='project.reopen',
  ProjectManageTeam = 'project.manage_team',
  ProjectSmartAccountEditAccess = 'project.edit_smart_account',
  ProjectOrgIdEditAccess = 'project.edit_orgId',
  ProjectCreateBpIdAccess = "project.create_bpid",
  
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
    ProposalView = 'proposal.view', 
  
    DocCenter = 'proposal.document_center',
    SalesReadiness = 'proposal.sales_readiness',
  
  
  
  
    // DNA max subscription discount Approvers
    DnaDiscountApprover = 'proposal.dna.discount.approval',
  
    // proposal purchase adjustment
    PurchaseAdjustmentPermit = 'proposal.pa',
    PurchaseAdjustmentApprover = 'proposal.pa.approval',
  
  
    // Admin
   
  
  
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
    SELLER_UPDATE_OTD = 'proposal.seller_update_otd',
    ConvertToQuote = 'proposal.convert_to_quote'
  
  }
  