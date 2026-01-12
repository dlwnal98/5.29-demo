import { useState } from "react";
import { useCreateEndpoint } from "@/hooks/use-endpoints";
import { toast } from "sonner";
import { onInputChange, onSave } from "@/libs/etc";

interface UseCreateEndpointDialogProps {
  tenantId: string;
  createdBy: string;
  onClose: () => void;
}

export function useCreateEndpointDialog({
  tenantId,
  createdBy,
  onClose,
}: UseCreateEndpointDialogProps) {
  const [endpointForm, setEndpointForm] = useState({
    routeName: '',
    routeUrl: "",
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

  const handleRouteUrlChange = (value: string) => {
    if (onInputChange(value)) {
      setHasUrlError(false);
      setEndpointForm((prev) => ({ ...prev, routeUrl: value }));
    } else {
      setHasUrlError(true);
    }
  };

  const handleRouteNameChange = (value: string) => {
    setEndpointForm((prev) => ({ ...prev, routeName: value }));
  };

  const handleDescriptionChange = (value: string) => {
    setEndpointForm((prev) => ({ ...prev, description: value }));
  };

  const handleSubmit = () => {
    console.log('여기')
    if (onSave(endpointForm.routeUrl)) {
      console.log('여기2')

      if (tenantId && createdBy) {
        console.log('여기3')

        createEndpoint({
          tenantId,
          routeName: endpointForm.routeName,
          routeUrl: endpointForm.routeUrl,
          description: endpointForm.description,
          createdBy,
        });
      }
    } else {
      toast.error("유효하지 않은 url 형식입니다.");
    }
  };

  const resetForm = () => {
    setEndpointForm({ routeName: '', routeUrl: "", description: "" });
    setHasUrlError(false);
  };

  const isSubmitDisabled = !endpointForm.routeUrl;

  return {
    routeName: endpointForm.routeName,
    routeUrl: endpointForm.routeUrl,
    description: endpointForm.description,
    hasUrlError,
    isSubmitDisabled,
    onRouteNameChange: handleRouteNameChange,
    onRouteUrlChange: handleRouteUrlChange,
    onDescriptionChange: handleDescriptionChange,
    onSubmit: handleSubmit,
  };
}
