

import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';

import CreateModelDialog from './components/CreateModelDialog';
import ModifyModelDialog from './components/ModifyModelDialog';
import DeleteModelDialog from './components/DeleteModelDialog';
import ModelsPageView from './ModelsPageView';
import { useModelsPage } from './hooks/useModelsPage';

export default function ModelsPage() {

  const { setIsCreateModalOpen, setIsEditModalOpen, setIsDeleteModalOpen, apiId, userData, selectedModel, models, openCreateModal, openDeleteModal, openEditModal, isCreateModalOpen, isEditModalOpen, isDeleteModalOpen } = useModelsPage();

  return (
    <>
      <ModelsPageView models={models}
        onOpenEditModal={openEditModal}
        onOpenDeleteModal={openDeleteModal}
        onOpenCreateModal={openCreateModal}
      />
      {/* Create Model Modal */}
      <CreateModelDialog
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        apiId={apiId || ''}
        userKey={userData?.userKey || ''}
      />
      {/* Edit Model Modal */}

      <ModifyModelDialog
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        selectedModel={selectedModel || {}}
        userKey={userData?.userKey || ''}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModelDialog
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        modelId={selectedModel?.modelId || ''}
        modelName={selectedModel?.modelName || ''}
        userKey={userData?.userKey || ''}
      />
    </>
  );
}
