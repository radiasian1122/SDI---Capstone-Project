import axios from "axios";
import { mapVehicle, mapUser, mapDispatch } from "./mappers";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const AUTH_MODE = import.meta.env.VITE_AUTH_MODE;
const WITH_CREDS = AUTH_MODE === "cookie"; // only send cookies in cookie-auth mode

/**
 * Axios instance
 * - Credentials only when AUTH_MODE=cookie
 * - Simple 401 redirect to /login (kept as-is)
 */
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: WITH_CREDS,
  headers: { "Content-Type": "application/json" },
});

// 401 -> /login (keep your current behavior)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      if (!/\/login$/.test(window.location.pathname)) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

/* ======================
   AUTH (kept as-is so app compiles)
   ====================== */

export async function login(emailOrObj, password) {
  // Accept either (email, password) or ({ email, password })
  const body =
    typeof emailOrObj === "object" && emailOrObj !== null
      ? emailOrObj
      : { email: emailOrObj, password };
  const { data } = await api.post("/auth/login", body);
  return data;
}
//TODO tie in the auth endpoint to validate users
export async function getMe() {
  // If your backend exposes /auth/me instead of /me, change this path
  const { data } = await api.get("/me");
  return data;
}

/* ======================
   DISPATCHES
   ====================== */

// GET /dispatches (all)
export async function listDispatches(params) {
  const { data } = await api.get("/dispatches", { params });
  const items = Array.isArray(data)
    ? data.map(mapDispatch).filter(Boolean)
    : [];
  return { items };
}

// POST /dispatches (create)
export async function createDispatch(payload) {
  // Try nested path first, then fall back. This tolerates either
  // router style: app.use('/dispatches', router.post('/', ...))
  // or: app.use('/dispatches', router.post('/dispatches', ...))
  try {
    const { data } = await api.post("/dispatches/dispatches", payload);
    return data;
  } catch (e) {
    if (e?.response?.status === 404) {
      const { data } = await api.post("/dispatches", payload);
      return data;
    }
    throw e;
  }
}

// GET /dispatches/uic/{uic}
// (removed) listDispatchesByUIC — not used by frontend

/* ======================
   USERS
   ====================== */

// GET /users
export async function listUsers(params) {
  const { data } = await api.get("/users", { params });
  const items = Array.isArray(data) ? data.map(mapUser).filter(Boolean) : [];
  return { items };
}

// GET /users/id/{id}  (DOD ID)
// (removed) getUserById — not used by frontend

// GET /users/id/{id}/qual
export async function getUserQuals(id) {
  const { data } = await api.get(`/users/id/${encodeURIComponent(id)}/qual`);
  return data;
}

/* ======================
   VEHICLES
   ====================== */

// GET /vehicles
export async function listVehicles(params) {
  const { data } = await api.get("/vehicles", { params });
  const items = Array.isArray(data) ? data.map(mapVehicle).filter(Boolean) : [];
  return { items };
}

export async function listFaults(params) {
  const { data } = await api.get("/faults", { params });
  const items = Array.isArray(data) ? data.map(mapFaults).filter(Boolean) : [];
  return { items };
}
// fetch(`${api_url}/vehicles/id/${dispatch.vehicle_id}`)
//   .then(res => res.json())
//   .then(data => {
//     setVehicle(data)
//     fetch(`${api_url}/faults/${data.vehicle_id}`)
//     .then(res => res.json())
//     .then(data => setFaults(data))
//     .catch(err => console.error(err))
//   })
//   .catch(err => console.error(err.message))

// (removed) getVehicleById — not used by frontend

// Vehicles
// (removed) listVehiclesByUIC — not used by frontend

/* ======================
   COMPAT SHIMS (optional)
   If you still have old calls in the UI referencing “requests”,
   map them to the closest “dispatches” operations to avoid breakage.
   Remove once the UI is updated.
   ====================== */

export async function createRequest(payload) {
  // Was: POST /requests
  return createDispatch(payload);
}

export async function listRequests(params) {
  // Was: GET /requests
  return listDispatches(params);
}

// Approvals flow isn’t defined in endpoints.
// For now, leave these no-ops or point them to future routes:
export async function approveRequest(/* id */) {
  throw new Error(
    "approveRequest endpoint not available on backend. Build endpoint path"
  );
}
export async function denyRequest(/* id */) {
  throw new Error(
    "denyRequest endpoint not available on backend. Build endpoint path"
  );
}

/* ======================
   EXPORT BUNDLE (optional)
   ====================== */

const client = {
  api,
  // auth
  login,
  getMe,
  // dispatches
  listDispatches,
  createDispatch,
  // users
  listUsers,
  getUserQuals,
  // vehicles
  listVehicles,
  listFaults,
  // shims
  createRequest,
  listRequests,
  approveRequest,
  denyRequest,
};

export default client;
