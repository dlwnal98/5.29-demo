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
    routeOption: "AUTO",
    description: "",
  });
  const [hasUrlError, setHasUrlError] = useState(false);

  const { mutate: createEndpoint } = useCreateEndpoint({
    onSuccess: () => {
      toast.success("Endpoint가 성공적으로 생성되었습니다.");
      resetForm();
      onClose();
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message
        || error?.response?.data?.detail
        || error?.message
        || 'Endpoint 생성 중 오류가 발생했습니다.';
      toast.error(errorMessage);
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

  const handleRouteOptionChange = (value: string) => {
    setEndpointForm((prev) => ({ ...prev, routeOption: value }));
  };

  const handleDescriptionChange = (value: string) => {
    setEndpointForm((prev) => ({ ...prev, description: value }));
  };

  const handleSubmit = () => {
    if (onSave(endpointForm.routeUrl)) {

      if (tenantId && createdBy) {

        createEndpoint({
          tenantId,
          routeName: endpointForm.routeName,
          routeUrl: endpointForm.routeUrl,
          // routeOption: endpointForm.routeOption,
          description: endpointForm.description,
          createdBy,
        });
      }
    } else {
      toast.error("유효하지 않은 URL 형식입니다.");
    }
  };

  const resetForm = () => {
    setEndpointForm({ routeName: '', routeUrl: "", routeOption: '', description: "" });
    setHasUrlError(false);
  };

  const isSubmitDisabled = !endpointForm.routeUrl;

  return {
    routeName: endpointForm.routeName,
    routeUrl: endpointForm.routeUrl,
    routeOption: endpointForm.routeOption,
    description: endpointForm.description,
    hasUrlError,
    isSubmitDisabled,
    onRouteNameChange: handleRouteNameChange,
    onRouteUrlChange: handleRouteUrlChange,
    onRouteOptionChange: handleRouteOptionChange,
    onDescriptionChange: handleDescriptionChange,
    onSubmit: handleSubmit,
  };
}
