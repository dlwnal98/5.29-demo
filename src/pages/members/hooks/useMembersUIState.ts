import { useState } from 'react';
import { userIdRegex } from '@/libs/etc';
import { SelectMemberInfo } from '../types';

export type { SelectMemberInfo };

export interface UseMembersUIStateReturn {
  // Search & Filter
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  searchType: string;
  setSearchType: React.Dispatch<React.SetStateAction<string>>;
  statusFilter: string;
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>;

  // Expanded Row
  expandedUser: string | null;
  setExpandedUser: React.Dispatch<React.SetStateAction<string | null>>;
  passwordOpenAuth: boolean;
  setPasswordOpenAuth: React.Dispatch<React.SetStateAction<boolean>>;

  // Pagination
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;

  // Add Member Dialog
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  memberId: string;
  setMemberId: React.Dispatch<React.SetStateAction<string>>;
  firstMemberPw: string;
  setFirstMemberPw: React.Dispatch<React.SetStateAction<string>>;
  idValid: boolean;
  setIdValid: React.Dispatch<React.SetStateAction<boolean>>;
  idValidMsg: string;
  setIdValidMsg: React.Dispatch<React.SetStateAction<string>>;

  // Reset Password Dialog
  isResetPasswordModalOpen: boolean;
  setIsResetPasswordModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  resetPasswordUser: SelectMemberInfo;
  setResetPasswordUser: React.Dispatch<React.SetStateAction<SelectMemberInfo>>;
  tempPassword: string;
  setTempPassword: React.Dispatch<React.SetStateAction<string>>;

  // Delete Account Dialog
  isDeleteAccountModalOpen: boolean;
  setIsDeleteAccountModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deleteAccountUser: SelectMemberInfo;
  setDeleteAccountUser: React.Dispatch<React.SetStateAction<SelectMemberInfo>>;

  // Actions
  handleAction: (action: string, userKey: string, userId?: string) => void;
  validateUserId: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRowClick: (userId: string) => void;
  handleExpandToggle: (e: React.MouseEvent, userId: string) => void;
}

export function useMembersUIState(): UseMembersUIStateReturn {
  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('organzation');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Expanded Row
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [passwordOpenAuth, setPasswordOpenAuth] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Add Member Dialog
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [memberId, setMemberId] = useState('');
  const [firstMemberPw, setFirstMemberPw] = useState('');
  const [idValid, setIdValid] = useState(false);
  const [idValidMsg, setIdValidMsg] = useState('');

  // Reset Password Dialog
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState<SelectMemberInfo>({
    userId: '',
    userKey: '',
  });
  const [tempPassword, setTempPassword] = useState('');

  // Delete Account Dialog
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const [deleteAccountUser, setDeleteAccountUser] = useState<SelectMemberInfo>({
    userId: '',
    userKey: '',
  });

  // 액션 별 함수
  const handleAction = (action: string, userKey: string, userId?: string) => {
    if (action === 'resetPassword') {
      setIsResetPasswordModalOpen(true);
      setResetPasswordUser({
        userId: userId ?? '',
        userKey: userKey,
      });
      setTempPassword('');
    } else if (action === 'deleteAccount') {
      setIsDeleteAccountModalOpen(true);
      setDeleteAccountUser({
        userId: userId ?? '',
        userKey: userKey,
      });
    } else if (action === 'create') {
      setIsAddDialogOpen(true);
      setFirstMemberPw('');
      setMemberId('');
      setIdValid(false);
      setIdValidMsg('');
    }
  };

  const validateUserId = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (userIdRegex.test(e.target.value)) {
      setIdValid(true);
      setIdValidMsg('유효한 아이디입니다.');
    } else {
      setIdValid(false);
      setIdValidMsg('아이디 형식이 맞지 않습니다.');
    }
  };

  const handleRowClick = (userId: string) => {
    setExpandedUser(expandedUser === userId ? null : userId);
    setPasswordOpenAuth(false);
  };

  const handleExpandToggle = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  return {
    // Search & Filter
    searchTerm,
    setSearchTerm,
    searchType,
    setSearchType,
    statusFilter,
    setStatusFilter,

    // Expanded Row
    expandedUser,
    setExpandedUser,
    passwordOpenAuth,
    setPasswordOpenAuth,

    // Pagination
    currentPage,
    setCurrentPage,

    // Add Member Dialog
    isAddDialogOpen,
    setIsAddDialogOpen,
    memberId,
    setMemberId,
    firstMemberPw,
    setFirstMemberPw,
    idValid,
    setIdValid,
    idValidMsg,
    setIdValidMsg,

    // Reset Password Dialog
    isResetPasswordModalOpen,
    setIsResetPasswordModalOpen,
    resetPasswordUser,
    setResetPasswordUser,
    tempPassword,
    setTempPassword,

    // Delete Account Dialog
    isDeleteAccountModalOpen,
    setIsDeleteAccountModalOpen,
    deleteAccountUser,
    setDeleteAccountUser,

    // Actions
    handleAction,
    validateUserId,
    handleRowClick,
    handleExpandToggle,
  };
}
