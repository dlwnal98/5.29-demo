import { useState, useEffect } from "react";
import { useModifyEndpoint } from "@/hooks/use-endpoints";
import { toast } from "sonner";
import { onInputChange, onSave } from "@/lib/etc";

interface FormData {
  targetId: string;
  url: string;
  description: string;
}

interface UseModifyEndpointDialogProps {
  formData: FormData;
  targetId: string;
  updatedBy: string;
  onClose: () => void;
}

export function useModifyEndpointDialog({
  formData,
  targetId,
  updatedBy,
  onClose,
}: UseModifyEndpointDialogProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modifyForm, setModifyForm] = useState({
    url: formData.url,
    description: formData.description,
  });
  const [hasUrlError, setHasUrlError] = useState(false);

  useEffect(() => {
    setModifyForm({
      url: formData.url,
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

  const handleUrlChange = (value: string) => {
    if (onInputChange(value)) {
      setHasUrlError(false);
      setModifyForm((prev) => ({ ...prev, url: value }));
    } else {
      setHasUrlError(true);
    }
  };

  const handleDescriptionChange = (value: string) => {
    setModifyForm((prev) => ({ ...prev, description: value }));
  };

  const handleSubmit = () => {
    if (onSave(modifyForm.url)) {
      if (updatedBy) {
        modifyEndpoint({
          targetId,
          data: {
            routeEndpoint: modifyForm.url,
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
    url: modifyForm.url,
    description: modifyForm.description,
    hasUrlError,
    onUrlChange: handleUrlChange,
    onDescriptionChange: handleDescriptionChange,
    onSubmit: handleSubmit,
  };
}
