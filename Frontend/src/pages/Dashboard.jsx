// src/pages/Dashboard.jsx
import { useMemo, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { listRequests } from "../api/client";
import { useFetch } from "../hooks/useFetch";
import Loading from "../components/Loading";
import SkeletonList from "../components/SkeletonList";
import EmptyState from "../components/EmptyState";
import DevRoleSwitcher from "../components/DevRoleSwitcher";
import BackgroundSlideshow from "../components/BackgroundSlideshow";
import { VehiclesContext } from "../context/VehiclesContext";
import { useContext } from "react";
import StatusBadge from '../components/StatusBadge'

const api_url = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export default function Dashboard() {
  const [dataLoading, setDataLoading] = useState(true)
  const [data, setData] = useState([])
  const { user, loading: authLoading } = useAuth();
  const { dispatchId } = useContext(VehiclesContext);

  useEffect(() => {
    fetch(`${api_url}/dispatches`)
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err => console.error(err))
  }, [])

  useEffect(() => {
    if(data.length){
      setDataLoading(false)
    }
  }, [data])


  ////// TODO - refactor when auth is implemented //////

  // 1) Wait for auth to resolve (both dev & prod)
  if (authLoading) return <Loading label="Loading account…" />;

  // 2) Resolve a safe role (dev default if needed)
  const role =
    user?.role ??
    (import.meta.env.DEV
      ? localStorage.getItem("dev-role") || "DISPATCHER"
      : null);

  // 3) If no role in prod, show friendly message
  if (!role) {
    return (
      <div className="cc-page">
        <div className="card">
          <div className="card-body">
            <h3 className="card-title">Signed out</h3>
            <p className="card-subtitle">
              Please log in to view the dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 4) Build params now that role is known
  // const params = useMemo(() => {
  //   if (role === "DRIVER") return { mine: true };
  //   if (role === "APPROVER") return { status: "PENDING" };
  //   return { status: "OUT" }; // DISPATCHER: show active
  // }, [role]);


  const firstName = user?.first_name || user?.name || "User";
  const IMAGES = ["/media/1.png", "/media/2.png", "/media/3.png", "/media/4.png", "/media/5.png"];

  console.log(data)
  return (
    <div>
      <BackgroundSlideshow images={IMAGES} intervalMs={6000} fadeMs={800} dim={0.25} />
      <div className="cc-page space-y-6" style={{ position: "relative", zIndex: 1 }}>
        {/* Dev-only role switcher */}
        {import.meta.env.DEV && <DevRoleSwitcher />}

        {/* Dev-only welcome/role copy (for UI testing) */}
        {import.meta.env.DEV && (
          <div className="card">
            <div className="card-body flex items-center gap-2">
              <span className="card-subtitle">Welcome back, {firstName}.</span>
              {user?.role && <span className="badge">{user.role}</span>}
            </div>
          </div>
        )}

        <h1 className="cc-page-title">Dashboard</h1>

      {/* Content */}
        {dataLoading ? (
        <SkeletonList rows={4} />
        ) : (
          <div className="grid gap-3">
            {data.length !== 0 ? (
              data.map((dispatch) => (
                <div key={dispatch.dispatch_id} className="card">
                  <div className="card-body">
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <strong>{dispatch.dispatch_id}</strong>
                      {dispatch.approved && <StatusBadge status={'APPROVED'} />}
                      {!dispatch.approved && <StatusBadge status={'PENDING'} />}
                    </div>
                    <div className="text-muted" style={{ fontSize: 13 }}>
                      {new Date(dispatch.start_time).toLocaleString()} → {new Date(dispatch.end_time).toLocaleString()}
                    </div>
                    <div style={{ fontSize: 13 }}>{dispatch.purpose}</div>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState title="No requests match your filters." />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
