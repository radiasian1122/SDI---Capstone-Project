import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
});

// Interceptor for auth errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export async function login(email, password) {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
}

export async function getMe() {
  const { data } = await api.get("/me");
  return data;
}

// Requests
export async function createRequest(payload) {
  const { data } = await api.post("/requests", payload);
  return data;
}

export async function listRequests(params) {
  const { data } = await api.get("/requests", { params });
  return data;
}

export async function approveRequest(id) {
  const { data } = await api.patch(`/requests/${id}/approve`);
  return data;
}

export async function denyRequest(id) {
  const { data } = await api.patch(`/requests/${id}/deny`);
  return data;
}

// Dispatches
export async function createDispatch(requestId, payload) {
  const { data } = await api.post(`/requests/${requestId}/dispatch`, payload);
  return data;
}

export async function checkoutDispatch(id) {
  const { data } = await api.patch(`/dispatches/${id}/checkout`);
  return data;
}

export async function checkinDispatch(id, payload) {
  const { data } = await api.patch(`/dispatches/${id}/checkin`, payload);
  return data;
}

// Vehicles
export async function listVehicles() {
  const { data } = await api.get("/vehicles");
  return data;
}
