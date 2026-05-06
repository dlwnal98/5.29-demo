// stores/deployStore.ts
import { create } from 'zustand';

interface DeployState {
  createdStageDeploymentId: string | null;
  setCreateStageDeploymentId: (id: string | null) => void;
}

export const useDeployStore = create<DeployState>((set) => ({
  createdStageDeploymentId: null,
  setCreateStageDeploymentId: (id) => set({ createdStageDeploymentId: id }),
}));
