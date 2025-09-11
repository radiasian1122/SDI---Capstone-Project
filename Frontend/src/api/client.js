import axios from "axios";

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
   AUTH (kept as-is so your app compiles)
   If your backend uses different paths, tell me and I’ll adjust.
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
  return { items: data };
}

// POST /dispatches (create)
export async function createDispatch(payload) {
  // NOTE: Backend currently mounts this route at /dispatches/dispatches
  const { data } = await api.post("/dispatches/dispatches", payload);
  return data;
}

// GET /dispatches/uic/{uic}
export async function listDispatchesByUIC(uic, params) {
  const { data } = await api.get(`/dispatches/uic/${encodeURIComponent(uic)}`, {
    params,
  });
  return { items: data };
}

/* ======================
   USERS
   ====================== */

// GET /users
export async function listUsers(params) {
  const { data } = await api.get("/users", { params });
  return { items: data };
}

// GET /users/id/{id}  (DOD ID)
export async function getUserById(id) {
  const { data } = await api.get(`/users/id/${encodeURIComponent(id)}`);
  return data;
}

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
  const items = Array.isArray(data)
    ? data.map((v) => ({
        id: v.vehicle_id,
        name: `${v.uic.slice(4, 5)}-${v.bumper_no.replace(/[^a-zA-Z]/g, "")}-${v.bumper_no}`,
        type: String(v.platform_variant),
        status: v.deadlined ? "DEADLINED" : "FMC",
        // notes: v.notes || "",
      }))
    : [];
  return { items };
}

// GET /vehicles/id/{id}
export async function getVehicleById(id) {
  const { data } = await api.get(`/vehicles/id/${encodeURIComponent(id)}`);
  return data;
}

// // Vehicles
// export async function listVehicles() {
//   const { data } = await api.get(
//     "http://localhost:8080/docs/#/default/get_vehicles"
//   );
//   return data;
// }
// GET /vehicles/uic/{uic}
export async function listVehiclesByUIC(uic, params) {
  const { data } = await api.get(`/vehicles/uic/${encodeURIComponent(uic)}`, {
    params,
  });
  return data;
}

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

// Approvals flow isn’t defined in the new endpoints you shared.
// If you have approve/deny endpoints elsewhere, paste them and I’ll wire them.
// For now, leave these no-ops or point them to future routes:
export async function approveRequest(/* id */) {
  throw new Error(
    "approveRequest endpoint not available on backend. Provide path and I’ll wire it."
  );
}
export async function denyRequest(/* id */) {
  throw new Error(
    "denyRequest endpoint not available on backend. Provide path and I’ll wire it."
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
  listDispatchesByUIC,
  // users
  listUsers,
  getUserById,
  getUserQuals,
  // vehicles
  listVehicles,
  getVehicleById,
  listVehiclesByUIC,
  // shims
  createRequest,
  listRequests,
  approveRequest,
  denyRequest,
};

export default client;

// import axios from "axios";

// export const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
//   withCredentials: true,
// });

// // Interceptor for auth errors
// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err.response && err.response.status === 401) {
//       window.location.href = "/login";
//     }
//     return Promise.reject(err);
//   }
// );

// export async function login(email, password) {
//   const { data } = await api.post("/auth/login", { email, password });
//   return data;
// }

// export async function getMe() {
//   const { data } = await api.get("/me");
//   return data;
// }

// // Requests
// export async function createRequest(payload) {
//   const { data } = await api.post("/requests", payload);
//   return data;
// }

// export async function listRequests(params) {
//   const { data } = await api.get("/requests", { params });
//   return data;
// }

// export async function approveRequest(id) {
//   const { data } = await api.patch(`/requests/${id}/approve`);
//   return data;
// }

// export async function denyRequest(id) {
//   const { data } = await api.patch(`/requests/${id}/deny`);
//   return data;
// }

// // Dispatches
// export async function createDispatch(requestId, payload) {
//   const { data } = await api.post(`/requests/${requestId}/dispatch`, payload);
//   return data;
// }

// export async function checkoutDispatch(id) {
//   const { data } = await api.patch(`/dispatches/${id}/checkout`);
//   return data;
// }

// export async function checkinDispatch(id, payload) {
//   const { data } = await api.patch(`/dispatches/${id}/checkin`, payload);
//   return data;
// }

// // Vehicles
// export async function listVehicles() {
//   const { data } = await api.get("/vehicles");
//   return data;
// }
