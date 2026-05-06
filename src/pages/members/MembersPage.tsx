import MembersPageView from './MembersPageView';
import { useMembersData } from './hooks/useMembersData';
import { useMembersUIState } from './hooks/useMembersUIState';
import CreateMemberDialog from './components/CreateMemberDialog';
import ResetPasswordDialog from './components/ResetPasswordDialog';
import DeleteMemberDialog from './components/DeleteMemberDialog';

const USERS_PER_PAGE = 10;

export default function MembersPage() {
  const uiState = useMembersUIState();

  const membersData = useMembersData({
    statusFilter: uiState.statusFilter,
    onAddMemberSuccess: (password) => {
      uiState.setFirstMemberPw(password);
    },
    onAddMemberError: () => {
      uiState.setMemberId('');
      uiState.setIdValid(false);
      uiState.setIdValidMsg('');
    },
    onDeleteMemberSuccess: () => {
      uiState.setIsDeleteAccountModalOpen(false);
    },
  });

  // Pagination
  const totalPages = Math.ceil((membersData.filteredUsers ?? []).length / USERS_PER_PAGE);
  const startIndex = (uiState.currentPage - 1) * USERS_PER_PAGE;
  const endIndex = startIndex + USERS_PER_PAGE;
  const currentUsers = membersData.filteredUsers?.slice(startIndex, endIndex);

  // Reset Password Handler with UI state update
  const handleResetPassword = async (userKey: string) => {
    const password = await membersData.handleResetPassword(userKey);
    if (password) {
      uiState.setTempPassword(password);
    }
    return password;
  };

  const handleChangeStatus = (value: string) => {
    uiState.setExpandedUser(null);
    uiState.setCurrentPage(1);
    uiState.setStatusFilter(value);
  };

  const handleChangePage = (page: number) => {
    uiState.setCurrentPage(page);
    uiState.setExpandedUser(null);

  };

  return (
    <>
      <MembersPageView
        // Auth
        isSuper={membersData.isSuper}
        organizationId={membersData.orgId}
        // Data
        filteredUsers={membersData.filteredUsers}
        currentUsers={currentUsers}
        // Search & Filter
        searchTerm={uiState.searchTerm}
        searchType={uiState.searchType}
        statusFilter={uiState.statusFilter}
        onSearchTermChange={uiState.setSearchTerm}
        // onStatusFilterChange={uiState.setStatusFilter}
        onStatusFilterChange={handleChangeStatus}
        // Expanded Row
        expandedUser={uiState.expandedUser}
        onRowClick={uiState.handleRowClick}
        onExpandToggle={uiState.handleExpandToggle}
        // Pagination
        currentPage={uiState.currentPage}
        totalPages={totalPages}
        onPageChange={handleChangePage}
        // Handlers
        onStatusToggle={membersData.handleStatusToggle}
        onAction={uiState.handleAction}

      />

      {/* 멤버 생성 모달 */}
      <CreateMemberDialog
        isAddDialogOpen={uiState.isAddDialogOpen}
        setIsAddDialogOpen={uiState.setIsAddDialogOpen}
        firstMemberPw={uiState.firstMemberPw}
        memberId={uiState.memberId}
        organizationId={membersData.orgId}
        idValidMsg={uiState.idValidMsg}
        idValid={uiState.idValid}
        setMemberId={uiState.setMemberId}
        setTempPassword={uiState.setTempPassword}
        validateUserId={uiState.validateUserId}
        handleAddMember={membersData.handleAddMember}
        handleCopyPassword={membersData.handleCopyPassword}
      />

      {/* 임시 비밀번호 발급 모달 */}
      <ResetPasswordDialog
        isResetPasswordModalOpen={uiState.isResetPasswordModalOpen}
        setIsResetPasswordModalOpen={uiState.setIsResetPasswordModalOpen}
        tempPassword={uiState.tempPassword}
        userId={uiState.resetPasswordUser.userId}
        userKey={uiState.resetPasswordUser.userKey}
        handleResetPassword={handleResetPassword}
        handleCopyPassword={membersData.handleCopyPassword}
      />

      {/* 멤버 삭제 모달 */}
      <DeleteMemberDialog
        isDeleteAccountModalOpen={uiState.isDeleteAccountModalOpen}
        setIsDeleteAccountModalOpen={uiState.setIsDeleteAccountModalOpen}
        handleDeleteAccount={membersData.handleDeleteAccount}
        userId={uiState.deleteAccountUser.userId}
        userKey={uiState.deleteAccountUser.userKey}
        organizationId={membersData.orgId}
      />
    </>

  );
}
