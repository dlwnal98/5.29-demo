import { AppLayout } from "@/components/layout/AppLayout";
import { Toaster } from "sonner";
import CreateMethodPageView from "./CreateMethodPageView";
import { SelectAPIKeyModal } from "./components/SelectAPIKeyModal";
import { useCreateMethodPage } from "./hooks/useCreateMethodPage";

export default function CreateMethodPage() {
  const {
    resourcePath,
    userKey,
    organizationId,
    apiKeyList,
    endpointList,
    modelList,
    validatorList,
    methodForm,
    isDirectUrlInput,
    selectedApiKey,
    apiKeyToggle,
    checkUrl,
    openSections,
    queryParameters,
    headers,
    bodyModelId,
    openId,
    isApiKeyModalOpen,
    isCreatingNewApiKey,
    newApiKeyForm,
    isValidCreateMethod,
    setSelectedApiKey,
    setSelectedApiKeyId,
    setApiKeyToggle,
    setIsApiKeyModalOpen,
    setIsCreatingNewApiKey,
    setNewApiKeyForm,
    setBodyModelId,
    setOpenId,
    onBack,
    onCreateMethod,
    onToggleSection,
    onApiKeyToggle,
    onAddQueryParameter,
    onUpdateQueryParameter,
    onRemoveQueryParameter,
    onAddHeader,
    onUpdateHeader,
    onRemoveHeader,
    onCopyAPIKey,
    onMethodFormChange,
    onCustomUrlChange,
    onDirectUrlToggle,
  } = useCreateMethodPage();

  return (
    <>
      <>
        <CreateMethodPageView
          resourcePath={resourcePath}
          endpointList={endpointList}
          modelList={modelList}
          validatorList={validatorList}
          methodForm={methodForm}
          isDirectUrlInput={isDirectUrlInput}
          selectedApiKey={selectedApiKey}
          apiKeyToggle={apiKeyToggle}
          checkUrl={checkUrl}
          openSections={openSections}
          queryParameters={queryParameters}
          headers={headers}
          bodyModelId={bodyModelId}
          openId={openId}
          isValidCreateMethod={isValidCreateMethod}
          setBodyModelId={setBodyModelId}
          setOpenId={setOpenId}
          onBack={onBack}
          onCreateMethod={onCreateMethod}
          onToggleSection={onToggleSection}
          onApiKeyToggle={onApiKeyToggle}
          onAddQueryParameter={onAddQueryParameter}
          onUpdateQueryParameter={onUpdateQueryParameter}
          onRemoveQueryParameter={onRemoveQueryParameter}
          onAddHeader={onAddHeader}
          onUpdateHeader={onUpdateHeader}
          onRemoveHeader={onRemoveHeader}
          onCopyAPIKey={onCopyAPIKey}
          onMethodFormChange={onMethodFormChange}
          onCustomUrlChange={onCustomUrlChange}
          onDirectUrlToggle={onDirectUrlToggle}
        />

        <SelectAPIKeyModal
          open={isApiKeyModalOpen}
          onOpenChange={setIsApiKeyModalOpen}
          isCreatingNewApiKey={isCreatingNewApiKey}
          setIsCreatingNewApiKey={setIsCreatingNewApiKey}
          apiKeyList={apiKeyList || []}
          setSelectedApiKey={setSelectedApiKey}
          setSelectedApiKeyId={setSelectedApiKeyId}
          newApiKeyForm={newApiKeyForm}
          setNewApiKeyForm={setNewApiKeyForm}
          userKey={userKey}
          setApiKeyToggle={setApiKeyToggle}
          organizationId={organizationId}
        />
      </>
    </>
  );
}
