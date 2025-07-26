// client/src/stores/droneStore.js
import { create } from "zustand";

const useDroneStore = create((set) => ({
  drones: [],
  availableDrones: [],
  currentDrone: null,
  isLoading: false,
  error: null,

  // Set all drones
  setDrones: (drones) => set({ drones }),

  // Set available drones
  setAvailableDrones: (availableDrones) => set({ availableDrones }),

  // Set current drone
  setCurrentDrone: (drone) => set({ currentDrone: drone }),

  // Add a drone to the store
  addDroneToStore: (drone) =>
    set((state) => ({
      drones: [drone, ...state.drones],
    })),

  // Update a drone in the store
  updateDroneInStore: (id, updatedDrone) =>
    set((state) => ({
      drones: state.drones.map((drone) =>
        drone._id === id ? updatedDrone : drone
      ),
      currentDrone:
        state.currentDrone?._id === id ? updatedDrone : state.currentDrone,
    })),

  // Update drone location
  updateDroneLocation: (id, location) =>
    set((state) => ({
      drones: state.drones.map((drone) =>
        drone._id === id
          ? { ...drone, location: { ...location, lastUpdated: new Date() } }
          : drone
      ),
      currentDrone:
        state.currentDrone?._id === id
          ? {
              ...state.currentDrone,
              location: { ...location, lastUpdated: new Date() },
            }
          : state.currentDrone,
    })),

  // Update drone battery level
  updateDroneBatteryLevel: (id, batteryLevel) =>
    set((state) => ({
      drones: state.drones.map((drone) =>
        drone._id === id ? { ...drone, batteryLevel } : drone
      ),
      currentDrone:
        state.currentDrone?._id === id
          ? { ...state.currentDrone, batteryLevel }
          : state.currentDrone,
    })),

  // Update drone status
  updateDroneStatus: (id, status) =>
    set((state) => ({
      drones: state.drones.map((drone) =>
        drone._id === id ? { ...drone, status } : drone
      ),
      currentDrone:
        state.currentDrone?._id === id
          ? { ...state.currentDrone, status }
          : state.currentDrone,
    })),

  // Update drone health status
  updateDroneHealthStatus: (id, healthStatus) =>
    set((state) => ({
      drones: state.drones.map((drone) =>
        drone._id === id ? { ...drone, healthStatus } : drone
      ),
      currentDrone:
        state.currentDrone?._id === id
          ? { ...state.currentDrone, healthStatus }
          : state.currentDrone,
    })),

  // Remove a drone from the store
  removeDroneFromStore: (id) =>
    set((state) => ({
      drones: state.drones.filter((drone) => drone._id !== id),
      currentDrone: state.currentDrone?._id === id ? null : state.currentDrone,
    })),

  // Set loading state
  setLoading: (isLoading) => set({ isLoading }),

  // Set error state
  setError: (error) => set({ error }),

  // Clear error state
  clearError: () => set({ error: null }),

  // Reset store
  reset: () =>
    set({
      drones: [],
      availableDrones: [],
      currentDrone: null,
      isLoading: false,
      error: null,
    }),
}));

export default useDroneStore;
