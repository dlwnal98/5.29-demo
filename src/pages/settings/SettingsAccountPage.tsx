
import DeleteAccountDialog from '@/pages/settings/components/deleteAccountDialog';
import useSettingsPage from '@/pages/settings/hooks/useSettingsPage';
import SettingsAccountPageView from './SettingsAccountPageView';

export default function AccountPage() {

  const { userName, userEmail, isDeleteDialogOpen, currentPw, newPw, confirmNewPw, passwordValid,
    showCompleteDeleted, showPasswords,
    setUserName, setUserEmail, setIsDeleteDialogOpen, setCurrentPw, setNewPw, setConfirmNewPw, setPasswordValid,
    togglePasswordVisibility, validatePassword,
    handleDeleteAccount, handleModifyUser, handleChangePassword, } = useSettingsPage();

  return (
    <>
      <SettingsAccountPageView
        userName={userName}
        userEmail={userEmail}
        isDeleteDialogOpen={isDeleteDialogOpen}
        currentPw={currentPw}
        newPw={newPw}
        confirmNewPw={confirmNewPw}
        passwordValid={passwordValid}
        showCompleteDeleted={showCompleteDeleted}
        showPasswords={showPasswords}
        setUserName={setUserName}
        setUserEmail={setUserEmail}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        setCurrentPw={setCurrentPw}
        setNewPw={setNewPw}
        setConfirmNewPw={setConfirmNewPw}
        setPasswordValid={setPasswordValid}
        togglePasswordVisibility={togglePasswordVisibility}
        validatePassword={validatePassword}
        handleDeleteAccount={handleDeleteAccount}
        handleModifyUser={handleModifyUser}
        handleChangePassword={handleChangePassword}
      />
      {/* 계정 삭제 모달 */}
      <DeleteAccountDialog
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        handleDeleteAccount={handleDeleteAccount}
        showCompleteDeleted={showCompleteDeleted}
      />

    </>

  );
}
