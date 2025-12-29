import { AppLayout } from "@/components/layout/AppLayout";
import { useSecretKey } from "./hooks/useSecretKey";
import SecretKeyPageView from "./SecretKeyPageView";

export default function SecretKeyPage() {
  const { vaultKeyData, value, setValue, saveConfigs } = useSecretKey();

  return (
    <AppLayout>
      <SecretKeyPageView
        vaultKeyData={vaultKeyData}
        value={value}
        onValueChange={setValue}
        onSave={saveConfigs}
      />
    </AppLayout>
  );
}
