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
import DashboardTile from '../components/DashboardTile'

const api_url = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export default function Dashboard() {
  const [dataLoading, setDataLoading] = useState(true)
  const [dispatches, setDispatches] = useState([])
  const { user, loading: authLoading } = useAuth();
  const { dispatchId } = useContext(VehiclesContext);


  // TODO - Filter by role once auth is implemented
  useEffect(() => {
    fetch(`${api_url}/dispatches`)
    .then(res => res.json())
    .then(data => {
      if (user.role === 'APPROVER'){
        setDispatches(data)
      }
      else if(user.role === 'DRIVER'){
        setDispatches(
          data.filter(dispatch => dispatch.requestor_id === user.dod_id)
        )
      }
      else{
        setDispatches([])
      }
    })
    .catch(err => console.log(err.message))
  }, [user.dod_id, user.role])

  useEffect(() => {
    if(dispatches.length === 0){
      setDataLoading(false)
    }
  }, [dispatches])

  ////// TODO - refactor when auth is implemented //////

  // 1) Wait for auth to resolve (both dev & prod)
  if (authLoading) return <Loading label="Loading account…" />;

  console.log(`USER: ${user.first_name}`)

  // 3) If no role in prod, show friendly message
  if (!user.role) {
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

  const firstName = user?.first_name || user?.name || "User";
  const IMAGES = ["/media/1.png", "/media/2.png", "/media/3.png", "/media/4.png", "/media/5.png"];

  return (
    <div>
      <BackgroundSlideshow
        images={IMAGES}
        intervalMs={6000}
        fadeMs={800}
        dim={0.25}
      />
      <div
        className="cc-page space-y-6"
        style={{ position: "relative", zIndex: 1 }}
      >
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
        {dispatches.length > 0 && dispatches.map((dispatch) => {
          return <DashboardTile dispatch={dispatch}/>
        })}
      </div>
    </div>
  )
}
