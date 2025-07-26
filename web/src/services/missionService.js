// client/src/services/missionService.js
import axios from "axios";
import useMissionStore from "../stores/missionStore";

const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/missions`
  : "http://localhost:5000/api/missions";

// Create config object with authorization header
const getConfig = (token) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Helper to get token from localStorage
const getToken = () => {
  try {
    const authStorage = localStorage.getItem("auth-storage");
    if (authStorage) {
      const { state } = JSON.parse(authStorage);
      return state?.token;
    }
    return null;
  } catch (error) {
    console.error('Error getting token from storage:', error);
    return null;
  }
};

// Fetch all missions
export const fetchMissions = async () => {
  const { setLoading, setError, setMissions } = useMissionStore.getState();
  const token = getToken();

  if (!token) {
    console.log("No token available for operation");
    return null;
  }

  try {
    setLoading(true);
    setError(null);

    const response = await axios.get(API_URL, getConfig(token));
    const missions = response.data;

    setMissions(missions);
    setLoading(false);
    return missions;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch missions";
    setError(message);
    setLoading(false);
    console.error("Error fetching missions:", error);
    return null;
  }
};

// Fetch a specific mission by ID
export const fetchMissionById = async (id) => {
  const { setLoading, setError, setCurrentMission } =
    useMissionStore.getState();
  const token = getToken();

  if (!token) {
    console.log("No token available for operation");
    return null;
  }

  try {
    setLoading(true);
    setError(null);

    const response = await axios.get(`${API_URL}/${id}`, getConfig(token));
    const mission = response.data;

    setCurrentMission(mission);
    setLoading(false);
    return mission;
  } catch (error) {
    const message =
      error.response?.data?.message || "Failed to fetch mission details";
    setError(message);
    setLoading(false);
    console.error("Error fetching mission by ID:", error);
    return null;
  }
};

// Create a new mission
export const createMission = async (missionData) => {
  const { setLoading, setError, addMissionToStore } =
    useMissionStore.getState();
  const token = getToken();

  if (!token) {
    console.log("No token available for operation");
    return null;
  }

  try {
    setLoading(true);
    setError(null);

    const response = await axios.post(API_URL, missionData, getConfig(token));
    const newMission = response.data;

    addMissionToStore(newMission);
    setLoading(false);
    return newMission;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to create mission";
    setError(message);
    setLoading(false);
    console.error("Error creating mission:", error);
    return null;
  }
};

// Update an existing mission
export const updateMission = async (id, missionData) => {
  const { setLoading, setError, updateMissionInStore } =
    useMissionStore.getState();
  const token = getToken();

  if (!token) {
    console.log("No token available for operation");
    return null;
  }

  try {
    setLoading(true);
    setError(null);

    const response = await axios.put(
      `${API_URL}/${id}`,
      missionData,
      getConfig(token)
    );
    const updatedMission = response.data;

    updateMissionInStore(id, updatedMission);
    setLoading(false);
    return updatedMission;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to update mission";
    setError(message);
    setLoading(false);
    console.error("Error updating mission:", error);
    return null;
  }
};

// Delete a mission
export const deleteMission = async (id) => {
  const { setLoading, setError, removeMissionFromStore } =
    useMissionStore.getState();
  const token = getToken();

  if (!token) {
    console.log("No token available for operation");
    return false;
  }

  try {
    setLoading(true);
    setError(null);

    await axios.delete(`${API_URL}/${id}`, getConfig(token));

    removeMissionFromStore(id);
    setLoading(false);
    return true;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to delete mission";
    setError(message);
    setLoading(false);
    console.error("Error deleting mission:", error);
    return false;
  }
};
