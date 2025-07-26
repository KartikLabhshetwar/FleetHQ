// client/src/stores/missionStore.js
import { create } from "zustand";

const useMissionStore = create((set, get) => ({
  missions: [],
  currentMission: null,
  isLoading: false,
  error: null,

  // Set loading state
  setLoading: (isLoading) => set({ isLoading }),

  // Set error message
  setError: (errorMessage) => set({ error: errorMessage }),

  // Clear error
  clearError: () => set({ error: null }),

  // Store the fetched missions
  setMissions: (missions) => set({ missions }),

  // Store the current mission
  setCurrentMission: (mission) => set({ currentMission: mission }),

  // Add a new mission to the store
  addMissionToStore: (newMission) =>
    set((state) => ({
      missions: [newMission, ...state.missions],
      currentMission: newMission,
    })),

  // Update a mission in the store
  updateMissionInStore: (id, updatedMission) =>
    set((state) => ({
      missions: state.missions.map((mission) =>
        mission._id === id ? updatedMission : mission
      ),
      currentMission: updatedMission,
    })),

  // Remove a mission from the store
  removeMissionFromStore: (id) =>
    set((state) => ({
      missions: state.missions.filter((mission) => mission._id !== id),
    })),

  // Reset current mission
  resetCurrentMission: () => set({ currentMission: null }),
}));

export default useMissionStore;
