import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataIdConstantsService {
readonly tco_icon_editTco = 'tco.icon.editTco';
readonly tco_link_saveTcoName = 'tco.link.saveTcoName';
readonly tco_link_cancelTcoNameChange = 'tco.link.cancelTcoNameChange';
readonly tco_button_backToProposal = 'tco.button.backToProposal';
readonly tco_button_generateProposal = 'tco.button.generateProposal';
readonly tco_button_refreshTco = 'tco.butto.refreshTco'
readonly tco_link_openAdvancedModelingGrowthExpense = 'tco.link.openAdvancedModelingGrowthExpense';
readonly tco_link_openAdvancedModelingTimevaluemoney = 'tco.link.openAdvancedModelingTimevaluemoney';
readonly tco_link_openAdvancedModelingPartnerbreakup = 'tco.link.openAdvancedModelingPartnerbreakup';
readonly tco_button_openAdditionalCost = 'tco.button.openAdditionalCost';
readonly downloadCustomerScope_button_cancel = 'downloadCustomerScope.button.cancel';
readonly downloadCustomerScope_button_closeIcon = 'downloadCustomerScope.button.close';
readonly downloadCustomerScope_button_downloadFile = 'downloadCustomerScope.button.downloadFile';
readonly downloadCustomerScope_input_selectVersion = 'downloadCustomerScope.input.selectVersion.';
readonly cancelScope_button_confirm = 'cancelScope.button.confirm';
readonly cancelScope_button_cancel = 'cancelScope.button.cancel';
readonly reviewChangeScope_button_download = 'reviewChangeScope.button.download';
readonly reviewChangeScope_button_close = 'reviewChangeScope.button.close';
readonly reviewChangeScope_button_closeIcon = 'reviewChangeScope.button.closeIcon';
readonly reviewChangeScope_icon_fullBU = 'reviewChangeScope.icon.fullBU.';
readonly reviewChangeScope_icon_paritalBU = 'reviewChangeScope.icon.paritalBU.';
readonly reviewChangeScope_data_changeSummary = 'reviewChangeScope.data.changeSummary.';
readonly scopeChangeReason_button_continue = 'scopeChangeReason.button.continue';
readonly scopeChangeReason_button_close = 'scopeChangeReason.button.close';
readonly scopeChangeReason_text_reasonDetail = 'scopeChangeReason.text.reasonDetail';
readonly scopeChangeReason_dropdown_selectReason = 'scopeChangeReason.dropdown.selectReason.';
readonly scopeChangeReason_dropdown_selectedReason = 'scopeChangeReason.dropdown.selectedReason.';
readonly scopeChangeReason_dropdown_selectedReason_select = 'scopeChangeReason.dropdown.selectedReason.select';
readonly scopeChangeReason_button_closeIcon = 'scopeChangeReason.button.closeIcon';
readonly scopeChangeReason_header_scopeChangeReason = 'scopeChangeReason.header.scopeChangeReason';
readonly scopeChangeReason_text_provideReason = 'scopeChangeReason.text.provideReason';
readonly scopeChangeReason_label_selectReason = 'scopeChangeReason.label.selectReason';
readonly scopeChangeReason_label_reason = 'scopeChangeReason.label.reason';

readonly cancelScope_header_cancelScopeChange = 'cancelScope.header.cancelScopeChange';
readonly cancelScope_header_cancelScopeChange_msg = 'cancelScope.header.cancelScopeChange.msg';
readonly cancelScope_header_restoreOriginalScope_msg = 'cancelScope.header.restoreOriginalScope.msg';
readonly cancelScope_header_restoreOriginalScope = 'cancelScope.header.restoreOriginalScope';

readonly associatedSubsriptions_header = 'associatedSubsriptions.header';
readonly associatedSubsriptions_header_subscriptionId = 'associatedSubsriptions.header.subscriptionId';
readonly associatedSubsriptions_header_startDate = 'associatedSubsriptions.header.startDate';
readonly associatedSubsriptions_header_endDate = 'associatedSubsriptions.header.endDate';
readonly associatedSubsriptions_header_hwPurchse = 'associatedSubsriptions.header.hwPurchse';
readonly associatedSubsriptions_header_subscriptionStatus = 'associatedSubsriptions.header.subscriptionStatus'
readonly associatedSubsriptions_data_subrefId = 'associatedSubsriptions.data.subrefId.';
readonly associatedSubsriptions_data_startDate = 'associatedSubsriptions.data.startDate.';
readonly associatedSubsriptions_data_endDate = 'associatedSubsriptions.data.endDate.';
readonly associatedSubsriptions_data_hwPurchse = 'associatedSubsriptions.data.hwPurchse.';
readonly associatedSubsriptions_data_subscriptionStatus = 'associatedSubsriptions.data.subscriptionStatus.';
readonly associatedSubsriptions_data_noDataFound = 'associatedSubsriptions.data.noDataFound';

readonly reviewSubmitScope_header_scopeChangeReason = 'reviewSubmitScope.header.scopeChangeReason';
readonly reviewSubmitScope_header_scopeChangeDetails = 'reviewSubmitScope.header.scopeChangeDetails';

 readonly eaDashboard_link_tab_deals = 'eaDashboard.link.tab.deals';
 readonly eaDashboard_link_tab_pendingApprovals = 'eaDashboard.link.tab.pendingApprovals';

 readonly eaDashboard_page_eaDashboardPage = 'eaDashboard.page.eaDashboardPage';

 readonly dashboardDealList_link_filter = 'dashboardDealList.link.filter';
 readonly dashboardDealList_button_searchdrop = 'dashboardDealList.button.searchdrop';
 readonly dashboardDealList_link_dropdown_seachDropValue = 'dashboardDealList.link.dropdown.seachDropValue';
 readonly dashboardDealList_text_searchParam = 'dashboardDealList.text.searchParam';
 readonly dashboardDealList_button_searchdata = 'dashboardDealList.button.searchdata';
 readonly dashboardDealList_icon_clearSearchdata = 'dashboardDealList.icon.clearSearchdata';
 readonly dashboardDealList_icon_SearchDealdata = 'dashboardDealList.icon.SearchDealdata';
 readonly dashboardDealList_link_salesAction = 'dashboardDealList.link.salesAction';
 readonly dashboardDealList_link_goToProject = 'dashboardDealList.link.goToProject';
 readonly dashboardDealList_link_goToProposalList = 'dashboardDealList.link.goToProposalList';
 readonly dashboardDealList_link_goToProposal = 'dashboardDealList.link.goToProposal.';
 readonly dashboardDealList_link_goToQuote = 'dashboardDealList.link.goToQuote';

 readonly dashboardProposalList_link_goToQuote = 'dashboardProposalList.link.goToQuote';
 readonly dashboardProposalList_link_goToProposal = 'dashboardProposalList.link.goToProposal';

 readonly dashboardProjectList_link_selectedViewDrop = 'dashboardProjectList.link.selectedViewDrop';
 readonly dashboardProjectList_link_dropdown_selectedView = 'dashboardProjectList.link.dropdown.selectedView';
 readonly dashboardProjectList_text_searchProject = 'dashboardProjectList.text.searchProject';
 readonly dashboardProjectList_icon_searchProject = 'dashboardProjectList.icon.searchProject';
 readonly dashboardProjectList_icon_closeSearch = 'dashboardProjectList.icon.closeSearch'
 readonly dashboardProjectList_link_goToProject = 'dashboardProjectList.link.goToProject';

 readonly dashboarPendingApprovals_link_pendingExceptionsFilter = 'dashboarPendingApprovals.link.pendingExceptionsFilter';
 readonly dashboarPendingApprovals_text_searchExceptions = 'dashboarPendingApprovals.text.searchExceptions';
 readonly dashboarPendingApprovals_link_pendingExceptionsViewDrop = 'dashboarPendingApprovals.link.pendingExceptionsViewDrop';
 readonly dashboarPendingApprovals_link_dropdown_pendingExceptionsView = 'dashboarPendingApprovals.link.dropdown.pendingExceptionsView';
 readonly dashboarPendingApprovals_link_goToProposal = 'dashboarPendingApprovals.link.goToProposal';
 readonly dashboarPendingApprovals_icon_exceptionsTeamDropdown = 'dashboarPendingApprovals.icon.exceptionsTeamDropdown';

 readonly filerMenu_button_close = 'filerMenu.button.close';
 readonly filerMenu_link_showFilters = 'filerMenu.link.showFilters';
 readonly filerMenu_dropdown_selectFiler = 'filerMenu.dropdown.selectFiler';
 readonly filerMenu_checkbox_filterSelect = 'filerMenu.checkbox.filterSelect';
 readonly filerMenu_radio_filterSelect = 'filerMenu.radio.filterSelect';
 readonly filerMenu_button_clearAll = 'filerMenu.button.clearAll';
 readonly filerMenu_button_apply = 'filerMenu.button.apply';

 readonly gideMe_button_close = 'gideMe.button.close';
 readonly openCase_button_close = 'openCase.button.close';
 readonly openCase_link_caseDetails = 'openCase.link.caseDetails';

 readonly proxyUser_button_close = 'proxyUser.button.close';
 readonly proxyUser_button_apply = 'proxyUser.button.apply';
 readonly proxyUser_text_cecId = 'proxyUser.text.cecId';

 readonly proxyUser_button_continue = 'proxyUser.button.continue';

 readonly tco_chart_previous_button = 'tco.chart.previous.button';
 readonly tco_chart_next_button = 'tco.chart.next.button';


 readonly assignSmartAccount_dropdown_selectedSmartAccOption = 'assignSmartAccount.dropdown.selectedSmartAccOption';
 readonly assignSmartAccount_button_closeIcon='assignSmartAccount.button.closeIcon';
 readonly assignSmartAccount_radio_selectSmartAccount = 'assignSmartAccount.radio.selectSmartAccount';
 readonly assignSmartAccount_link_requestNewSmartAccount = 'assignSmartAccount.link.requestNewSmartAccount';
 readonly assignSmartAccount_dropdown_selectedSearchType = 'assignSmartAccount.dropdown.selectedSearchType';
 readonly assignSmartAccount_text_searchText = 'assignSmartAccount.text.searchText';
 readonly assignSmartAccount_button_getSmartAcc = 'assignSmartAccount.button.getSmartAcc';
 readonly assignSmartAccount_button_clearResults = 'assignSmartAccount.button.clearResults';
 readonly assignSmartAccount_button_assign= 'assignSmartAccount.button.assign';
 readonly assignSmartAccount_link_selectType = 'assignSmartAccount.link.selectType';
 readonly assignSmartAccount_dropdown_selectSmartAcctOption = 'assignSmartAccount.dropdown.selectSmartAcctOption';
 readonly assignSmartAccount_button_cancel = 'assignSmartAccount.button.cancel';

 readonly subHeader_textarea_projectName = 'subHeader.textarea.projectName';
 readonly subHeader_link_saveUpdatedProjectName = 'subHeader.link.saveUpdatedProjectName';
 readonly subHeader_link_cancelNameChange = 'subHeader.link.cancelNameChange';
 readonly subHeader_icon_editProjectName = 'subHeader.icon.editProjectName';
 readonly subHeader_button_reOpenProject = 'subHeader.button.reOpenProject';
 readonly subHeader_link_viewAuth = 'subHeader.link.viewAuth';
 readonly subHeader_link_saveUpdatedName = 'subHeader.link.saveUpdatedName';
 readonly subHeader_link_openQuoteUrl = 'subHeader.link.openQuoteUrl';
 readonly subHeader_link_viewDocumentCenter = 'subHeader.link.viewDocumentCenter';
 readonly subHeader_text_smartAcctSearchText = 'subHeader.text.smartAcctSearchText';
 readonly subHeader_icon_editProposalName = 'subHeader.icon.editProposalName';
 readonly subHeader_link_requestNewSmartAccount = 'subHeader.link.requestNewSmartAccount';
 readonly subHeader_button_transferToDisti = 'subHeader.button.transferToDisti';
 readonly subHeader_button_withdrawFromDisti = 'subHeader.button.withdrawFromDisti';
 readonly subHeader_link_editProposalDetails = 'subHeader.link.editProposalDetails';
 readonly subHeader_icon_openSmartAccount = 'subHeader.icon.openSmartAccount';
 readonly subHeader_icon_financialSummary = 'subHeader.icon.financialSummary';
 readonly subHeader_icon_edit_systemDate = 'subHeader.icon.edit.systemDate';
 readonly subHeader_systemDate = 'subHeader.systemDate';
 readonly subHeader_page_subHeaderPage = 'subHeader.page.subHeaderPage';
 readonly systemDate_button_edit = 'systemDate.button.edit';
 readonly systemDate_button_closeButton = 'systemDate.button.close';

 readonly loccStatus_link_loccStatus = 'loccStatus.link.loccStatus';
 readonly loccStatus_link_loccSigned = 'loccStatus.link.loccSigned';
 readonly loccStatus_link_loccStatusClose = 'loccStatus.link.loccStatusClose';
 readonly loccStatus_link_downloadLoccFile = 'loccStatus.link.downloadLoccFile';
 
 readonly deferLocc_button_close = 'deferLocc.button.close';
 readonly deferLocc_button_closeModal = 'deferLocc.button.closeModal';
 readonly deferLocc_button_defer = 'deferLocc.button.defer';
 readonly deferLocc_modal_deferLoccDoc = 'deferLocc.modal.deferLoccDoc';
 readonly deferLocc_label_deferLoccDoc = 'deferLocc.label.deferLoccDoc';
 readonly deferLocc_label_deferLoccDocMsg = 'deferLocc.label.deferLoccDocMsg';
 readonly deferLocc_label_incumbentPartner = 'deferLocc.label.incumbentPartner';
 readonly deferLocc_label_validCcwQuote = 'deferLocc.label.validCcwQuote';
 readonly deferLocc_label_salesAssets = 'deferLocc.label.salesAssets';
 readonly deferLocc_label_loccAtLaterTime = 'deferLocc.label.loccAtLaterTime';
 readonly deferLocc_label_likeToProceed = 'deferLocc.label.likeToProceed';


 readonly locc_button_close = 'locc.button.close';
 readonly locc_button_loccDocLanguage = 'locc.button.loccDocLanguage';
 readonly locc_button_continue = 'locc.button.continue';
 readonly locc_button_back = 'locc.button.back';
 readonly locc_button_initiateLocc= 'locc.button.initiateLocc';
 readonly locc_button_loccImport = 'locc.button.loccImport';
 readonly locc_button_validMonths = 'locc.button.validMonths';
 readonly locc_button_sendAgain = 'locc.button.sendAgain';
 readonly locc_button_importLocc = 'locc.button.importLocc';
 readonly locc_radio_deferLocc = 'locc.radio.deferLocc';
 readonly locc_radio_uploadLocc = 'locc.radio.uploadLocc';
 readonly locc_radio_intitateSig = 'locc.radio.intitateSig';
 readonly locc_radio_yes = 'locc.radio.yes';
 readonly locc_radio_no = 'locc.radio.no';
 readonly locc_file_dropFile = 'locc.file.dropFile';
 readonly locc_text_datePicker = 'locc.text.datePicker';
 readonly locc_link_browse = 'locc.link.browse';
 readonly locc_link_editInfo = 'locc.link.editInfo';
 readonly locc_link_editPreferred = 'locc.link.editPreferred';
 readonly locc_link_downloadLoccFile = 'locc.link.downloadLoccFile';
 readonly locc_dropdown_selectLanguage = 'locc.dropdown.selectLanguage';
 readonly locc_dropdown_selectValidMonth = 'locc.dropdown.selectValidMonth';

 readonly changeDealId_checkbox_selectProposal = 'changeDealId.checkbox_selectProposal';
 readonly changeDealId_checkbox_selectItems = 'changeDealId.checkbox.selectItems';
 readonly changeDealId_text_newDealId = 'changeDealId.text.newDealId';
 readonly changeDealId_checkbox_matchDealId = 'changeDealId.checkbox.matchDealId';
 readonly changeDealId_button_closeIcon = 'changeDealId.button.closeIcon';
 readonly changeDealId_button_lookUpDeal = 'changeDealId.button.lookUpDeal';
 readonly changeDealId_button_changeDealId = 'changeDealId.button.changeDealId';
 readonly changeDealId_button_cancel = 'changeDealId.button.cancel';

 readonly financialSummary_button_close = 'financialSummary.button.close';

 readonly manageServiceProvider_radio_yes = 'manageServiceProvider.radio.yes';
 readonly manageServiceProvider_radio_no = 'manageServiceProvider.radio.no';
 readonly manageTeam_icon_closeMspMsg = 'manageTeam.icon.closeMspMsg';

 readonly multiError_link_showMore = 'multiError.link.showMore';

 readonly initiateLoccMessageModal_link_closeMessage = 'initiateLoccMessageModal.link.closeMessage';
 readonly initiateLoccMessageModal_button_initiateLocc = 'initiateLoccMessageModal.button.initiateLocc';

 readonly proposalList_text_searchParam = 'proposalList.text.searchParam';
 readonly proposalList_link_openQuoteUrl = 'proposalList.link.openQuoteUrl';
 readonly proposalList_link_goToProposal = 'proposalList.link.goToProposal';
 readonly proposalList_link_openDropdown = 'proposalList.link.openDropdown';
 readonly proposalList_link_downloadExcel = 'proposalList.link.downloadExcel';
 readonly proposalList_link_editProposalName = 'proposalList.link.editProposalName';
 readonly proposalList_link_copy = 'proposalList.link.copy';
 readonly proposalList_link_delete = 'proposalList.link.delete';
 readonly proposalList_link_openManageTeam = 'proposalList.link.openManageTeam';
 readonly proposalList_link_saveUpdatedName = 'proposalList.link.saveUpdatedName';
 readonly proposalList_link_cancelNameChange= 'proposalList.link.cancelNameChange';
 readonly proposalList_icon_search = 'proposalList.icon.search';
 readonly proposalList_icon_closeSearch = 'proposalList.icon.closeSearch';

 readonly subscriptionList_button_deselectSubscription = 'subscriptionList.button.deselectSubscription';
 readonly subscriptionList_button_selectSubscription = 'subscriptionList.button.selectSubscription';
 readonly subscriptionList_button_lookupSubscription = 'subscriptionList.button.lookupSubscription';

 readonly successPopover_link_closeMessage = 'successPopover.link.closeMessage';
 readonly successPopover_link_closeSuccessMessage = 'successPopover.link.closeSuccessMessage';
 readonly successPopover_link_closeErrorMessage = 'successPopover.link.closeErrorMessage';

 readonly documentCenter_button_backToProposalDashboard = 'documentCenter.button.backToProposalDashboard';
 readonly documentCenter_button_backToProposal = 'documentCenter.button.backToProposal';
 readonly documentCenter_link_legalPackage = 'documentCenter.link.legalPackage';
 readonly documentCenter_link_documentCenter = 'documentCenter.link.documentCenter';
 readonly documentCenter_link_multiPartnerConsent = 'documentCenter.link.multiPartnerConsent';
 readonly documentCenter_link_download = 'documentCenter.link.download';
 readonly documentCenter_link_requestIb = 'documentCenter.link.requestIb';
 readonly documentCenter_link_downloadLoccFile = 'documentCenter.link.downloadLoccFile';

 readonly documentCenter_page_documentCenterPage = 'documentCenter.page.documentCenterPage'

 readonly multiPartnerConsent_radio_intitateSig = 'multiPartnerConsent.radio.intitateSig';
 readonly multiPartnerConsent_radio_uploadDoc = 'multiPartnerConsent.radio.uploadDoc';
 readonly multiPartnerConsent_link_closeMessage = 'multiPartnerConsent.link.closeMessage';
 readonly multiPartnerConsent_link_editPreferredLegal = 'multiPartnerConsent.link.editPreferredLegal';
 readonly multiPartnerConsent_link_editCustomerRep = 'multiPartnerConsent.link.editCustomerRep';
 readonly multiPartnerConsent_button_selectLanguage = 'multiPartnerConsent.button.selectLanguage';
 readonly multiPartnerConsent_button_continue = 'multiPartnerConsent.button.continue';
 readonly multiPartnerConsent_button_back = 'multiPartnerConsent.button.back';
 readonly multiPartnerConsent_button_initiateESignature = 'multiPartnerConsent.button.initiateESignature';
 readonly multiPartnerConsent_link_partnerConsentdownload = 'multiPartnerConsent.link.partnerConsentdownload';
 readonly multiPartnerConsent_link_downloadDoc = 'multiPartnerConsent.link.downloadDoc';
 readonly multiPartnerConsent_button_restart = 'multiPartnerConsent.button.restart';
 readonly multiPartnerConsent_radio_uploadFile = 'multiPartnerConsent.radio.uploadFile';
 readonly multiPartnerConsent_link_browse = 'multiPartnerConsent.link.browse';
 readonly multiPartnerConsent_button_done = 'multiPartnerConsent.button.done';



 readonly editProject_checkbox_acceptEdit = 'editProject.checkbox.acceptEdit';
 readonly editProject_button_edit = 'editProject.button.edit';
 readonly editProject_button_closeModal = 'editProject.button.closeModal';
 readonly editProject_page_reOpenProject = 'editProject.page.reOpenProject';

 readonly selectMeraki_button_backToProject = 'selectMeraki.button.backToProject';
 readonly selectMeraki_button_save = 'selectMeraki.button.save';
 readonly selectMeraki_textarea_orgIds = 'selectMeraki.textarea.orgIds';
 readonly selectMeraki_button_downoloadOrgId = 'selectMeraki.button.downoloadOrgId';
 readonly selectMeraki_button_remove = 'selectMeraki.button.remove';

 readonly nextBestAction_button_done = 'nextBestAction.button.done';
 readonly nextBestAction_link_createProposal = 'nextBestAction.link.createProposal';
 readonly nextBestAction_button_viewProposalList = 'nextBestAction.button.viewProposalList';
 readonly nextBestAction_button_changeDealId = 'nextBestAction.button.changeDealId';
 readonly nextBestAction_label_loccDoc = 'nextBestAction.label.loccDoc';
 readonly nextBestAction_label_SelectSubsidiaries  = 'nextBestAction.label.SelectSubsidiaries';
 readonly nextBestAction_label_addCiscoTeam = 'nextBestAction.label.addCiscoTeam';
 readonly nextBestAction_label_addTeamMembers = 'nextBestAction.label.addTeamMembers';
 readonly nextBestAction_label_projectNextBestAction = 'nextBestAction.label.projectNextBestAction';
 readonly nextBestAction_label_suggestedActions = 'nextBestAction.label.suggestedActions';
 readonly nextBestAction_label_createProposal = 'nextBestAction.label.createProposal';
 readonly nextBestAction_label_changeDealId = 'nextBestAction.label.changeDealId';
 readonly nextBestAction_label_proposalList = 'nextBestAction.label.proposalList';
 readonly nextBestAction_label_cloneProposal = 'nextBestAction.label.cloneProposal';
 readonly nextBestAction_link_cloneProposal = 'nextBestAction.link.cloneProposal';

 readonly project_button_continue = 'project.button.continue';
 readonly project_link_projectEditMessageClose = 'project.link.projectEditMessageClose';
 readonly project_text_projectName = 'project.text.projectName';
 readonly project_button_smrtAccntName = 'project.button.smrtAccntName';
 readonly project_button_smrtAccntNameEdit = 'project.button.smrtAccntNameEdit';
 readonly project_label_editProject = 'project.label.editProject';
 readonly project_label_createProject = 'project.label.createProject';
 readonly project_label_projectDetails = 'project.label.projectDetails';
 readonly project_label_smartAccount = 'project.label.smartAccount';
 readonly project_data_smartAccountName = 'project.data.smartAccountName.';
 readonly project_page_projectPage = 'project.page.projectPage';

 readonly manageTeam_button_close = 'manageTeam.button.close';
 readonly manageTeam_button_closeModal = 'manageTeam.button.closeModal';
 readonly manageTeam_page_manageTeamModal = 'manageTeam.page.manageTeamModal'

 readonly partnerTeam_dropdown_selectTeam = 'partnerTeam.dropdown.selectTeam';
 readonly partnerTeam_dropdown_selectType = 'partnerTeam.dropdown.selectType';
 readonly partnerTeam_text_userId = 'partnerTeam.text.userId';
 readonly partnerTeam_button_addTeamMember = 'partnerTeam.button.addTeamMember';
 readonly partnerTeam_checkbox_webexNotification = 'partnerTeam.checkbox.webexNotification';
 readonly partnerTeam_checkbox_notifyByWelcomeKit = 'partnerTeam.checkbox.notifyByWelcomeKit';
 readonly partnerTeam_checkbox_allWebexCheck = 'partnerTeam.checkbox.allWebexCheck';
 readonly partnerTeam_checkbox_allWelcomeKitCheck = 'partnerTeam.checkbox.allWelcomeKitCheck';
 readonly partnerTeam_dropdown_searchTeamByOption = 'partnerTeam.dropdown.searchTeamByOption.';
 readonly partnerTeam_dropdown_selectPartnerTeam = 'partnerTeam.dropdown.selectPartnerTeam';
 readonly partnerTeam_label_partnerTeamMembers = 'partnerTeam.label.partnerTeamMembers';
 readonly partnerTeam_label_noTeamMemberAdded = 'partnerTeam.label.noTeamMemberAdded';
 readonly partnerTeam_label_listWelcomeKit = 'partnerTeam.label.listWelcomeKit';
 readonly partnerTeam_label_listWebexTeams = 'partnerTeam.label.listWebexTeams';
 readonly partnerTeam_label_action = 'partnerTeam.label.action';
 readonly partnerTeam_label_listNotifyBy = 'partnerTeam.label_listNotifyBy';
 readonly partnerTeam_label_partner = 'partnerTeam.label.partner';
 readonly partnerTeam_label_email = 'partnerTeam.label.email';
 readonly partnerTeam_label_ciscoId = 'partnerTeam.label.ciscoId';
 readonly partnerTeam_label_name = 'partnerTeam.label.name';
 readonly partnerTeam_label_welcomeKit = 'partnerTeam.label.welcomeKit';
 readonly partnerTeam_label_webexTeam = 'partnerTeam.label.webexTeam';
 readonly partnerTeam_label_notifyBy = 'partnerTeam.label.notifyBy';
 readonly partnerTeam_label_enterMemberId = 'partnerTeam.label.enterMemberId';
 readonly partnerTeam_label_addMember = 'partnerTeam.label.addMember';
 readonly partnerTeam_label_selectIdType = 'partnerTeam.label.selectIdType';
 readonly partnerTeam_label_selectTeam = 'partnerTeam.label.selectTeam';
 readonly partnerTeam_label_team = 'partnerTeam.label.team';


 readonly ciscoTeam_icon_removeSelectedMember = 'ciscoTeam.icon.removeSelectedMember';
 readonly ciscoTeam_text_searchMember = 'ciscoTeam.text.searchMember';
 readonly ciscoTeam_button_add = 'ciscoTeam.button.add';
 readonly ciscoTeam_checkbox_webexAddCheck = 'ciscoTeam.checkbox.webexAddCheck';
 readonly ciscoTeam_checkbox_welcomeAddCheck = 'ciscoTeam.checkbox.welcomeAddCheck';
 readonly ciscoTeam_checkbox_allWebexCheck = 'ciscoTeam.checkbox.allWebexCheck';
 readonly ciscoTeam_checkbox_allWelcomeKitCheck = 'ciscoTeam.checkbox.allWelcomeKitCheck';
 readonly ciscoTeam_checkbox_notifyByWelcomeKit = 'ciscoTeam.checkbox.notifyByWelcomeKit.';
 readonly ciscoTeam_checkbox_webexNotification= 'ciscoTeam.checkbox.webexNotification.';
 readonly ciscoTeam_link_deleteTeamMember = 'ciscoTeam.link.deleteTeamMember.';
 readonly ciscoTeam_dropdown_selectMember = 'ciscoTeam.dropdown.selectMember.';
 readonly ciscoTeam_icon_manageTeamEdit = 'ciscoTeam.icon.manageTeamEdit';
 readonly ciscoTeam_icon_searchMember = 'ciscoTeam.icon.searchMember';
 readonly ciscoTeam_label_ciscoTeamMembers = 'ciscoTeam.label.ciscoTeamMembers';
 readonly ciscoTeam_label_noTeamMemberAdded = 'ciscoTeam.label.noTeamMemberAdded';
 readonly ciscoTeam_data_listRole = 'ciscoTeam.data.listRole';
 readonly ciscoTeam_data_listEmail = 'ciscoTeam.data.listEmail';
 readonly ciscoTeam_data_listUserId = 'ciscoTeam.data.listUserId';
 readonly ciscoTeam_data_listName = 'ciscoTeam.data.listName';
 readonly ciscoTeam_label_listWelcomeKit = 'ciscoTeam.label.listWelcomeKit';
 readonly ciscoTeam_label_listWebexTeams = 'ciscoTeam.label.listWebexTeams';
 readonly ciscoTeam_label_listAction = 'ciscoTeam.label.listAction';
 readonly ciscoTeam_label_listNotifyBy = 'ciscoTeam.label.listNotifyBy';
 readonly ciscoTeam_label_listJobTitle = 'ciscoTeam.label.listJobTitle';
 readonly ciscoTeam_label_email = 'ciscoTeam.label.email';
 readonly ciscoTeam_label_ciscoId = 'ciscoTeam.label.ciscoId';
 readonly ciscoTeam_label_listName = 'ciscoTeam.label.listName';
 readonly ciscoTeam_label_welcomeKit = 'ciscoTeam.label.welcomeKit';
 readonly ciscoTeam_label_webexTeams = 'ciscoTeam.label.webexTeams';
 readonly ciscoTeam_label_notifyBy = 'ciscoTeam.label.notifyBy';
 readonly ciscoTeam_data_searchListJobTitle = 'ciscoTeam.data.searchListJobTitle';
 readonly ciscoTeam_data_searchListFullName = 'ciscoTeam.data.searchListFullName';
 readonly ciscoTeam_label_title = 'ciscoTeam.label.title';
 readonly ciscoTeam_label_name = 'ciscoTeam.label.name';
 readonly ciscoTeam_data_searchMemberFullName = 'ciscoTeam.data.searchMemberFullName';
 readonly ciscoTeam_label_searchMembers = 'ciscoTeam.label.searchMembers';


 readonly subsidiaries_button_showSubsidiaries = 'subsidiaries.button.showSubsidiaries';
 readonly subsidiaries_link_viewParties = 'subsidiaries.link.viewParties.';
 readonly subsidiaries_checkbox_selectBu = 'subsidiaries.checkbox.selectBu.';
 readonly subsidiaries_label_selectSubsidiaries = 'subsidiaries.label.selectSubsidiaries';
 readonly subsidiaries_link_createBpId = 'subsidiaries.link.createBpId';
 readonly subsidiaries_icon_offerSwipeLeft = 'subsidiaries.icon.offerSwipeLeft';
 readonly subsidiaries_icon_offerSwipeRight = 'subsidiaries.icon.offerSwipeRight';
 readonly subsidiaries_link_bpIdDetails = 'subsidiaries.link.bpIdDetails.';
 readonly subsidiaries_radio_bpIdSelection = 'subsidiaries.radio.bpIdSelection.'

 readonly selectMoreBu_link_subsidiaries = 'selectMoreBu.link.subsidiaries';
 readonly selectMoreBu_link_orgId = 'selectMoreBu.link.orgId';
 readonly selectMoreBu_button_redirectToCustomerServiceHub = 'selectMoreBu.button.redirectToCustomerServiceHub';
 readonly selectMoreBu_link_geographyFilter = 'selectMoreBu.link.geographyFilter';
 readonly selectMoreBu_button_backToProject = 'selectMoreBu.button.backToProject';
 readonly selectMoreBu_button_downloadExcel = 'selectMoreBu.button.downloadExcel';
 readonly selectMoreB_button_saveContinue = 'selectMoreBu.button.saveContinue';
 readonly selectMoreBu_checkbox_selectAllCustomerBu = 'selectMoreBu.checkbox.selectAllCustomerBu';
 readonly selectMoreBu_checkbox_exactSearch = 'selectMoreBu.checkbox.selectMoreBu_checkbox_exactSearch';
 readonly selectMoreBu_button_filter_all = 'selectMoreBu.checkbox.selectMoreBu.button.filter.all';
 readonly selectMoreBu_button_filter_selected = 'selectMoreBu.checkbox.selectMoreBu.button.filter.selected';
 readonly selectMoreBu_button_filter_unselected = 'selectMoreBu.checkbox.selectMoreBu.button.filter.unselected';
 readonly selectMoreBu_checkbox_buSelection = 'selectMoreBu.checkbox.buSelection';
 readonly selectMoreBu_link_viewParties = 'selectMoreBu.link.viewParties';
 readonly selectMoreBu_checkbox_selectAllSites = 'selectMoreBu.checkbox.selectAllSites';
 readonly selectMoreBu_link_selectDeselectEntireBu = 'selectMoreBu.link.selectDeselectEntireBu';
 readonly selectMoreBu_checkbox_partySelection = 'selectMoreBu.checkbox.partySelection';
 readonly selectMoreBu_icon_fullBU = 'selectMoreBu.icon.fullBU.';
 readonly selectMoreBu_icon_partialBU = 'selectMoreBu.icon.partialBU.';

 readonly cavIdDetials_link_viewParties = 'cavIdDetials.link.viewParties.';
 readonly cavIdDetials_link_viewParties_disabled = 'cavIdDetials.link.viewParties.disabled.';
 readonly cavIdDetials_checkbox_selectAllCustomerBu = 'cavIdDetials.checkbox.selectAllCustomerBu';
 readonly cavIdDetials_checkbox_buSelection = 'cavIdDetials.checkbox.buSelection.';
 readonly cavIdDetials_checkbox_selectAllSites = 'cavIdDetials.checkbox.selectAllSites';
 readonly cavIdDetials_checkbox_partySelection = 'cavIdDetials.checkbox.partySelection.';

 readonly bpIdDetails_button_close = 'bpIdDetails.button.close';
 readonly bpIdDetails_link_nav_showPortfoliosSuites = 'bpIdDetails.link.nav.showPortfoliosSuites';
 readonly bpIdDetails_link_showPortfoliosSuites = 'bpIdDetails.link.showPortfoliosSuites'
 readonly bpIdDetails_link_nav_showCav = 'bpIdDetails.link.nav.showCav';
 readonly bpIdDetails_link_showCav = 'bpIdDetails.link.showCav';

 readonly BPIDDETAILS_SUBSCRIPTION_ID = 'bpIdDetails_subscription_id';
 readonly BPIDDETAILS_BUTTON_DOWNLOADEXCEL = 'bpIdDetails.button.downloadExcel';
 readonly BPIDDETAILS_SUBSCRIPTION_TYPE = 'bpIdDetails_subscription_type';
 readonly BPIDDETAILS_SUBSCRIPTION_DAYSLEFT = 'bpIdDetails_subscription_renewalType';
 readonly BPIDDETAILS_SUBSCRIPTION_STATUSDESC = 'bpIdDetails_subscription_statusDesc';
 readonly BPIDDETAILS_SUBSCRIPTION_STARTDATE = 'bpIdDetails_subscription_startDate';
 readonly BPIDDETAILS_SUBSCRIPTION_ENDDATE = 'bpIdDetails_subscription_endDate';
 readonly BPIDDETAILS_SUBSCRIPTION_SUITES  = 'bpIdDetails_subscription_suites';
 readonly BPIDDETAILS_SUBSCRIPTION_PARTNER = 'bpIdDetails_subscription_partner';
 readonly CREATEBPID_RADIO_YES = 'createBpId.radio.yes';
 readonly CREATEBPID_RADIO_NO = 'createBpId.radio.no';
 readonly BPIDLIST_CHECKBOX_BPID_SELECT = 'bpIdList.checkbox.bpId.select.';
 readonly BPIDLIST_RADIO_BPID_SELECTION = 'bpIdList.radio.bpId.selection.';
 readonly BPIDLIST_LINK_BPIDDETAILS = 'bpIdList.link.bpIdDetails.';
 readonly BPIDLIST_ICON_OFFERSWIPERIGHT = 'bpIdList.icon.offerSwipeRight';
 readonly BPIDLIST_ICON_OFFERSWIPELEFT = 'bpIdList.icon.offerSwipeLeft';


 readonly searchSubscriptions_input_searchSubscriptions = 'searchSubscriptions_input_searchSubscriptions';
 readonly searchSubscriptions_button_searchSubscriptions = 'searchSubscriptions_button_searchSubscriptions';
 readonly searchSubscriptions_search_icon__searchSubscriptions = 'searchSubscriptions_search_icon__searchSubscriptions';
 readonly searchSubscriptions_checkbox_searchSubscriptions = 'searchSubscriptions_checkbox_searchSubscriptions';
 readonly searchSubscriptions_subscription_id_searchSubscriptions = 'dataIdConstantsService.searchSubscriptions_subscription_id_searchSubscriptions';
 readonly searchSubscriptions_subscription_type_searchSubscriptions = 'searchSubscriptions_subscription_type_searchSubscriptions';
 readonly searchSubscriptions_subscription_status_searchSubscriptions = 'searchSubscriptions_subscription_status_searchSubscriptions';
 readonly searchSubscriptions_subscription_startDate_searchSubscriptions = 'searchSubscriptions_subscription_startDate_searchSubscriptions';
 readonly searchSubscriptions_subscription_endDate_searchSubscriptions = 'searchSubscriptions_subscription_endDate_searchSubscriptions';
 readonly searchSubscriptions_subscription_partnerName_searchSubscriptions = 'searchSubscriptions_subscription_partnerName_searchSubscriptions';
 readonly searchSubscriptions_table_hyperlink_searchSubscriptions = 'searchSubscriptions_table_hyperlink_searchSubscriptions';
 readonly searchSubscriptions_no_results_searchSubscriptions = 'searchSubscriptions_no_results_searchSubscriptions';
 

 readonly searchDropdown_button_searchDropdown = 'searchDropdown.button.searchDropdown';
 readonly searchDropdown_link_searchDropdownValue = 'searchDropdown.link.searchDropdownValue';
 readonly searchDropdown_text_searchValue = 'searchDropdown.text.searchValue';
 readonly searchDropdown_button_search = 'searchDropdown.button.search';
 readonly searchDropdown_button_closeSearch = 'searchDropdown.button.closeSearch';

 readonly displayTeam_checkbox_webexNotification = 'displayTeam.checkbox.webexNotification.';
 readonly displayTeam_checkbox_notifyByWelcomeKit = 'displayTeam.checkbox.notifyByWelcomeKit.';
 readonly displayTeam_link_deleteTeamMember = 'displayTeam.link.deleteTeamMember.';
 readonly displayTeam_icon_expand = 'displayTeam.icon.expand';
 readonly displayTeam_icon_collapse = 'displayTeam.icon.collapse';
 readonly displayTeam_data_name = 'displayTeam.data.name';
 readonly displayTeam_data_userId = 'displayTeam.data.userId';
 readonly displayTeam_data_email = 'displayTeam.data.email';

 readonly customerDetails_header_preferredLegalName = 'customerDetails.header.preferredLegalName'

 readonly legalPackage_file_uploadFile = 'legalPackage.file.uploadFile';
 readonly legalPackage_radio_no = 'legalPackage.radio.no';
 readonly legalPackage_radio_yes = 'legalPackage.radio.yes';
 readonly legalPackage_radio_uploadDoc = 'legalPackage.radio.uploadDoc';
 readonly legalPackage_radio_initiateSignature = 'legalPackage.radio.initiateSignature';
 readonly legalPackage_link_editPreferredLegal = 'legalPackage.link.editPreferredLegal';
 readonly legalPackage_link_understandLegalPackage = 'legalPackage.link.understandLegalPackage';
 readonly legalPackage_link_downloadDoc = 'legalPackage.link.downloadDoc';
 readonly legalPackage_link_editLegalPackage = 'legalPackage.link.editLegalPackage';
 readonly legalPackage_link_editCustomerRep = 'legalPackage.link.editCustomerRep';
 readonly legalPackage_link_browse = 'legalPackage.link.browse';
 readonly legalPackage_button_import = 'legalPackage.button.import';
 readonly legalPackage_button_downloadBlankCopy = 'legalPackage.button.downloadBlankCopy';
 readonly legalPackage_button_restart = 'legalPackage.button.restart';
 readonly legalPackage_button_initiateESignature = 'legalPackage.button.initiateESignature';
 readonly legalPackage_button_downloadLegalPackage = 'legalPackage.button.downloadLegalPackage';
 readonly legalPackage_button_back = 'legalPackage.button.back';
 readonly legalPackage_button_continue = 'legalPackage.button.continue';
 readonly legalPackage_dropdown_language = 'legalPackage.dropdown.language';
 readonly legalPackage_button_selectLanguage = 'legalPackage.button.selectLanguage';
 readonly legalPackage_icon_delete = 'legalPackage.link.delete';
 readonly legalPackage_icon_removeFile = 'legalPackage.link.removeFile';

 readonly eaLanding_link_requestNewSmartAccount = 'eaLanding.link.requestNewSmartAccount';
 readonly eaLanding_link_openCasewithCav = 'eaLanding.link.openCasewithCav';
 readonly eaLanding_link_involveAm = 'eaLanding.link.involveAm';
 readonly eaLanding_button_goToEamp = 'eaLanding.button.goToEamp';
 readonly eaLanding_button_selectSmartAccount = 'eaLanding.button.selectSmartAccount';
 readonly eaLanding_button_spnaCreateProject = 'eaLanding.button.spnaCreateProject';
 readonly eaLanding_button_spnaGoToProject = 'eaLanding.button.spnaGoToProject';
 readonly eaLanding_button_ea3CreateProject = 'eaLanding.button.ea3CreateProject';
 readonly eaLanding_button_ea3GoToProject = 'eaLanding.button.ea3GoToProject';
 readonly eaLanding_button_ea2CreateQual = 'eaLanding.button.ea2CreateQual';
 readonly eaLanding_button_ea2GoToQual = 'eaLanding.button.ea2GoToQual';
 readonly eaLanding_label_selectBuyingProgram = 'eaLanding.label.selectBuyingProgram';
 readonly eaLanding_figure_selectEa2 = 'eaLanding.figure.selectEa2';
 readonly eaLanding_figure_selectEa3 = 'eaLanding.figure.selectEa3';
 readonly eaLanding_figure_selectSpna = 'eaLanding.figure.selectSpna';
 readonly eaLanding_dropdown_smartAccount = 'eaLanding.dropdown.smartAccount';
 readonly eaLanding_button_createProject = 'eaLanding.button.createProject';
 readonly eaLanding_text_projectName = 'eaLanding.text.projectName';
 readonly eaLanding_link_openCasewithCav_spna = 'eaLanding.link.openCasewithCav.spna';
 readonly eaLanding_link_involveAm_spna = 'eaLanding.link.involveAm.spna';

 readonly eaLanding_page_eaLandingPage = 'eaLanding.page.eaLandingPage';

 readonly guidanceEa_link_goToEaHome = 'guidanceEa.link.goToEaHome';
 readonly guidanceEa_link_goToDownloadPlayBook = 'guidanceEa.link.goToDownloadPlayBook';
 readonly guidanceEa_button_initiateChangeModifySub = 'guidanceEa.button.initiateChangeModifySub';
 readonly guidanceEa_button_goToSalesForce = 'guidanceEa.button.goToSalesForce';
 readonly guidanceEa_button_viewAllDealsInCcw = 'guidanceEa.button.viewAllDealsInCcw';
 readonly eaLanding_button_submit = 'eaLanding.button.submit';
 readonly eaLanding_text_sid = 'eaLanding.text.sid';
 readonly eaLanding_text_quoteId = 'eaLanding.text.quoteId';
 readonly eaLanding_text_dealId = 'eaLanding.text.dealId';

 readonly dashboardProposalist_button_closeFlyOut = 'dashboardProposalist.button.closeFlyOut';
 readonly dashboardProposalist_button_goToProject = 'dashboardProposalist.button.goToProject';
 readonly dashboardProposalist_button_createProposal = 'dashboardProposalist.button.createProposal';

 readonly renewal_button_continue = 'renewal.button.continue';
 readonly renewal_radio_yes_existingSubscriptions = 'renewal.radio.yes.existingSubscriptions';
 readonly renewal_radio_no_existingSubscriptions = 'renewal.radio.no.existingSubscriptions';
 readonly renewal_radio_yes_hybridOfferSubsciptions = 'renewal.radio.yes.hybridOfferSubsciptions';
 readonly renewal_radio_no_hybridOfferSubsciptions = 'renewal.radio.no.hybridOfferSubsciptions';
 readonly renewal_link_goToSubUi = 'renewal.link.goToSubUi';
 readonly renewal_button_addSubscription = 'renewal.button.addSubscription';
 readonly renewal_checkbox_selectSubcription = 'renewal.checkbox.selectSubcription';
 readonly renewal_link_goToSearchedSubUi = 'renewal.link.goToSearchedSubUi';

 readonly renewal_page_renewalPage = 'renewal.page.renewalPage';


 readonly selectAQuote_radio_updateQuoteDetail = 'selectAQuote.radio.updateQuoteDetail';
 readonly selectAQuote_button_closeModal = 'selectAQuote.button.closeModal';

 readonly geographyFilter_button_closeIcon = 'geographyFilter.button.closeIcon';
 readonly geographyFilter_checkbox_selectDeselectAllTheater = 'geographyFilter.checkbox.selectDeselectAllTheater';
 readonly geographyFilter_link_deselectAll = 'geographyFilter.link.deselectAll'
 readonly geographyFilter_link_selectAll = 'geographyFilter.link.selectAll';
 readonly geographyFilter_checkbox_changeCountryStatus = 'geographyFilter.checkbox.changeCountryStatus';
 readonly geographyFilter_button_closeButton = 'geographyFilter.button.closeButton';
 readonly geographyFilter_button_saveSelectedCountries = 'geographyFilter.button.saveSelectedCountries';

 readonly createPro_button_createProposal = 'createPro.button.createProposal';
 readonly createPro_link_closeInfoMsg = 'createPro.link.closeInfoMsg';
 readonly createPro_text_proposalName = 'createPro.text.proposalName';
 readonly createPro_text_countrySearch = 'createPro.text.countrySearch';
 readonly createPro_dropdown_selectCountryOfTransaction = 'createPro.dropdown.selectCountryOfTransaction.';
 readonly createPro_button_priceList = 'createPro.button.priceList';
 readonly createPro_dropdown_selectPriceList = 'createPro.dropdown.selectPriceList.';
 readonly createPro_button_partnerList = 'createPro.button.partnerList';
 readonly createPro_dropdown_selectPartner = 'createPro.dropdown.selectPartner.';
 readonly createPro_text_distiName = 'createPro.text.distiName';
 readonly createPro_button_billingModal = 'createPro.button.billingModal';
 readonly createPro_dropdown_selectBillingModal= 'createPro.dropdown.selectBillingModal.';
 readonly createPro_text_datePicker = 'createPro.text.datePicker';
 readonly createPro_icon_calendar = 'createPro.icon.calendar';
 readonly createPro_radio_months36 = 'createPro.radio.months36';
 readonly createPro_radio_months60 = 'createPro.radio.months60';
 readonly createPro_radio_customMonths = 'createPro.radio.customMonths';
 readonly createPro_radio_coterm = 'createPro.radio.coterm';
 readonly createPro_number_termDuration = 'createPro.number.termDuration';
 readonly createPro_figure_selectBuyingProgramEa3 = 'createPro.figure.selectBuyingProgramEa3';
 readonly createPro_figure_selectBuyingProgramSpna = 'createPro.figure.selectBuyingProgramSpna';
 readonly createPro_icon_countrySearch = 'createPro.icon.countrySearch';

 readonly createPro_page_createProposalPage = 'createPro.page.createProposalPage';
 readonly createPro_slider_termDuration = 'createPro.slider.termDuration';
 readonly createPro_button_capitalFinancing = 'createPro.button.capitalFinancing';
 readonly createPro_dropdown_selectCapitalFinance = 'createPro.dropdown.selectCapitalFinance';
 readonly createPro_input_selectOptedcff = 'createPro.input.selectOptedcff';
 readonly createPro_input_cffModal = 'createPro.input.cffModal';
 readonly createPro_text_datePicker_cotermEndDate = 'createPro.text.datePicker.cotermEndDate';
 readonly createPro_icon_calendar_cotermEndDate = 'createPro.icon.calendar.cotermEndDate';
 readonly createPro_button_lookUpSubscription = 'createPro.button.lookUpSubscription';
 
 readonly projectProposalList_button_goToProject = 'projectProposalList.button.goToProject';
 readonly projectProposalList_button_createProposal = 'projectProposalList.button.createProposal';

 readonly proposalDashboard_button_reopenProposal = 'proposalDashboard.button.reopenProposal';
 readonly proposalDashboard_button_backToPePage = 'proposalDashboard.button.backToPePage';
 readonly proposalDashboard_link_goToCopiedProposal = 'proposalDashboard.link.goToCopiedProposal';
 readonly proposalDashboard_link_actions_goToQuote ='proposalDashboard.link.actions.goToQuote';
 readonly proposalDashboard_link_actions_convertToQuote = 'proposalDashboard.link.actions.convertToQuote';
 readonly proposalDashboard_link_actions_initiateLegalPackage = 'proposalDashboard.link.actions.initiateLegalPackage';
 readonly proposalDashboard_link_actions_goToDocumentCenter = 'proposalDashboard.link.actions.goToDocumentCenter';
 readonly proposalDashboard_link_actions_copyProposal = 'proposalDashboard.link.actions.copyProposal';
 readonly proposalDashboard_link_actions_viewProposalList = 'proposalDashboard.link.actions.viewProposalList';

 readonly proposalDashboard_label_proposalDashboardPage = 'proposalDashboard.label.proposalDashboardPage';
 readonly proposalDashboard_msg_rsdQuoteNotExceeds90Days = 'proposalDashboard.msg.rsdQuoteNotExceeds90Days';
 readonly proposalDashboard_msg_programTermMsg = 'proposalDashboard.msg.programTermMsg';
 readonly proposalDashboard_msg_rsdQuoteNotExceeds30Days = 'proposalDashboard.msg.rsdQuoteNotExceeds30Days';
 readonly proposalDashboard_msg_renewalMigrationInfo = 'proposalDashboard.msg.renewalMigrationInfo';
 readonly proposalDashboard_msg_proposalQualifiesDnacAppliance = 'proposalDashboard.msg.proposalQualifiesDnacAppliance';
 readonly proposalDashboard_msg_locc_for_partner = 'proposalDashboard.msg.loccForPartner';
 readonly proposalDashboard_msg_proposalQualifiesDcnSolStarter = 'proposalDashboard.msg.proposalQualifiesDcnSolStarter';
 readonly proposalDashboard_msg_proposalCopySuccess = 'proposalDashboard.msg.proposalCopySuccess';
 readonly proposalDashboard_label_lifecycle = 'proposalDashboard.label.lifecycle';
 readonly proposalDashboard_data_lifecycleName = 'proposalDashboard.data.lifecycleName.';
 readonly proposalDashboard_data_lifecycleStatus = 'proposalDashboard.data.lifecycleStatus.';
 readonly proposalDashboard_label_allPricesShow = 'proposalDashboard.label.allPricesShow';
 readonly proposalDashboard_label_netSwValue = 'proposalDashboard.label.netSwValue';
 readonly proposalDashboard_data_netSwValue = 'proposalDashboard.data.netSwValue';
 readonly proposalDashboard_label_swOtd = 'proposalDashboard.label.swOtd';
 readonly proposalDashboard_data_swOtd = 'proposalDashboard.data.swOtd';
 readonly proposalDashboard_label_netSwPreOtd = 'proposalDashboard.label.netSwPreOtd';
 readonly proposalDashboard_label_netServiceValue = 'proposalDashboard.label.netServiceValue';
 readonly proposalDashboard_data_netServiceValue = 'proposalDashboard.data.netServiceValue';
 readonly proposalDashboard_label_servicesPreOtd = 'proposalDashboard.label.servicesPreOtd';
 readonly proposalDashboard_label_serviceOtd = 'proposalDashboard.label.serviceOtd';
 readonly proposalDashboard_data_serviceOtd = 'proposalDashboard.data.serviceOtd';
 readonly proposalDashboard_label_eaTotalValue = 'proposalDashboard.label.eaTotalValue';
 readonly proposalDashboard_data_eaTotalValue = 'proposalDashboard.data.eaTotalValue';
 readonly proposalDashboard_label_postOtd = 'proposalDashboard.label.postOtd';
 readonly proposalDashboard_label_totalOtd = 'proposalDashboard.label.totalOtd';
 readonly proposalDashboard_data_totalOtd = 'proposalDashboard.data.totalOtd';
 readonly proposalDashboard_label_suggestedActions = 'proposalDashboard.label.suggestedActions';
 readonly proposalDashboard_label_goToQuote = 'proposalDashboard.label.goToQuote';
 readonly proposalDashboard_label_goToFinalStep = 'proposalDashboard.label.goToFinalStep';
 readonly proposalDashboard_label_convertToQuote = 'proposalDashboard.label.convertToQuote';
 readonly proposalDashboard_label_convertToFinalStep = 'proposalDashboard.label.convertToFinalStep';
 readonly proposalDashboard_label_initiateLegalPackage = 'proposalDashboard.label.initiateLegalPackage';
 readonly proposalDashboard_label_completeLegalpackage = 'proposalDashboard.label.completeLegalpackage';
 readonly proposalDashboard_label_docCenter = 'proposalDashboard.label.docCenter';
 readonly proposalDashboard_label_generateIbReport = 'proposalDashboard.label.generateIbReport';
 readonly proposalDashboard_label_copyProposal = 'proposalDashboard.label.copyProposal';
 readonly proposalDashboard_label_diffRsd = 'proposalDashboard.label.diffRsd';
 readonly proposalDashboard_label_goToProposalList = 'proposalDashboard.label.goToProposalList';
 readonly proposalDashboard_label_otherProposalsAttached = 'proposalDashboard.label.otherProposalsAttached';
 readonly proposalDashboard_msg_exceptionInfoMsgForExceptionApproval = 'proposalDashboard.msg.exceptionInfoMsgForExceptionApproval';



 
 readonly proposalDashboard_page_proposalDashboardPage = 'proposalDashboard.page.proposalDashboardPage';
 readonly proposalDashboard_link_closeInfoMsg = 'proposalDashboard.link.closeInfoMsg';

 readonly reopeProposal_button_closeIcon = 'reopeProposal.button.closeIcon';
 readonly reopeProposal_checkbox_acceptReopen = 'reopeProposal.checkbox.acceptReopen';
 readonly reopeProposal_button_closeButton = 'reopeProposal.button.closeButton';
 readonly reopeProposal_button_reopen = 'reopeProposal.button.reopen';
 readonly reopeProposal_page_reopenProposalModal = 'reopeProposal.page.reopenProposalModal';

 readonly priceValidation_modal = 'priceValidation.modal';
 readonly priceValidation_button_closeIcon = 'priceValidation.button.closeIcon';
 readonly priceValidation_button_closeButton = 'priceValidation.button.closeButton';
 readonly priceValidation_button_reProcessIbButton = 'priceValidation.button.reProcessIbButton';

 readonly convertToQuote_button_closeIcon = 'convertToQuote.button.closeIcon';
 readonly convertToQuote_radio_selectedQuote = 'convertToQuote.radio.selectedQuote';
 readonly convertToQuote_button_openQuote = 'convertToQuote.button.openQuote';
 readonly convertToQuote_button_createNewQuote = 'convertToQuote.button.createNewQuote';
 readonly convertToQuote_link_createNewQuote = 'convertToQuote.link.createNewQuote';
 readonly convertToQuote_button_cancel = 'convertToQuote.button.cancel';
 readonly convertToQuote_button_updateQuote = 'convertToQuote.button.updateQuote';

 readonly proposalSummary_link_openOriginalProposal = 'proposalSummary.link.openOriginalProposal';
 readonly proposalSummary_button_backToPe = 'proposalSummary.button.backToPe';
 readonly proposalSummary_button_submit = 'proposalSummary.button.submit';
 readonly proposalSummary_button_submitForApproval = 'proposalSummary.button.submitForApproval';
 readonly proposalSummary_button_withdrawApproval = 'proposalSummary.button.withdrawApproval';
 readonly proposalSummary_enorllment_TcvPreOtd = 'proposalSummary.enorllment.TcvPreOtd.';
 readonly proposalSummary_enorllment_TcvPostOtd = 'proposalSummary.enorllment.TcvPostOtd.';
 readonly proposalSummary_enorllment_otd = 'proposalSummary.enorllment.otd.'
 readonly proposalSummary_enorllment_TcvPostOtdTotal = 'proposalSummary.enorllment.TcvPostOtdTotal';
 readonly proposalSummary_enorllment_TcvPretOtdTotal = 'proposalSummary.enorllment.TcvPreOtdTotal';
 readonly proposalSummary_enorllment_otdTotal = 'proposalSummary.enorllment.otdTotal';

 readonly proposalSummary_page_proposalSummaryPage = 'proposalSummary.page.proposalSummaryPage';

 readonly reviewAccept_button_closeIcon = 'reviewAccept.button.closeIcon';
 readonly reviewAccept_link_businessConduct = 'reviewAccept.link.businessConduct';
 readonly reviewAccept_checkbox_reviewAcceptProposal = 'reviewAccept.checkbox.reviewAcceptProposal';
 readonly reviewAccept_button_closeButton = 'reviewAccept.button.closeButton';
 readonly reviewAccept_button_accept = 'reviewAccept.button.accept';

 readonly submitForApproval_button_closeIcon = 'submitForApproval.button.closeIcon';
 readonly submitForApproval_button_exceptionReasons = 'submitForApproval.button.exceptionReasons.';
 readonly submitForApproval_button_selectExceptionReasons = 'submitForApproval.button.selectExceptionReasons.';
 readonly submitForApproval_button_selectedExceptionReasons = 'submitForApproval.button.selectedExceptionReasons.';
 readonly submitForApproval_dropdown_selectExceptionReason = 'submitForApproval.dropdown.selectExceptionReason';
 readonly submitForApproval_checkbox_checkSelectedReasons = 'submitForApproval.checkbox.checkSelectedReasons';
 readonly submitForApproval_link_browse = 'submitForApproval.link.browse';
 readonly submitForApproval_icon_removeFile = 'submitForApproval.icon.removeFile';
 readonly submitForApproval_file_uploadFile = 'submitForApproval.file.uploadFile';
 readonly submitForApproval_checkbox_enableSubmit = 'submitForApproval.checkbox.enableSubmit';
 readonly submitForApproval_link_businessConduct = 'submitForApproval.link.businessConduct';
 readonly submitForApproval_button_closebutton = 'submitForApproval.button.closebutton';
 readonly submitForApproval_button_submitApprovalReasons = 'submitForApproval.button.submitApprovalReasons';
 readonly submitForApproval_text_exceptionJustification = 'submitForApproval.text.exceptionJustification';
 readonly withdrawException_button_closeIcon = 'withdrawException.button.closeIcon';
 readonly withdrawException_button_confirm = 'withdrawException.button.confirm';
 readonly withdrawException_button_closeButton = 'withdrawException.button.closeButton';
 readonly submitForApproval_label_exception = 'submitForApproval.label.exception.';
 readonly submitForApproval_label_justification = 'submitForApproval.label.justification';

 readonly exception_link_statusOfRequestedExceptions = 'exception.link.statusOfRequestedExceptions';
 readonly exception_link_approvalHistory = 'exception.link.approvalHistory';
 readonly exception_button_becomeReviewer = 'exception.button.becomeReviewer';
 readonly exception_link_downloadPaDocument = 'exception.link.downloadPaDocument.';
 readonly exception_link_cycleTime = 'exception.link.cycleTime.';
 readonly exception_checkbox_selectException = 'exception.checkbox.selectException.';
 readonly exception_link_viewDetails = 'exception.link.viewDetails.';
 readonly exception_button_submit = 'exception.button.submit';
 readonly exception_link_downloadSubscriptionDocument = 'exception.link.downloadSubscriptionDocument.';
 readonly exception_link_backToPe = 'exception.link.backToPe.';
 readonly exception_button_selectedDecision = 'exception.button.selectedDecision.';
 readonly exception_button_selectedReason = 'exception.button.selectedReason';
 readonly exception_checkbox_reviewerJustification = 'exception.checkbox.reviewerJustification.';
 readonly exception_link_approvalHistory_downloadPaDocument = 'exception.link.approvalHistory.downloadPaDocument.';
 readonly exception_link_approvalHistory_viewDetails = 'exception.link.approvalHistory.viewDetails.';
 readonly exception_link_approvalHistory_cycleTime = 'exception.link.approvalHistory.cycleTime.';
 readonly exception_icon_approvalHistory_copy = 'exception.icon.approvalHistory.copy.';
 readonly exception_icon_copy = 'exception.icon.copy.';
 readonly exception_link_approvalHistory_assignCase = 'exception.link.approvalHistory.assignCase.';
 readonly exception_link_assignCase = 'exception.link.assignCase.';
 readonly exception_dropdown_selectReason = 'exception.dropdown.selectReason';
 readonly exception_dropdown_selectDecision = 'exception.dropdown.selectDecision.';
 readonly exception_label_exceptionName = 'exception.label.exceptionName.';
 readonly exception_link_teamName = 'exception.link.teamName.';

 readonly exceptionApprovalSuccess_button_closeIcon = 'exceptionApprovalSuccess.button.closeIcon';
 readonly exceptionApprovalSuccess_button_closeButton = 'exceptionApprovalSuccess.button.closeButton';

 readonly addCaseId_button_closeIcon = 'addCaseId.button.closeIcon';
 readonly addCaseId_text_caseIdNumber = 'addCaseId.text.caseIdNumber';
 readonly addCaseId_button_cancel = 'addCaseId.button.cancel';
 readonly addCaseId_button_update = 'addCaseId.button.update';

 readonly addReasonOtd_button_closeIcon = 'addReasonOtd.button.closeIcon';
 readonly addReasonOtd_text_reason = 'addReasonOtd.text.reason';
 readonly addReasonOtd_button_cancel = 'addReasonOtd.button.cancel';
 readonly addReasonOtd_button_update = 'addReasonOtd.button.update';

 readonly lookUpSubscription_button_closeIcon = 'lookUpSubscription.button.closeIcon';
 readonly lookUpSubscription_text_subscriptionId = 'lookUpSubscription.text.subscriptionId';
 readonly lookUpSubscription_button_lookUp = 'lookUpSubscription.button.lookUp';
 readonly lookUpSubscription_button_closeButton = 'lookUpSubscription.button.closeButton';
 readonly lookUpSubscription_button_continue = 'lookUpSubscription.button.continue';

 readonly subscriptionRenewalConf_button_closeIcon = 'subscriptionRenewalConf.button.closeIcon';;
 readonly subscriptionRenewalConf_button_closeButton = 'subscriptionRenewalConf.button.closeButton';
 readonly subscriptionRenewalConf_button_confirm = 'subscriptionRenewalConf.button.confirm';

 readonly roadmap_icon_vnextRoadMap  = 'roadmap.icon.vnextRoadMap.';

 readonly tcvBreakUp_button_closeIcon = 'tcvBreakUp.button.closeIcon';
 readonly tcvBreakUp_icon_expandPool = 'tcvBreakUp.icon.expandPool';
 readonly tcvBreakUp_icon_collapsePool = 'tcvBreakUp.icon.collapsePool';
 readonly tcvBreakUp_link_poolName = 'tcvBreakUp.link.poolName';
 readonly tcvBreakUp_icon_expandSuite= 'tcvBreakUp.icon.expandSuite';
 readonly tcvBreakUp_icon_collapseSuite = 'tcvBreakUp.icon.collapseSuite';
 readonly tcvBreakUp_link_suiteName = 'tcvBreakUp.link.suiteName';
 readonly tcvBreakUp_link_lineDesc = 'tcvBreakUp.link.lineDesc';
 readonly tcvBreakUp_link_pidDesc = 'tcvBreakUp.link.pidDesc';

 readonly pe_button_closeInfoMsg = 'pe.button.closeInfoMsg';
 readonly pe_dropdown_moreAction = 'pe.dropdown.moreAction';
 readonly pe_link_downlaod_pe = 'pe.link.downlaodPe';
 readonly pe_link_requestDoc = 'pe.link.requestDoc';
 readonly pe_link_proposalList = 'pe.link.proposalList';
 readonly pe_link_engageSupport = 'pe.link.engageSupport';
 readonly pe_link_manageTeam = 'pe.link.manageTeam';
 readonly pe_link_manageTeamDisabled = 'pe.link.manageTeamDisabled';
 readonly pe_button_viewEligibilityDetails = 'pe.button.viewEligibilityDetails';
 readonly pe_button_peContinue = 'pe.button.peContinue';
 readonly pe_button_peBackToOWB = 'pe.button.peBackToOWB';
 readonly pe_button_peContinueDisabled = 'pe.button.peContinueDisabled';
 readonly pe_link_openOriginalProposal = 'pe.link.openOriginalProposal';
 readonly pe_checkbox_toggleAllPortfolio = 'pe.checkbox.toggleAllPortfolio';
 readonly pe_link_addMoreSuitesDisabled = 'pe.link.addMoreSuitesDisabled';
 readonly pe_link_addMoreSuites = 'pe.link.addMoreSuites';
 readonly pe_link_applyDiscountDisabled = 'pe.link.applyDiscountDisabled';
 readonly pe_link_applyDiscount = 'pe.link.applyDiscount';
 readonly pe_link_openPurchaseAdjDisabled = 'pe.link.openPurchaseAdjDisabled';
 readonly pe_link_openPurchaseAdj = 'pe.link.openPurchaseAdj';
 readonly pe_link_openQnAFlyout = 'pe.link.openQnAFlyout';
 readonly pe_link_openQnAFlyoutdisabled = 'pe.link.openQnAFlyoutdisabled';
 readonly pe_link_openUpdatePurchaseA = 'pe.link.openUpdatePurchaseA';
 readonly pe_link_openEAMS = 'pe.link.openEAMS';
 readonly pe_button_addMoreSuites = 'pe.button.addMoreSuites';
 readonly pe_link_inItGrid = 'pe.link.inItGrid';
 readonly pe_button_reProcessIb = 'pe.button.reProcessIb';
 readonly pe_icon_otdArrow = 'pe.icon.otdArrow';
 readonly pe_icon_tcvArrow = 'pe.icon.tcvArrow';
 readonly pe_link_upgradeSuitesDisabled = 'pe.link.upgradeSuitesDisabled';
 readonly pe_link_upgradeSuites = 'pe.link.upgradeSuites';
 readonly pe_button_viewUpgradeSummary = 'pe.button.viewUpgradeSummary';
 readonly pe_button_viewMigrationUpgradeSummary = 'pe.button.viewMigrationUpgradeSummary';
 readonly pe_link_showUnavailbaleMigrateReasons = 'pe.link.showUnavailbaleMigrateReasons';
 readonly pe_link_upgradeMigrateSuitesDisabled = 'pe.link.upgradeMigrateSuitesDisabled';
 readonly pe_link_upgradeMigrateSuites = 'pe.link.upgradeMigrateSuites';
 readonly pe_button_tco = 'pe.button.tco';
 readonly pe_button_tco_disabled = 'pe.button.tco.disabled';

 readonly migrateEligibleReasons_button_closeIcon = 'migrateEligibleReasons.button.closeIcon';
 readonly migrateEligibleReasons_button_showMigrationTab = 'migrateEligibleReasons.button.showMigrationTab';
 readonly migrateEligibleReasons_icon_collapseExpandEnrollment = 'migrateEligibleReasons.icon.collapseExpandEnrollment.';


 readonly pe_page_pePage = 'pe.page.priceEstimationPage';
 readonly pe_label_programEligibility = 'pe.label.programEligibility';
 readonly pe_label_enrollmentEligibility = 'pe.label.enrollmentEligibility';
 readonly pe_label_eligible = 'pe.label.eligible';
 readonly pe_label_notEligible = 'pe.label.notEligible';
 readonly pe_link_strategicOffer = 'pe.link.strategicOffer';
 readonly pe_button_strategicOffer = 'pe.button.strategicOffer';
 readonly pe_label_strategicOffer = 'pe.label.strategicOffer';
 readonly pe_icon_breakUp = 'pe.icon.breakUp';
 readonly pe_link_closeInfoMsg = 'pe.link.closeInfoMsg';


 readonly upgradeSummaryModal_button_closeIcon = 'upgradeSummaryModal.button.closeIcon';
 readonly upgradeSummaryModal_label_title = 'upgradeSummaryModal.label.title';
 readonly upgradeSummaryModal_label_subHeader = 'upgradeSummaryModal.label.subHeader';
 readonly upgradeSummaryModal_message_alert = 'upgradeSummaryModal.message.alert';
 readonly upgradeSummaryModal_label_enrollmentName = 'upgradeSummaryModal.label.enrollmentName';
 readonly upgradeSummaryModal_label_upgradeType = 'upgradeSummaryModal.label.upgradeType';
 readonly upgradeSummaryModal_label_commitStatus = 'upgradeSummaryModal.label.commitStatus';
 readonly upgradeSummaryModal_label_existingTCV = 'upgradeSummaryModal.label.existingTCV';
 readonly upgradeSummaryModal_label_upgradeTCV = 'upgradeSummaryModa.label.upgradeTCV';
 readonly upgradeSummaryModal_label_netChange = 'upgradeSummaryModal.label.netChange';
 readonly upgradeSummaryModal_link_expandSummaryData = 'upgradeSummaryModal.link.expandSummaryData';
 readonly upgradeSummaryModal_icon_expand = 'upgradeSummaryModal.icon.expand';
 readonly upgradeSummaryModal_icon_close = 'upgradeSummaryModal.icon.close';
 readonly upgradeSummaryModal_label_collapseRowSuiteName = 'upgradeSummaryModal.label.collapseRowSuiteName.';
 readonly upgradeSummaryModal_data_enrollmentname = 'upgradeSummaryModal.data.enrollmentname.';
 readonly upgradeSummaryModal_data_upgradeType = 'upgradeSummaryModal.data.upgradeType.';
 readonly upgradeSummaryModal_data_commitStatus = 'upgradeSummaryModal.data.commitStatus.';
 readonly upgradeSummaryModal_data_existingTcv = 'upgradeSummaryModal.data.existingTcv.';
 readonly upgradeSummaryModal_data_upgradeTcv = 'upgradeSummaryModal.data.upgradeTcv.';
 readonly upgradeSummaryModal_data_netChange = 'upgradeSummaryModal.data.netChange.';
 readonly upgradeSummaryModal_button_close = 'upgradeSummaryModal.data.close';
 

 readonly eamsDelivery_button_closeIcon = 'eamsDelivery.button.closeIcon';
 readonly eamsDelivery_radio_ciscoEams = 'eamsDelivery.radio.ciscoEams';
 readonly eamsDelivery_radio_partnerEams = 'eamsDelivery.radio.partnerEams';
 readonly eamsDelivery_text_primaryPartner = 'eamsDelivery.text.primaryPartner';
 readonly eamsDelivery_text_partnerContactName = 'eamsDelivery.text.partnerContactName';
 readonly eamsDelivery_text_partnerCcoIde = 'eamsDelivery.text.partnerCcoIde';
 readonly eamsDelivery_text_partnerEmail = 'eamsDelivery.text.partnerEmail';
 readonly eamsDelivery_text_phoneNumber = 'eamsDelivery.text.phoneNumber';
 readonly eamsDelivery_button_cancel = 'eamsDelivery.button.cancel';
 readonly eamsDelivery_button_done = 'eamsDelivery.button.done';

 readonly unEnrollConfirmation_button_close = 'unEnrollConfirmation.button.close';
 readonly unEnrollConfirmation_button_accept = 'unEnrollConfirmation.button.accept';
 readonly unEnrollConfirmation_button_no = 'unEnrollConfirmation.button.no';

 readonly requestDocuments_button_closeIcon = 'requestDocuments.button.closeIcon';
 readonly requestDocuments_link_requestIb = 'requestDocuments.link.requestIb';


 readonly engageSupportTeam_button_closeIcon = 'engageSupportTeam.button.closeIcon';
 readonly engageSupportTeam_button_selectReason = 'engageSupportTeam.button.selectReason.';
 readonly engageSupportTeam_checkbox_selectExceptionsReason = 'engageSupportTeam.checkbox.selectExceptionsReason.';
 readonly engageSupportTeam_checkbox_checkSelectedReasons = 'engageSupportTeam.checkbox.checkSelectedReasons.';
 readonly engageSupportTeam_button_closeButton = 'engageSupportTeam.button.closeButton';
 readonly engageSupportTeam_button_done = 'engageSupportTeam.button.done';
 readonly engageSupportTeam_button_withdrawException= 'engageSupportTeam.button.withdrawException';
 readonly engageSupportTeam_button_edit = 'engageSupportTeam.button.edit';
 readonly engageSupportTeam_text_justification = 'engageSupportTeam.text.justification'

 readonly addSecurityServiceEnroll_button_closeIcon = 'addSecurityServiceEnroll.button.closeIcon';
 readonly addSecurityServiceEnroll_button_closeButton = 'addSecurityServiceEnroll.button.closeButton';
 readonly addSecurityServiceEnroll_button_addSecurity = 'addSecurityServiceEnroll.button.addSecurity';

 readonly futureConsumableItems_button_continue = 'futureConsumableItems.button.continue';
 readonly futureConsumableItems_button_cancel = 'futureConsumableItems.button.cancel';
 readonly futureConsumableItems_button_closeIcon = 'futureConsumableItems.button.closeIcon';
 readonly futureConsumableItems_icon_expandPool = 'futureConsumableItems.icon.expandPool';
 readonly futureConsumableItems_icon_collapsePool = 'futureConsumableItems.icon.collapsePool';
 readonly futureConsumableItems_button_toggleCisco = 'futureConsumableItems.button.toggleCisco';
 readonly futureConsumableItems_button_togglePartnerInfo = 'futureConsumableItems.button.togglePartnerInfo';
 readonly futureConsumableItems_button_togglePartner = 'futureConsumableItems.button.togglePartner';

 readonly eligibilityStatus_button_closeIcon = 'eligibilityStatus.button.closeIcon'

 readonly applyDiscount_button_closeIcon = 'applyDiscount.button.closeIcon';
 readonly applyDiscount_text_discountValue = 'applyDiscount.text.discountValue';
 readonly applyDiscount_button_cancel = 'applyDiscount.button.cancel';
 readonly applyDiscount_button_apply = 'applyDiscount.button.apply';

 readonly servicePurchaseAdjusmentBreakup_button_close = 'servicePurchaseAdjusmentBreakup.button.close';
 readonly servicePurchaseAdjusmentBreakup_icon_expandPool = 'servicePurchaseAdjusmentBreakup.icon.expandPool';
 readonly servicePurchaseAdjusmentBreakup_icon_collapsePool = 'servicePurchaseAdjusmentBreakup.icon.collapsePool';
 readonly servicePurchaseAdjusmentBreakup_icon_expandSuite = 'servicePurchaseAdjusmentBreakup.icon.expandSuite';
 readonly servicePurchaseAdjusmentBreakup_icon_collapseSuite = 'servicePurchaseAdjusmentBreakup.icon.collapseSuite';

 readonly updatePA_button_closeIcon = 'updatePA.button.closeIcon';
 readonly updatePA_link_selectPool = 'updatePA.link.selectPool';
 readonly updatePA_dropdown_changePool = 'updatePA.dropdown.changePool.';
 readonly updatePA_link_changePool = 'updatePA.link.changePool.';
 readonly updatePA_button_cancel = 'updatePA.button.cancel';
 readonly updatePA_button_applyAdjustment = 'updatePA.button.applyAdjustment';
 readonly updatePA_link_multiWarningMsg = 'updatePA.link.multiWarningMsg';
 readonly updatePA_icon_expandSuite = 'updatePA.icon.expandSuite.';
 readonly updatePA_icon_collapseSuite = 'updatePA.icon.collapseSuite.';
 readonly updatePA_icon_expandLine = 'updatePA.icon.expandLine.';
 readonly updatePA_icon_collapseLine = 'updatePA.icon.collapseLine.';
 readonly updatePA_link_reset = 'updatePA.link.reset.';
 readonly updatePA_icon_expandPid = 'updatePA.icon.expandPid.';
 readonly updatePA_icon_collapsePid = 'updatePA.icon.collapsePid.';
 readonly updatePA_link_downloadTemplate = 'updatePA.link.downloadTemplate';
 readonly updatePA_link_browse = 'updatePA.link.browse';
 readonly updatePA_icon_removeFile = 'updatePA.con.removeFile';
 readonly updatePA_file_uploadFile = 'updatePA.file.uploadFile';
 readonly updatePA_number_pidCreditPerpetual = 'updatePA.number.pidCreditPerpetual.';
 readonly updatePA_number_pidCreditSubscription = 'updatePA.number.pidCreditSubscription.';
 readonly updatePA_number_pidSwss = 'updatePA.number.pidSwss.';
 readonly updatePA_number_pidCreditCompetitive = 'updatePA.number.pidCreditCompetitive.';
 readonly updatePA_number_pidCreditOther = 'updatePA.number.pidCreditOther.';
 readonly updatePA_text_pidCreditReason = 'updatePA.text.pidCreditReason.';
 readonly updatePA_textarea_comment = 'updatePA.textarea.comment';
 readonly updatePA_icon_addReason = 'updatePA.icon.addReason';
 readonly updatePA_data_reason = 'updatePA.data.reason';


 readonly suitesCell_link_openDesriredQtyPopup = 'suitesCell.link.openDesriredQtyPopup.';
 readonly suitesCell_link_configureSuites = 'suitesCell.link.configureSuites.';
 readonly suitesCell_link_updateTier = 'suitesCell.link.updateTier';
 readonly suitesCell_link_selectedTierDesc = 'suitesCell.link.selectedTierDesc.';
 readonly suitesCell_link_configure = 'suitesCell.link.configure.';
 readonly suitesCell_link_errorMsgspopover = 'suitesCell.link.errorMsgspopover.';
 readonly suitesCell_link_warnMsgspopover = 'suitesCell.link.warnMsgspopover.';
 readonly suitesCell_link_changeSuiteDisc = 'suitesCell.link.changeSuiteDisc.';
 readonly suitesCell_icon_openDrop = 'suitesCell.icon.openDrop.';
 readonly suitesCell_icon_applyDisc = 'suitesCell.icon.applyDisc.';
 readonly suitesCell_button_search = 'suitesCell.button.search';
 readonly suitesCell_textarea_configReqData = 'suitesCell.textarea.configReqData';
 readonly suitesCell_icon_multiDiscount = 'suitesCell.icon.multiDiscount.';
 readonly suitesCell_icon_stoApplied = 'suitesCell.icon.stoApplied.';
 readonly suitesCell_icon_fullCommit = 'suitesCell.icon.fullCommit.';
 readonly suitesCell_icon_migrateFrom = 'suitesCell.icon.migrateFrom.';
 readonly suitesCell_icon_upgradedFrom = 'suitesCell.icon.upgradedFrom.';
 readonly suitesCell_icon_migrationType = 'suitesCell.icon.migrationType.';
 readonly suitesCell_icon_migrateTo = 'suitesCell.icon.migrateTo.';
 readonly suitesCell_link_availableForMigrationUpgrade = 'suitesCell.link.availableForMigrationUpgrade.';
 readonly suitesCell_link_availableForTierUpgrade = 'suitesCell.link.availableForTierUpgrade.';
 readonly suitesCell_link_availableForMigration = 'suitesCell.link.availableForMigration.';

 readonly servicesSuitesCell_link_ErrorMsgspopover =  'servicesSuitesCell.link.ErrorMsgspopover.';
 readonly servicesSuitesCell_link_warnMsgspopover = 'servicesSuitesCell.link.warnMsgspopover.';
 readonly servicesSuitesCell_link_updateCxTier = 'servicesSuitesCell.link.updateCxTier.';
 readonly servicesSuitesCell_link_configure = 'servicesSuitesCell.link.configure.';
 readonly servicesSuitesCell_link_cxSuiteDiscount = 'servicesSuitesCell.link.cxSuiteDiscount.';
 readonly servicesSuitesCell_icon_openDrop = 'servicesSuitesCell.icon.openDrop.';
 readonly servicesSuitesCell_textarea_configReqData = 'servicesSuitesCell.textarea.configReqData';
 readonly servicesSuitesCell_button_search = 'servicesSuitesCell.button.search';

 readonly qualityIbBreakUp_button_close = 'qualityIbBreakUp.button.close';
 readonly qualityIbBreakUp_icon_expandPool = 'qualityIbBreakUp.icon.expandPool';
 readonly qualityIbBreakUp_icon_collapsePool = 'qualityIbBreakUp.icon.collapsePool';
 readonly qualityIbBreakUp_icon_expandsuite = 'qualityIbBreakUp.icon.expandsuite';
 readonly qualityIbBreakUp_icon_collapsesuite = 'qualityIbBreakUp.icon.collapsesuite';

 readonly pruchaseAdjusmentBreakup_icon_poolDesc = 'pruchaseAdjusmentBreakup.icon.poolDesc';
 readonly pruchaseAdjusmentBreakup_icon_lineDesc = 'pruchaseAdjusmentBreakup.icon.lineDesc';
 readonly pruchaseAdjusmentBreakup_icon_pidDesc = 'pruchaseAdjusmentBreakup.icon.pidDesc';
 readonly pruchaseAdjusmentBreakup_button_close = 'pruchaseAdjusmentBreakup.button.close';
 readonly pruchaseAdjusmentBreakup_icon_expandPool = 'pruchaseAdjusmentBreakup.icon.expandPool';
 readonly pruchaseAdjusmentBreakup_icon_collapsePool = 'pruchaseAdjusmentBreakup.icon.collapsePool';
 readonly pruchaseAdjusmentBreakup_icon_expandSuite = 'pruchaseAdjusmentBreakup.icon.expandSuite';
 readonly pruchaseAdjusmentBreakup_icon_collapseSuite = 'pruchaseAdjusmentBreakup.icon.collapseSuite';

 readonly managePa_button_close = 'managePa.button.close';
 readonly managePa_button_done = 'managePa.button.done';
 readonly managePa_button_selectSuiteName = 'managePa.button.selectSuiteName';
 readonly managePa_dropdown_perpareCreditCategory = 'managePa.dropdown.perpareCreditCategory.';
 readonly managePa_button_selectedCreditCategory = 'managePa.button.selectedCreditCategory.';
 readonly managePa_dropdown_creditCategorySelected = 'managePa.dropdown.creditCategorySelected.';
 readonly managePa_link_paSmartSheet = 'managePa.link.paSmartSheet';
 readonly managePa_button_selectedDuration = 'managePa.button.selectedDuration';
 readonly managePa_text_contractNumbers = 'managePa.text.contractNumbers';
 readonly managePa_button_addCredit = 'managePa.button.addCredit';
 readonly managePa_button_apply = 'managePa.button.apply.';
 readonly managePa_icon_rampDiscount = 'managePa.icon.rampDiscount.';
 readonly managePa_dropdown_deleteCredit = 'managePa.dropdown.deleteCredit.';
 readonly managePa_dropdown_selectDuration = 'managePa.dropdown.selectDuration';

 readonly manageCollabPa_button_close = 'manageCollabPa.button.close';
 readonly manageCollabPa_button_done = 'manageCollabPa.button.done';
 readonly manageCollabPa_button_selectedSuite = 'manageCollabPa.button.selectedSuite';
 readonly manageCollabPa_dropdown_perpareCreditCategory = 'manageCollabPa.dropdown.perpareCreditCategory.';
 readonly manageCollabPa_button_selectedCreditCategory = 'manageCollabPa.button.selectedCreditCategory.';
 readonly manageCollabPa_dropdown_creditCategorySelected = 'manageCollabPa.dropdown.creditCategorySelected.';
 readonly manageCollabPa_text_contractNumbers = 'manageCollabPa.text.contractNumbers';
 readonly manageCollabPa_button_selectedDuration = 'manageCollabPa.button.selectedDuration';
 readonly manageCollabPa_dropdown_selectDuration = 'manageCollabPa.dropdown.selectDuration.';
 readonly manageCollabPa_button_addCredit = 'manageCollabPa.button.addCredit';
 readonly manageCollabPa_icon_deleteCredit = 'manageCollabPa.icon.deleteCredit';
 readonly manageCollabPa_text_duration = 'manageCollabPa.text.duration';
 readonly manageCollabPa_text_qty = 'manageCollabPa.text.qty';

 readonly enrollment_action_displayEnrollment = 'enrollment.action.displayEnrollment.';
 readonly enrollment_button_purchased = 'enrollment.button.purchased.';
 readonly enrollment_button_added = 'enrollment.button.added.';
 readonly enrollment_button_add = 'enrollment.button.add.';
 readonly enrollment_coming_soon = 'enrollment.button.comingSoon.';
 readonly enrollment_button_alreadyPurchased = 'enrollment.button.alreadyPurchased.';
 readonly enrollment_link_goToDocCenter = 'enrollment.link.goToDocCenter.';
 readonly enrollment_link_editEnrollment = 'enrollment.link.editEnrollment.';
 readonly enrollment_link_showDetails = 'enrollment.link.showDetails.';
 readonly enrollment_icon_full = 'enrollment.icon.full.';
 readonly enrollment_icon_partial = 'enrollment.icon.partial.'

 readonly benefitsWizard_button_close = 'benefitsWizard.button.close'

 readonly servicesGrid_link_sysytematicIbPull = 'servicesGrid.link.sysytematicIbPull';
 readonly servicesGrid_link_goToTroubleShooting = 'servicesGrid.link.goToTroubleShooting';
 readonly servicesGrid_button_closeIbPullMsg = 'servicesGrid.button.closeIbPullMsg';
 readonly servicesGrid_button_reProcessIbPullMsg = 'servicesGrid.button.reProcessIbPullMsg';
 readonly servicesGrid_link_reProcessIb = 'servicesGrid.link.reProcessIb';
 readonly servicesGrid_link_cascadeDiscount = 'servicesGrid.link.cascadeDiscount';
 readonly servicesGrid_link_viewAndEditHardwareSupport = 'servicesGrid.link.viewAndEditHardwareSupport';
 readonly servicesGrid_link_hardwareSupportDetails = 'servicesGrid.link.hardwareSupportDetails';
 readonly servicesGrid_button_confirm = 'servicesGrid.button.confirm';
 readonly servicesGrid_link_applyCascadeDiscount = 'servicesGrid.link.applyCascadeDiscount';
 readonly servicesGrid_link_headerClick = 'servicesGrid.link.headerClick';
 readonly servicesGrid_icon_qualityIbArrow = 'servicesGrid.icon.qualityIbArrow';
 readonly servicesGrid_icon_otdArrow = 'servicesGrid.icon.otdArrow';
 readonly servicesGrid_link_updateRprocessIb = 'servicesGrid.link.updateRprocessIb'
 readonly servicesGrid_link_updateIb = 'servicesGrid.link.updateIb'
 readonly servicesGrid_button_reprocessIb = 'servicesGrid.button.reprocessIb'
 readonly servicesGrid_button_reprocessIb_disabled = 'servicesGrid.button.reprocessIb.disabled'
 readonly servicesGrid_button_initiateIb_disabled = 'servicesGrid.button.initiateIb.disabled'
 readonly servicesGrid_button_initiateIb = 'servicesGrid.button.initiateIb'
 readonly servicesGrid_link_viewAndEditHardwareSupport_disabled = 'servicesGrid.link.viewAndEditHardwareSupport.disabled';
 readonly servicesGrid_link_reProcessIb_disabled = 'servicesGrid.link.reProcessIb.disabled';

 readonly adjustDesiredQty_link_selectedSuite = 'adjustDesiredQty.link.selectedSuite.';
 readonly adjustDesiredQty_link_changeSuite = 'adjustDesiredQty.link.changeSuite.';
 readonly adjustDesiredQty_button_close = 'adjustDesiredQty.button.close';
 readonly adjustDesiredQty_link_requestOverride = 'adjustDesiredQty.link.requestOverride.';
 readonly adjustDesiredQty_link_modifyOverrideRequest = 'adjustDesiredQty.link.modifyOverrideRequest.';
 readonly adjustDesiredQty_button_closeOverRidepopover = 'adjustDesiredQty.button.closeOverRidepopover';
 readonly adjustDesiredQty_button_selectedCommitReason = 'adjustDesiredQty.button.selectedCommitReason';
 readonly adjustDesiredQty_dropdown_selectReason = 'adjustDesiredQty.dropdown.selectReason';
 readonly adjustDesiredQty_link_withdrawRequestOverride = 'adjustDesiredQty.link.withdrawRequestOverride.';
 readonly adjustDesiredQty_button_cancelOverRidePopover = 'adjustDesiredQty.button.cancelOverRidePopover';
 readonly adjustDesiredQty_button_doneOverRidePopover = 'adjustDesiredQty.button.doneOverRidePopover';
 readonly adjustDesiredQty_button_cancel = 'adjustDesiredQty.button.cancel';
 readonly adjustDesiredQty_button_recalculate = 'adjustDesiredQty.button.recalculate';
 readonly adjustDesiredQty_button_done = 'adjustDesiredQty.button.done';
 readonly adjustDesiredQty_link_viewCommitRules = 'adjustDesiredQty.link.viewCommitRules';
 readonly adjustDesiredQty_icon_expandQty = 'adjustDesiredQty.icon.expandQty';
 readonly adjustDesiredQty_icon_collapseQty = 'adjustDesiredQty.icon.collapseQty';
 readonly adjustDesiredQty_link_essentialErrorPopOver = 'adjustDesiredQty.link.essentialErrorPopOver.';
 readonly adjustDesiredQty_number_qtyUpdateEssential = 'adjustDesiredQty.number.qtyUpdate.essential.';
 readonly adjustDesiredQty_link_advantageErrorPopOver = 'adjustDesiredQty.link.advantageErrorPopOver.';
 readonly adjustDesiredQty_number_qtyUpdateAdvantage = 'adjustDesiredQty.number.qtyUpdate.advantage.';
 readonly adjustDesiredQty_link_premiumErrorPopOver = 'adjustDesiredQty.link.premiumErrorPopOver.';
 readonly adjustDesiredQty_number_qtyUpdatePremium = 'adjustDesiredQty.number.qtyUpdate.premium.';
 readonly adjustDesiredQty_link_enterpriseErrorPopOver = 'adjustDesiredQty.link.enterpriseErrorPopOver.';
 readonly adjustDesiredQty_number_qtyUpdateEnterprise = 'adjustDesiredQty.number.qtyUpdate.enterprise.';
 readonly adjustDesiredQty_link_premierErrorPopOver = 'adjustDesiredQty.link.premierErrorPopOver.';
 readonly adjustDesiredQty_number_qtyUpdatePremier = 'adjustDesiredQty.number.qtyUpdate.premier.';
 readonly adjustDesiredQty_link_d2OpsErrorPopOver = 'adjustDesiredQty.link.d2OpsErrorPopOver.';
 readonly adjustDesiredQty_number_qtyUpdateD2Ops = 'adjustDesiredQty.number.qtyUpdate.d2Ops.';
 readonly adjustDesiredQty_link_proErrorPopOver = 'adjustDesiredQty.link.proErrorPopOver.';
 readonly adjustDesiredQty_number_qtyUpdatePro = 'adjustDesiredQty.number.qtyUpdate.pro.';
 readonly adjustDesiredQty_link_advancedErrorPopOver = 'adjustDesiredQty.link.advancedErrorPopOver.';
 readonly adjustDesiredQty_number_qtyUpdateAdvanced = 'adjustDesiredQty.number.qtyUpdate.advanced.';
 readonly adjustDesiredQty_link_peakErrorPopOver = 'adjustDesiredQty.link.peakErrorPopOver.';
 readonly adjustDesiredQty_number_qtyUpdatePeak = 'adjustDesiredQty.number.qtyUpdate.peak.';
 readonly adjustDesiredQty_number_qtyUpdateAddOn = 'adjustDesiredQty.number.qtyUpdate.addOn.';
 readonly adjustDesiredQty_link_addOnErrorPopOver = 'adjustDesiredQty.link.addOnErrorPopOver.';
 readonly adjustDesiredQty_link_generalErrorPopOver = 'adjustDesiredQty.link.generalErrorPopOver.';
 readonly adjustDesiredQty_number_qtyUpdateGeneral = 'adjustDesiredQty.number.qtyUpdate.general.';
 readonly adjustDesiredQty_link_selectSupportPid = 'adjustDesiredQty.link.selectSupportPid.';
 readonly adjustDesiredQty_link_desiredQtyErrorPopOver = 'adjustDesiredQty.link.desiredQtyErrorPopOver.';
 readonly adjustDesiredQty_number_desiredQtyUpdate = 'adjustDesiredQty.number.desiredQtyUpdate.';
 readonly adjustDesiredQty_label_adjDesiredQtyPop = 'adjustDesiredQty.label.adjDesiredQtyPop';
 readonly adjustDesiredQty_number_qtyUpdateRoutingHybridWorker = 'adjustDesiredQty.number.qtyUpdateRoutingHybridWorker.';
 readonly adjustDesiredQty_number_qtyUpdateRoutingHybridWorkerErrorPopOver = 'adjustDesiredQty.number.qtyUpdateRoutingHybridWorkerErrorPopOver.';
 readonly adjustDesiredQty_link_controllerErrorPopOver = 'adjustDesiredQty.link.controllerErrorPopOver.';
 readonly adjustDesiredQty_number_qtyUpdateController = 'adjustDesiredQty.number.qtyUpdateController.';
 readonly adjustDesiredQty_link_errorPopOver = 'adjustDesiredQty.link.errorPopOver.';
 readonly adjustDesiredQty_number_qtyUpdate = 'adjustDesiredQty.number.qtyUpdate.';
 readonly adjustDesiredQty_link_closeSplunkPurchaseInfoMsg = 'adjustDesiredQty.link.closeSplunkPurchaseInfoMsg';
 readonly adjustDesiredQty_link_closeSplunkEnageSupportInfoMsg = 'adjustDesiredQty.link.closeSplunkEnageSupportInfoMsg';
 readonly adjustDesiredQty_link_closeSplunkPAInfoMsg = 'adjustDesiredQty.link.closeSplunkPAInfoMsg';

 readonly editEnrollment_button_close = 'editEnrollment.button.close';
 readonly editEnrollment_button_cancel = 'editEnrollment.button.cancel';
 readonly editEnrollment_button_update = 'editEnrollment.button.update';
 readonly editEnrollment_link_userClickDateSelection = 'editEnrollment.link.userClickDateSelection';
 readonly editEnrollment_text_datePicker = 'editEnrollment.text.datePicker';
 readonly editEnrollment_icon_datePickerCalendar = 'editEnrollment.icon.datePickerCalendar';
 readonly editEnrollment_radio_billingModel = 'editEnrollment.radio.billingModel';
 readonly editEnrollment_radio_months36  = 'editEnrollment.radio.months36';
 readonly editEnrollment_radio_months60 = 'editEnrollment.radio.months60';
 readonly editEnrollment_radio_customMonths = 'editEnrollment.radio.customMonths';
 readonly editEnrollment_number_duration = 'editEnrollment.number.duration';
 readonly editEnrollment_button_selectCffModal = 'editEnrollment.button.selectCffModal';
 readonly editEnrollment_icon_cffModalDrop = 'editEnrollment.icon.cffModalDrop';
 readonly editEnrollment_dropdown_cffModal = 'editEnrollment.dropdown.cffModal';
 readonly editEnrollment_dropdown_cffSelectOption = 'editEnrollment.dropdown.cffSelectOption';
 readonly editEnrollment_input_cffModal = 'editEnrollment.input.cffModal';
 readonly editEnrollment_input_cffSelectOption = 'editEnrollment.input.cffSelectOption';
 readonly editEnrollment_text_datePicker_cotermEndDate = 'editEnrollment.text.datePicker.cotermEndDate';
 readonly editEnrollment_icon_datePickerCalendar_cotermEndDate = 'editEnrollment.icon.datePickerCalendar.cotermEndDate';

 readonly editPropParam_button_close = 'editPropParam.button.close';
 readonly editPropParam_button_cancel = 'editPropParam.button.cancel';
 readonly editPropParam_button_update = 'editPropParam.button.update';
 readonly editPropParam_link_nav_showProposalParam = 'editPropParam.link.nav.showProposalParam';
 readonly editPropParam_link_propBasicInfo = 'editPropParam.link.propBasicInfo';
 readonly editPropParam_link_nav_showPartnerInfo = 'editPropParam.link.nav.showPartnerInfo';
 readonly editPropParam_link_partnerInfo = 'editPropParam.link.partnerInfo';
 readonly editPropParam_text_proposalName = 'editPropParam.text.proposalName';
 readonly editPropParam_text_country = 'editPropParam.text.country';
 readonly editPropParam_icon_countryDrop = 'editPropParam.icon.countryDrop';
 readonly editPropParam_dropdown_country = 'editPropParam.dropdown.country';
 readonly editPropParam_button_selectPriceList = 'editPropParam.button.selectPriceList';
 readonly editPropParam_icon_priceListDrop = 'editPropParam.icon.priceListDrop';
 readonly editPropParam_dropdown_priceList = 'editPropParam.dropdown.priceList';
 readonly editPropParam_button_selectBillingModal = 'editPropParam.button.selectBillingModal';
 readonly editPropParam_icon_billingModalDrop = 'editPropParam.icon.billingModalDrop';
 readonly editPropParam_dropdown_billingModal = 'editPropParam.dropdown.billingModal';
 readonly editPropParam_link_userDateSelection = 'editPropParam.link.userDateSelection';
 readonly editPropParam_text_datePicker = 'editPropParam.text.datePicker';
 readonly editPropParam_icon_calendar = 'editPropParam.icon.calendar';
 readonly editPropParam_radio_months36= 'editPropParam.radio.months36';
 readonly editPropParam_radio_months60 = 'editPropParam.radio.months60';
 readonly editPropParam_radio_customMonths = 'editPropParam.radio.customMonths';
 readonly editPropParam_radio_coterm = 'editPropParam.radio.coterm';
 readonly editPropParam_text_duration = 'editPropParam.text.duration';
 readonly editPropParam_button_selectPartner = 'editPropParam.button.selectPartner';
 readonly editPropParam_dropdown_partnerList = 'editPropParam.dropdown.partnerList';
 readonly editPropParam_text_distiName = 'editPropParam.text.distiName';
 readonly editPropParam_textarea_text_renewalDetails = 'editPropParam.textarea.text.renewalDetails';

 readonly editPropParam_dropdown_closecff = 'editPropParam.dropdown.closecff';
 readonly editPropParam_label_titlecff = 'editPropParam.label.titlecff';
 readonly editPropParam_label_tooltipcff = 'editPropParam.label.tooltipcff';
 readonly editPropParam_button_selectCapitalFrequency = 'editPropParam.button.selectCapitalFrequency';
 readonly editPropParam_dropdown_showcff = 'editPropParam.dropdown.showcff';
 readonly editPropParam_dropdown_selectOptedcff = 'editPropParam.dropdown.selectOptedcff';
 readonly editPropParam_dropdown_frequencyOptioncff = 'editPropParam.dropdown.frequencyOptioncff.';
 readonly editPropParam_input_selectOptedcff = 'editPropParam.input.selectOptedcff';
 readonly editPropParam_input_frequencyOptioncff = 'editPropParam.input.frequencyOptioncff.';
 readonly editPropParam_text_datePicker_cotermEndDate = 'editPropParam.text.datePicker.cotermEndDate';
 readonly editPropParam_icon_calendar_cotermEndDate = 'editPropParam.icon.calendar.cotermEndDate';
 readonly editPropParam_button_lookUpSubscription = 'editPropParam.button.lookUpSubscription';

 readonly addSuites_link_eaProgramGuide = 'addSuites.link.eaProgramGuide';
 readonly addSuites_button_close = 'addSuites.button.close';
 readonly addSuites_button_cancel = 'addSuites.button.cancel';
 readonly addSuites_button_back = 'addSuites.button.back';
 readonly addSuites_button_next = 'addSuites.button.next';
 readonly addSuites_button_continue = 'addSuites.bu.tton.continue';
 readonly addSuites_link_backToQna = 'addSuites.link.backToQna';
 readonly addSuites_link_backToSuites = 'addSuites.link.backToSuites';

 readonly addSuites_button_learnMore = 'addSuites.buton.learnMore';
 readonly addSuites_icon_suitePurchasesInfo = 'addSuites.icon.suitePurchasesInfo';
 readonly addSuites_link_goToDocCenter = 'addSuites.link.goToDocCenter.';
 readonly addSuites_link_selectedTierPopover = 'addSuites.link.selectedTierPopover.';
 readonly addSuites_dropdown_suiteAtoSelection = 'addSuites.dropdown.suiteAtoSelection.';
 readonly addSuites_link_tiersObj = 'addSuites.link.tiersObj.';
 readonly addSuites_link_goToDocCenterMsg = 'addSuites.link.goToDocCenterMsg';
 readonly addSuites_checkbox_suiteInclusion = 'addSuites.checkbox.suiteInclusion.';
 readonly addSuites_checkbox_showCxInfo = 'addSuites.checkbox.showCxInfo';
 readonly addSuites_link_userClickDateSelection = 'addSuites.link.userClickDateSelection';
 readonly addSuites_text_datePicker = 'addSuites.text.datePicker';
 readonly addSuites_icon_calendar = 'addSuites.icon.calendar';
 readonly addSuites_text_searchBillToId = 'addSuites.text.searchBillToId';
 readonly addSuites_icon_showBillToData = 'addSuites.icon.showBillToData';
 readonly addSuites_dropdown_billToId = 'addSuites.dropdown.billToId';
 readonly addSuites_link_removeBillToId = 'addSuites.link.removeBillToId';
 readonly addSuites_link_showMoreDetails = 'addSuites.link.showMoreDetails';
 readonly addSuites_link_hideMoreDetails = 'addSuites.link.hideMoreDetails';
 readonly addSuites_text_searchDistiBillTo = 'addSuites.text.searchDistiBillTo';
 readonly addSuites_icon_getDistiBillTo = 'addSuites.icon.getDistiBillTo';
 readonly addSuites_dropdown_selectDistiBill = 'addSuites.dropdown.selectDistiBill';
 readonly addSuites_link_removeDistiBillToId = 'addSuites.link.removeDistiBillToId';
 readonly addSuites_link_showMoreDetailsDisti = 'addSuites.link.showMoreDetailsDisti';
 readonly addSuites_link_hideMoreDetailsDisti = 'addSuites.link.hideMoreDetailsDisti';
 readonly addSuites_text_searchResellerBillTo = 'addSuites.text.searchResellerBillTo';
 readonly addSuites_icon_getResellerBillTo = 'addSuites.icon.getResellerBillTo';
 readonly addSuites_dropdown_selectResellerBill = 'addSuites.dropdown.selectResellerBill';
 readonly addSuites_link_removeResellerDisti = 'addSuites.link.removeResellerDisti';
 readonly addSuites_link_showMoreDetailsResellerDisti = 'addSuites.link.showMoreDetailsResellerDisti';
 readonly addSuites_link_hideMoreDetailsResellerDisti = 'addSuites.link.hideMoreDetailsResellerDisti';
 readonly addSuites_link_selectEamsDeliveryCisco = 'addSuites.link.selectEamsDeliveryCisco';
 readonly addSuites_radio_selectCiscoEams = 'addSuites.radio.selectCiscoEams';
 readonly addSuites_link_selectEamsDeliveryPartner = 'addSuites.link.selectEamsDeliveryPartner';
 readonly addSuites_radio_selectPartnerEams = 'addSuites.radio.selectPartnerEams';
 readonly addSuites_text_primarypartner = 'addSuites.text.primarypartner';
 readonly addSuites_text_partnerContactName = 'addSuites.textp.artnerContactName';
 readonly addSuites_text_partnerCcoId = 'addSuites.text.partnerCcoId';
 readonly addSuites_text_partnerEmail = 'addSuites.text.partnerEmail';
 readonly addSuites_checkbox_optionalcxHwSelected = 'addSuites.checkboxo.ptionalcxHwSelected.';
 readonly addSuites_link_cxTierPopover = 'addSuites.link.cxTierPopover.';
 readonly addSuites_dropdown_changeCxTierSelection = 'addSuites.dropdown.changeCxTierSelection.';
 readonly addSuites_link_cxTierObj = 'addSuites.link.cxTierObj.';
 readonly addSuites_number_attachRate = 'addSuites.number.attachRate.';
 readonly addSuites_checkbox_updateCxInclusion = 'addSuites.checkbox.updateCxInclusion.';
 readonly addSuites_checkbox_optAll = 'addSuites.checkbox.optAll';
 readonly addSuites_slider_optAll = 'addSuites.slider.optAll';
 readonly addSuites_slider_suiteInclusion = 'addSuites.slider.suiteInclusion.';
 readonly addSuites_slider_showCxInfo = 'addSuites.slider.showCxInfo';
 readonly addSuites_slider_optionalcxHwSelected = 'addSuites.slider.optionalcxHwSelected.';
 readonly addSuites_slider_updateCxInclusion = 'addSuites.slider.updateCxInclusion.';
 readonly addSuite_link_closeInfoMsg = 'addSuite.link.closeInfoMsg';

 readonly servicesDiscount_button_close = 'servicesDiscount.button.close';
 readonly servicesDiscount_button_cancel = 'servicesDiscount.button.cancel';
 readonly servicesDiscount_button_apply = 'servicesDiscount.button.apply';
 readonly servicesDiscount_icon_expand = 'servicesDiscount.icon.expand';
 readonly servicesDiscount_icon_collapse = 'servicesDiscount.icon.collapse';
 readonly servicesDiscount_text_SuiteDiscountValue = 'servicesDiscount.text.suiteDiscountValue';
 readonly servicesDiscount_text_minorRowDiscountValue = 'servicesDiscount.text.minorRowDiscountValue';

 readonly qna_icon_closeUserCountMsg = 'qna.icon.closeUserCountMsg';
 readonly qna_link_tab_selectCommitmentTiers = 'qna.link.tab.selectCommitmentTiers';
 readonly qna_link_tab_selectAccessTier = 'qna.link.tab.selectAccessTier';
 readonly qna_number_scuCountValue = 'qna.number.scuCountValue.';
 readonly qna_icon_exceptinMsgClose = 'qna.icon.exceptinMsgClose';
 readonly qna_button_select = 'qna.button.select.';
 readonly qna_button_selected = 'qna.button.selected.';
 readonly qna_button_request = 'qna.button.request.';
 readonly qna_button_requested = 'qna.button.requested.';
 readonly qna_radio_notSelectedAnswer = 'qna.radio.notSelectedAnswer.';
 readonly qna_radio_selectedAnswer = 'qna.radio.selectedAnswer.';
 readonly qna_icon_getTierDetails = 'qna.icon.getTierDetails';
 readonly qna_number_studentCount = 'qna.number.studentCount.';
 readonly qna_number_hybridUserCount = 'qna.number.hybridUserCount';
 readonly qna_number = 'qna.number.';
 readonly qna_radio = 'qna.radio.'

 readonly changeDealCompletion_button_close = 'changeDealCompletion.button.close';
 readonly changeDealCompletion_button_done = 'changeDealCompletion.button.done';

 readonly deleteSmartAccConfirm_button_cancel = 'deleteSmartAccConfirm.button.cancel';
 readonly deleteSmartAccConfirm_button_close = 'deleteSmartAccConfirm.button.close';
 readonly deleteSmartAccConfirm_button_removeSA = 'deleteSmartAccConfirm.button.removeSA';

 readonly delinkConfirm_button_close = 'delinkConfirm.button.close';
 readonly delinkConfirm_button_cancel = 'delinkConfirm.button.cancel';
 readonly delinkConfirm_button_ok = 'delinkConfirm.button.ok';

 readonly docuSignInititateWarning_button_close = 'docuSignInititateWarning.button.close';
 readonly docuSignInititateWarning_button_cancel = 'docuSignInititateWarning.button.cancel';
 readonly docuSignInititateWarning_button_confirm = 'docuSignInititateWarning.button.confirm';

 readonly viewAuth_button_closeIcon = 'viewAuth.button.closeIcon';
 readonly viewAuth_link_expandAuthData = 'viewAuth.link.expandAuthData';
 readonly viewAuth_icon_expand = 'viewAuth.icon.expand';
 readonly viewAuth_icon_collapse = 'viewAuth.icon.collapse';
 readonly viewAuth_link_expandTempAuthData = 'viewAuth.link.expandTempAuthData';
 readonly viewAuth_icon_expandTempAuth = 'viewAuth.icon.expandTempAuth';
 readonly viewAuth_icon_collapseTempAuth = 'viewAuth.icon.collapseTempAuth';
 readonly viewAuth_link_clickHere = 'viewAuth.link.clickHere';
 readonly viewAuth_button_close = 'viewAuth.button.close';

 readonly uploadDoc_button_close = 'uploadDoc.button.close';
 readonly uploadDoc_button_cancel = 'uploadDoc.button.cancel';
 readonly uploadDoc_button_confirm = 'uploadDoc.button.confirm';
 readonly uploadDoc_text_programTermsSignedDate = 'uploadDoc.text.programTermsSignedDate';
 readonly uploadDoc_text_loaSignedDate = 'uploadDoc.text.loaSignedDate';
 readonly uploadDoc_text_multiPartnerSignedDate = 'uploadDoc.tex.multiPartnerSignedDate';
 readonly uploadDoc_checkbox_authorize = 'uploadDoc.checkbox.authorize';

 readonly servicesCascaseDiscConfirm_button_close  = 'servicesCascaseDiscConfirm.button.close';
 readonly servicesCascaseDiscConfirm_button_ok = 'servicesCascaseDiscConfirm.button.ok';

 readonly lookUpDeal_text_dealId = 'lookUpDeal.text.dealId';
 readonly lookUpDeal_button_lookUp = 'lookUpDeal.button.lookUp';

 readonly editCustomeRep_button_close = 'editCustomeRep.button.close';
 readonly editCustomeRep_button_cancel = 'editCustomeRep.button.cancel';
 readonly editCustomeRep_button_confirm = 'editCustomeRep.button.cofirm';
 readonly editCustomeRep_text_custRepName = 'editCustomeRep.text.custRepName';
 readonly editCustomeRep_text_custRepTitle = 'editCustomeRep.text.custRepTitle';
 readonly editCustomeRep_text_custRepEmailId = 'editCustomeRep.text.custRepEmailId';

 readonly editPreferredLegal_button_close = 'editPreferredLegal.button.close';
 readonly editPreferredLegal_button_cancel = 'editPreferredLegal.button.cancel';
 readonly editPreferredLegal_button_confirm = 'editPreferredLegal.button.confirm';
 readonly editCustomeRep_text_custPreferredName = 'editCustomeRep.text.custPreferredName';


 readonly ea_link_termsConditions = 'ea.link.termsConditions';
 readonly ea_link_privacyStatement = 'ea.link.privacyStatement';
 readonly ea_link_cookiePloicy = 'ea.link.cookiePloicy';
 readonly ea_link_trademarks = 'ea.link.trademarks';

 readonly masterAgreement_radio_yes = 'masterAgreement.radio.yes';
 readonly masterAgreement_radio_no = 'masterAgreement.radio.no';
 readonly masterAgreement_contractNumber = 'masterAgreement.text.contractNumber';
 readonly strategicOffers_button_close = 'strategicOffers.button.close';
 readonly strategicOffers_checkbox_offerSelected = 'strategicOffers.checkBox.offer.';
 readonly strategicOffers_button_cancel = 'strategicOffers.button.cancel ';
 readonly strategicOffers_button_apply = 'strategicOffers.button.apply';
 readonly strategicOffers_roadmap_steps = 'strategicOffers.roadmap.steps.';
 readonly strategicOffers_checkbox_optAll = 'strategicOffers.checkbox.optAll'
 readonly strategicOffers_slider_optAll = 'strategicOffers.slider.optAll';
 readonly strategicOffers_link_selectedTierPopover = 'strategicOffers.link.selectedTierPopover.';
 readonly strategicOffers_dropdown_suiteAtoSelection = 'strategicOffers.dropdown.suiteAtoSelection.';
 readonly strategicOffers_link_tiersObj = 'strategicOffers.link.tiersObj.';
 readonly strategicOffers_checkbox_suiteInclusion = 'strategicOffers.checkbox.suiteInclusion.';
 readonly strategicOffers_slider_suiteInclusion = 'strategicOffers.slider.suiteInclusion.';
 readonly strategicOffers_label_suiteDesc = 'strategicOffers.label_suiteDesc.';
 readonly strategicOffers_label_offerName = 'strategicOffers_label.offerName.';
 readonly strategicOffers_icon_offerSwipeLeft = 'strategicOffers.icon.offerSwipeLeft';
 readonly strategicOffers_icon_offerSwipeRight = 'strategicOffers.icon.offerSwipeRight';
 readonly strategicOffers_label_atoStoDiscount = 'strategicOffers_label.atoStoDiscount.';
 readonly strategicOffers_label_atoDesc = 'strategicOffers.label.atoDesc.';
 readonly strategicOffers_label_qualifiedDiscountsMsg = 'strategicOffers.label.qualifiedDiscountsMsg.';
 readonly strategicOffers_label_qualificationName = 'strategicOffers.label.qualificationName.';
 readonly strategicOffers_label_conditionsToApply = 'strategicOffers.label.conditionsToApply.';
 readonly strategicOffers_label_poolOfferName = 'strategicOffers.label.poolOfferName.';
 readonly strategicOffers_label_stepName = 'strategicOffers.label.stepName.';
 readonly strategicOffers_label_explorePersonalizedDealsMsg = 'strategicOffers.label.explorePersonalizedDealsMsg';
 readonly strategicOffers_label_selectStrategicOffer = 'strategicOffers.label.selectStrategicOffer';
 readonly strategicOffers_button_next = 'strategicOffers.button.next';
 readonly strategicOffers_page_strategicOffer = 'strategicOffers.page.strategicOffer';
 readonly createBpId_button_close = 'createBpId.button.close';
 readonly createBpId_button_cancel = 'createBpId.button.cancel';
 readonly createBpId_button_create = 'createBpId.button.create';
 readonly createBpId_dropdown_selectedReason_select = 'createBpId.dropdown.selectedReason_select';
 readonly createBpId_dropdown_selectedReason_all = 'createBpId.dropdown.selectedReason_all';
 readonly createBpId_dropdown_selectReason_other = 'createBpId.dropdown.selectReason.other';
 readonly createBpId_dropdown_selectReason = 'createBpId.dropdown.selectedReason.';
 readonly createBpId_text_reasonDetail = 'createBpId.text.reasonDetail';
 readonly selectMoreBu_button_addToExisting = 'selectMoreBu.button.addToExisting';
 readonly selectMoreBu_button_selectOnlyThese = 'selectMoreBu.button.selectOnlyThese';
 readonly merakiOrgId_button_downloadOrgId = 'merakiOrgId.button.downloadOrgId';
readonly merakiOrgId_button_cancel = 'merakiOrgId.button.cancel';
readonly merakiOrgId_button_save = 'merakiOrgId.button.save'; 
readonly merakiOrgId_textarea_orgIds = 'merakiOrgId.textarea.orgIds';

readonly reviewSubmitScope_checkbox_acceptScopeChange = 'reviewSubmitScope.checkbox.acceptScopeChange';
readonly reviewSubmitScope_icon_edit_scopeChangeReason = 'reviewSubmitScope.icon.edit.scopeChangeReason';
readonly associatedSubscriptions_data_subscriptionId = 'associatedSubscriptions.data.subscriptionId.';

readonly eaid_roadmap = 'eaid.roadmap.';
readonly eaid_roadmap_label = 'eaid.roadmap.label.';
readonly eaid_button_requestScopeChange_disabled = 'eaid.button.requestScopeChange.disabled';
readonly eaid_button_requestScopeChange = 'eaid.button.requestScopeChange';
readonly eaid_link_orgIds = 'eaid.link.orgIds';
readonly eaid_link_subsidiaries = 'eaid.link.subsidiaries';
readonly eaid_link_downloadOverlapBu = 'eaid.link.downloadOverlapBu';
readonly eaid_button_submitScopeChange_disabled = 'eaid.button.submitScopeChange.disabled';
readonly eaid_button_submitScopeChange = 'eaid.button.submitScopeChange';
readonly eaid_button_continue = 'eaid.button.continue';
readonly eaid_button_continue_disabled = 'eaid.button.continue.disabled';
readonly eaid_button_back_disabled = 'eaid.link.button.disabled';
readonly eaid_button_back = 'eaid.button.back';
readonly eaid_button_save_disabled = 'eaid.button.save.disabled';
readonly eaid_button_save = 'eaid.button.save';
readonly eaid_link_cancelScopeChange = 'eaid.link.cancelScopeChange';
readonly eaid_link_cancelScopeChange_disabled = 'eaid.link.cancelScopeChange.disabled';


readonly cavIdDetials_input_exactSearch = 'cavIdDetials.input.exactSearch';
readonly cavIdDetials_link_advanceSearch = 'cavIdDetials.link.advanceSearch';
readonly cavIdDetials_button_downloadScopeExcel = 'cavIdDetials.button.downloadScopeExcel';
readonly cavIdDetials_button_restoreToOriginal = 'cavIdDetials.button.restoreToOriginal';
readonly cavIdDetials_button_restoreToOriginal_disabled = 'cavIdDetials.button.restoreToOriginal.disabled';
readonly cavIdDetials_button_reviewChanges = 'cavIdDetials.button.reviewChanges';
readonly cavIdDetials_button_reviewChanges_disabled = 'cavIdDetials.button.reviewChanges.disabled';
readonly cavIdDetials_button_downloadScopeExcel_disabled = 'cavIdDetials.button.downloadScopeExcel.disabled';
readonly cavIdDetials_link_clearAdvancedSearch = 'cavIdDetials.link.clearAdvancedSearch';
readonly cavIdDetials_icon_fullBU = 'cavIdDetials.icon.fullBU.';
readonly cavIdDetials_icon_partialBU = 'cavIdDetials.icon.partialBU.';
readonly cavIdDetials_link_clearSearch = 'cavIdDetials.link.clearSearch';
readonly cavIdDetials_button_addToExisting = 'cavIdDetials.button.addToExisting';
readonly cavIdDetials_button_selectOnlyThese = 'cavIdDetials.button.selectOnlyThese';
readonly cavIdDetials_button_filter_all = 'cavIdDetials.button.filter.all';
readonly cavIdDetials_button_filter_selected = 'cavIdDetials.button.filter.selected';
readonly cavIdDetials_button_filter_unselected = 'cavIdDetials.button.filter.unselected';
readonly cavIdDetials_link_selectDeselectEntireBu = 'cavIdDetials.link.selectDeselectEntireBu';
readonly cavIdDetials_info_noRecordsFound = 'cavIdDetials.info.noRecordsFound';
readonly migrateServiceTier_checkbox_optionalcxHwSelected = 'migrateServiceTier.checkbox.optionalcxHwSelected.';
readonly migrateServiceTier_slider_optionalcxHwSelected = 'migrateServiceTier.slider.optionalcxHwSelected.';
readonly migrateServiceTier_link_cxTierPopover = 'migrateServicetier.link.cxTierPopover.';
readonly migrateServiceTier_dropdown_changeCxTierSelection = 'migrateServicetier.dropdown.changeCxTierSelection.';
readonly migrateServiceTier_link_cxTierObj = 'migrateServicetier.link.cxTierObj.';
readonly migrateServiceTier_number_attachRate = 'migrateServicetier.number.attachRate.';
readonly migrateServiceTier_checkbox_updateCxInclusion = 'migrateServicetier.checkbox.updateCxInclusion.';
readonly migrateSuites_icon_collapse_pool = 'migrateSuites.icon.collapse.pool.';
readonly migrateSuites_dropdown_migrateToSuite = 'migrateSuites.dropdown.migrateToSuite.';
readonly migrateSuites_link_migrateToSuiteObj = 'migrateSuites.link.migrateToSuiteObj.';
readonly migrateSuites_link_cancelMigration = 'migrateSuites.link.cancelMigration.';
readonly migrateSuites_dropdown_migrateToSuiteTierDesc = 'migrateSuites.dropdown.migrateToSuiteTierDesc.';
readonly migrateSuites_link_migrateToSuiteTierObj = 'migrateSuites.link.migrateToSuiteTierObj.';
readonly migrateSuites_link_updateMigrateType = 'migrateSuites.link.updateMigrateType.';
readonly manageServiceProvider_radio_provider = 'manageServiceProvider.radio.provider';
readonly manageServiceProvider_radio_manage_Service = 'manageServiceProvider.radio.manage_Service';

readonly cloneProposal_icon_close = 'cloneProposal.icon.close';
readonly cloneProposal_button_clone = 'cloneProposal.button.clone';
readonly cloneProposal_button_next = 'cloneProposal.button.next';
readonly cloneProposal_button_back = 'cloneProposal.button.back';
readonly cloneProposal_button_closeModal = 'cloneProposal.button.closeModal';
readonly cloneProposal_link_goToProposal = 'cloneProposal.link.goToProposal.';
readonly cloneProposal_radio_selectQuote = 'cloneProposal.radio.selectQuote.';
readonly cloneProposal_radio_selectProposal = 'cloneProposal.radio.selectProposal.';
readonly business_justification_button_closeIcon = 'businessJustification.button.closeIcon';
readonly CREATE_TCO_PARTNER_MARKUP_INPUT = 'create.tco.partnerMarkup.input';
readonly CREATE_TCO_GROWTH_EXP_INPUT = 'create.tco.growthExpenses.input';
readonly CREATE_TCO_TIME_VALUE_MONEY_INPUT = 'create.tco.timeValueMoney.input';
readonly CREATE_TCO_CLOSE_ICON = 'create.tco.closeIcon';
readonly CREATE_TCO_BUTTON_NEXT = 'create.tco.button.next' ;
readonly CREATE_TCO_BUTTON_BACK = 'create.tco.button.back';
readonly CREATE_TCO_BUTTON_GET_STARTED = 'create.tco.button.getStarted';
  constructor() { }
}
