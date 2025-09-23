// stores/deployStore.ts
import { create } from 'zustand';

interface DeployState {
  selectedStageId: string | null;
  setSelectedStageId: (id: string | null) => void;
}

export const useDeployStore = create<DeployState>((set) => ({
  selectedStageId: null,
  setSelectedStageId: (id) => set({ selectedStageId: id }),
}));
