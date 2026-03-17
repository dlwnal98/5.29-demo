import { createUser } from '@/apis/signup.api';
import { requestGet } from '@/libs/request';

export interface SignupFormData {
  organizationName: string;
  fullName: string;
  userId: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UseSignupDataReturn {
  checkUserIdExists: (userId: string) => Promise<boolean>;
  submitSignup: (formData: SignupFormData) => Promise<{ success: boolean; code?: number }>;
}

export function useSignupData(): UseSignupDataReturn {
  const checkUserIdExists = async (userId: string): Promise<boolean> => {
    const res = await requestGet(`/api/v1/users/exists?userId=${userId}`);
    return res.data === false; // false means not exists, so valid
  };

  const submitSignup = async (
    formData: SignupFormData
  ): Promise<{ success: boolean; code?: number }> => {
    const { organizationName, userId, password, fullName, email } = formData;

    try {
      const res = await createUser(organizationName, userId, password, fullName, email);

      if (res.code == 200) {
        return { success: true, code: res.code };
      } else {
        return { success: false, code: res.code };
      }
    } catch (err) {
      return { success: false };
    }
  };

  return {
    checkUserIdExists,
    submitSignup,
  };
}
