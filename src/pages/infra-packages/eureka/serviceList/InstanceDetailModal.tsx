import { useInstanceDetail } from "./hooks/useInstanceDetail";
import InstanceDetailModalView from "./InstanceDetailModalView";
import { ServicesInstance, EurekaServices } from "@/types/eureka";

interface ModalProps {
  selectedInstance: ServicesInstance;
  onOpenChange: (instance: ServicesInstance | false) => void;
  eurekaServicesData: EurekaServices[];
}

export default function InstanceDetailModal({
  selectedInstance,
  onOpenChange,
  eurekaServicesData,
}: ModalProps) {
  const { instanceData, modalContentRef, handleInstanceChange } =
    useInstanceDetail(selectedInstance);

  if (!instanceData) return null;

  return (
    <InstanceDetailModalView
      ref={modalContentRef}
      instanceData={instanceData}
      selectedInstance={selectedInstance}
      eurekaServicesData={eurekaServicesData}
      onClose={() => onOpenChange(false)}
      onInstanceChange={(instance) => handleInstanceChange(instance, onOpenChange)}
    />
  );
}
