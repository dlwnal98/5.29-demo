import { useRef, useCallback } from "react";
import { useEurekaInstances } from "@/hooks/use-eurekaData";
import { EurekaInstance, ServicesInstance } from "@/types/eureka";

interface UseInstanceDetailReturn {
  instanceData: EurekaInstance | undefined;
  modalContentRef: React.RefObject<HTMLDivElement>;
  handleInstanceChange: (
    instance: ServicesInstance,
    onOpenChange: (instance: ServicesInstance | false) => void
  ) => void;
}

export function useInstanceDetail(
  selectedInstance: ServicesInstance
): UseInstanceDetailReturn {
  const { data: instanceData } = useEurekaInstances(selectedInstance?.instanceId);
  const modalContentRef = useRef<HTMLDivElement>(null);

  const handleInstanceChange = useCallback(
    (
      instance: ServicesInstance,
      onOpenChange: (instance: ServicesInstance | false) => void
    ) => {
      onOpenChange(instance);

      setTimeout(() => {
        if (modalContentRef.current) {
          modalContentRef.current.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 100);
    },
    []
  );

  return {
    instanceData,
    modalContentRef,
    handleInstanceChange,
  };
}
