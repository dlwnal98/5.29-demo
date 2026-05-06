import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { toast, Toaster } from 'sonner';
import { getReJWTToken } from '@/apis/settings-account.api';
import { useAuthStore } from '@/stores/store';
import { passwordRegex } from '@/libs/etc';
import { requestDelete, requestPut, requestPost } from '@/libs/request';
export default function useSettingsPage() {
    const userData = useAuthStore((state) => state.user);

    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentPw, setCurrentPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [confirmNewPw, setConfirmNewPw] = useState('');
    const [passwordValid, setPasswordValid] = useState(false);
    const [showCompleteDeleted, setShowCompleteDeleted] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const togglePasswordVisibility = (field: string) => {
        setShowPasswords((prev) => ({ ...prev, [field]: !prev[field as keyof typeof prev] }));
    };

    const validatePassword = (value: string) => {
        if (!passwordRegex.test(value)) {
            setPasswordValid(false);
        } else {
            setPasswordValid(true);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            const res = await requestDelete(`/api/v1/users/${userData?.userKey}`);

            if (res.code == 200) {
                sessionStorage.clear();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setShowCompleteDeleted(true);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleModifyUser = async () => {
        const name = userName ? userName : userData?.name;
        const email = userEmail ? userEmail : userData?.email;

        try {
            const res = await requestPut(`/api/v1/users/${userData?.userKey}`, {
                body: {
                    email: email,
                    fullName: name,
                },
            });

            if (res.code == 200) {
                // window.scrollTo({ top: 0, behavior: 'smooth' });
                toast.success('유저 정보가 성공적으로 수정되었습니다.');
                getReJWTToken();
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleChangePassword = async () => {
        try {
            const res = await requestPost(`/api/v1/users/${userData?.userKey}/password/change`, {
                body: {
                    currentPassword: currentPw,
                    newPassword: newPw,
                },
            });

            if (res.code == 200) {
                toast.success('비밀번호가 성공적으로 변경되었습니다');
                setCurrentPw('');
                setNewPw('');
                setConfirmNewPw('');
                setPasswordValid(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                toast.error(res.message);
            }
        } catch (e) {
            console.error('실패!', e);
        }
    };

    return {
        userName, userEmail, isDeleteDialogOpen, currentPw, newPw, confirmNewPw, passwordValid,
        showCompleteDeleted, showPasswords,
        setUserName, setUserEmail, setIsDeleteDialogOpen, setCurrentPw, setNewPw, setConfirmNewPw, setPasswordValid,
        setShowCompleteDeleted, setShowPasswords,
        togglePasswordVisibility, validatePassword,
        handleDeleteAccount, handleModifyUser, handleChangePassword,
    }
}