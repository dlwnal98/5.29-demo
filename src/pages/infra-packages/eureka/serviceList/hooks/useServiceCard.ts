import { useState, useRef, useCallback } from "react";
import { ServicesInstance } from "@/types/eureka";

interface UseServiceCardReturn {
  selectedInstance: ServicesInstance | null;
  modalContentRef: React.RefObject<HTMLDivElement>;
  handleInstanceChange: (instance: ServicesInstance) => void;
  handleModalClose: () => void;
}

export function useServiceCard(): UseServiceCardReturn {
  const [selectedInstance, setSelectedInstance] = useState<ServicesInstance | null>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  const handleInstanceChange = useCallback((instance: ServicesInstance) => {
    setSelectedInstance(instance);
    setTimeout(() => {
      if (modalContentRef.current) {
        modalContentRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 100);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedInstance(null);
  }, []);

  return {
    selectedInstance,
    modalContentRef,
    handleInstanceChange,
    handleModalClose,
  };
}
