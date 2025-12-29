import { useState } from "react";
import { useCreateEndpoint } from "@/hooks/use-endpoints";
import { toast } from "sonner";
import { onInputChange, onSave } from "@/lib/etc";

interface UseCreateEndpointDialogProps {
  organizationId: string;
  createdBy: string;
  onClose: () => void;
}

export function useCreateEndpointDialog({
  organizationId,
  createdBy,
  onClose,
}: UseCreateEndpointDialogProps) {
  const [endpointForm, setEndpointForm] = useState({
    url: "",
    description: "",
  });
  const [hasUrlError, setHasUrlError] = useState(false);

  const { mutate: createEndpoint } = useCreateEndpoint({
    onSuccess: () => {
      toast.success("endpoint가 생성되었습니다.");
      resetForm();
      onClose();
    },
    onError: () => {
      toast.error("endpoint를 생성하는 데 실패하였습니다.");
    },
  });

  const handleUrlChange = (value: string) => {
    if (onInputChange(value)) {
      setHasUrlError(false);
      setEndpointForm((prev) => ({ ...prev, url: value }));
    } else {
      setHasUrlError(true);
    }
  };

  const handleDescriptionChange = (value: string) => {
    setEndpointForm((prev) => ({ ...prev, description: value }));
  };

  const handleSubmit = () => {
    if (onSave(endpointForm.url)) {
      if (organizationId && createdBy) {
        createEndpoint({
          organizationId,
          routeEndpoint: endpointForm.url,
          description: endpointForm.description,
          createdBy,
        });
      }
    } else {
      toast.error("유효하지 않은 url 형식입니다.");
    }
  };

  const resetForm = () => {
    setEndpointForm({ url: "", description: "" });
    setHasUrlError(false);
  };

  const isSubmitDisabled = !endpointForm.url;

  return {
    url: endpointForm.url,
    description: endpointForm.description,
    hasUrlError,
    isSubmitDisabled,
    onUrlChange: handleUrlChange,
    onDescriptionChange: handleDescriptionChange,
    onSubmit: handleSubmit,
  };
}
