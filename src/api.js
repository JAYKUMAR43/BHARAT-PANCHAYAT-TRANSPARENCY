
const API = "http://127.0.0.1:8000";

async function apiCall(path, options = {}) {
  try {
    const res = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      console.warn("API Error:", res.status, res.statusText);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error("API Fetch Failed:", path, err);
    return null;
  }
}

// Locations
export const fetchStates = async () => {
  const res = await apiCall("/locations/states");
  console.log("States API response:", res);
  return res;
};

export const fetchDistricts = (id) => apiCall(`/locations/districts/${id}`);
export const fetchBlocks = (id) => apiCall(`/locations/blocks/${id}`);
export const fetchVillages = (id) => apiCall(`/locations/villages/${id}`);

// Projects + Dashboard
export const fetchProjectsByVillage = (id) => apiCall(`/projects/by_village/${id}`);
export const fetchProjectDetail = (id) => apiCall(`/projects/${id}`);
export const fetchVillageDashboard = (id) => apiCall(`/dashboard/village/${id}`);

// Feedback
export const listFeedback = (id) => apiCall(`/feedback/list/${id}`);
export const submitFeedback = (id, payload) =>
  apiCall(`/feedback/add/${id}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

// Officer Panel
export const createProject = (payload) =>
  apiCall("/projects/add", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateProject = (id, payload) =>
  apiCall(`/projects/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteProject = (id) =>
  apiCall(`/projects/delete/${id}`, {
    method: "DELETE",
  });

export const computeRisk = (payload) =>
  apiCall("/ai/risk", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  export async function submitFeedbackWithFile(projectId, formData) {
  const res = await fetch(`${API}/feedback/add/${projectId}`, {
    method: "POST",
    body: formData,
  });
  return res.json();
}

export async function fetchProblematicFeedbacks(villageId) {
  const res = await fetch(`${API}/feedback/problematic/${villageId}`);
  return res.json();
}

export const fetchContractors = () => apiCall("/contractors/list");

export const addContractor = (payload) =>
  apiCall("/contractors/add?" + new URLSearchParams(payload), {
    method: "POST",
  });

export const assignContractor = (projectId, contractorId) =>
  apiCall(`/contractors/assign/${projectId}?contractor_id=${contractorId}`, {
    method: "PUT",
  });
