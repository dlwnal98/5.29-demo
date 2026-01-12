import { useState, useEffect } from "react";
import { useModifyEndpoint } from "@/hooks/use-endpoints";
import { toast } from "sonner";
import { onInputChange, onSave } from "@/libs/etc";

interface FormData {
  id: string;
  routeName: string;
  routeUrl: string;
  description: string;
}

interface UseModifyEndpointDialogProps {
  formData: FormData;
  id: string;
  updatedBy: string;
  onClose: () => void;
}

export function useModifyEndpointDialog({
  formData,
  id,
  updatedBy,
  onClose,
}: UseModifyEndpointDialogProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modifyForm, setModifyForm] = useState({
    routeName: formData.routeName,
    routeUrl: formData.routeUrl,
    description: formData.description,
  });
  const [hasUrlError, setHasUrlError] = useState(false);

  useEffect(() => {
    setModifyForm({
      routeName: formData.routeName,
      routeUrl: formData.routeUrl,
      description: formData.description,
    });
  }, [formData]);

  const { mutate: modifyEndpoint } = useModifyEndpoint({
    onSuccess: () => {
      toast.success("endpoint가 수정되었습니다.");
      onClose();
      setIsModalOpen(false);
    },
    onError: () => {
      toast.error("endpoint를 수정하는 데 실패하였습니다.");
    },
  });

  const handleRouteUrlChange = (value: string) => {
    if (onInputChange(value)) {
      setHasUrlError(false);
      setModifyForm((prev) => ({ ...prev, routeUrl: value }));
    } else {
      setHasUrlError(true);
    }
  };

  const handleRouteNameChange = (value: string) => {
    if (onInputChange(value)) {
      setHasUrlError(false);
      setModifyForm((prev) => ({ ...prev, routeName: value }));
    } else {
      setHasUrlError(true);
    }
  };

  const handleDescriptionChange = (value: string) => {
    setModifyForm((prev) => ({ ...prev, description: value }));
  };

  const handleSubmit = () => {
    if (onSave(modifyForm.routeUrl)) {
      if (updatedBy) {
        modifyEndpoint({
          id,
          data: {
            routeName: modifyForm.routeName,
            routeUrl: modifyForm.routeUrl,
            description: modifyForm.description,
            updatedBy,
          },
        });
      }
    } else {
      toast.error("유효하지 않은 url 형식입니다.");
    }
  };

  return {
    routeName: modifyForm.routeName,
    routeUrl: modifyForm.routeUrl,
    description: modifyForm.description,
    hasUrlError,
    onRouteNameChange: handleRouteNameChange,
    onRouteUrlChange: handleRouteUrlChange,
    onDescriptionChange: handleDescriptionChange,
    onSubmit: handleSubmit,
  };
}
