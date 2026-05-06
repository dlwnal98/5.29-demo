import { useState } from "react";
import { useFetchVaultKey, useSaveVaultKey } from "@/hooks/use-config-data";

interface UseSecretKeyReturn {
  vaultKeyData: string | undefined;
  value: string;
  setValue: (value: string) => void;
  saveConfigs: () => void;
}

export function useSecretKey(): UseSecretKeyReturn {
  const { data: vaultKeyData } = useFetchVaultKey();
  const [value, setValue] = useState<string>("");

  const { mutate: saveVaultKey } = useSaveVaultKey(value);

  const saveConfigs = () => {
    saveVaultKey();
  };

  return {
    vaultKeyData,
    value,
    setValue,
    saveConfigs,
  };
}
