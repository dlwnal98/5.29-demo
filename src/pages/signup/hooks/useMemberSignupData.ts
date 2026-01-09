import { createMemberInit } from '@/apis/signup.api';

export interface MemberSignupFormData {
  name: string;
  id: string | null;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UseMemberSignupDataReturn {
  submitSignup: (formData: MemberSignupFormData) => Promise<boolean>;
}

export function useMemberSignupData(): UseMemberSignupDataReturn {
  const submitSignup = async (formData: MemberSignupFormData): Promise<boolean> => {
    const { id, password, name, email } = formData;

    try {
      await createMemberInit(id ?? '', password, name, email);
      return true;
    } catch (err) {
      return false;
    }
  };

  return {
    submitSignup,
  };
}
