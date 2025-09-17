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
import StatusBadge from "../components/StatusBadge";
import DashboardTile from "../components/DashboardTile";

const api_url = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Helper function to determine dispatch status
function getDispatchStatus(dispatch) {
  if (dispatch.approved === true) return 'APPROVED';
  if (dispatch.approved === false && dispatch.comments) return 'DENIED';
  return 'PENDING';
}

// Helper function to calculate time relationships
function getTimeCategory(dispatch) {
  const now = new Date();
  const startTime = dispatch.start_time ? new Date(dispatch.start_time) : null;
  const endTime = dispatch.end_time ? new Date(dispatch.end_time) : null;

  if (!startTime || !endTime) return { category: 'no-date', priority: 999 };

  if (startTime <= now && now <= endTime) {
    // Currently active - priority by remaining time (shorter remaining = higher priority)
    const remainingMs = endTime.getTime() - now.getTime();
    return { category: 'active', priority: remainingMs };
  } else if (startTime > now) {
    // Future - priority by closeness to start (closer = higher priority)
    const timeToStart = startTime.getTime() - now.getTime();
    return { category: 'future', priority: timeToStart };
  } else {
    // Past - priority by recency (more recent = higher priority)
    const timeSinceEnd = now.getTime() - endTime.getTime();
    return { category: 'past', priority: timeSinceEnd };
  }
}

// Comprehensive sorting function
function sortDispatches(dispatches) {
  return dispatches.sort((a, b) => {
    // Primary sort: Status (DENIED → PENDING → APPROVED)
    const statusA = getDispatchStatus(a);
    const statusB = getDispatchStatus(b);
    const statusOrder = { 'DENIED': 0, 'PENDING': 1, 'APPROVED': 2 };

    if (statusOrder[statusA] !== statusOrder[statusB]) {
      return statusOrder[statusA] - statusOrder[statusB];
    }

    // Secondary sort: Date logic within same status
    const timeA = getTimeCategory(a);
    const timeB = getTimeCategory(b);

    // Same category, sort by priority
    if (timeA.category === timeB.category) {
      return timeA.priority - timeB.priority;
    }

    // Different categories: active → future → past → no-date
    const categoryOrder = { 'active': 0, 'future': 1, 'past': 2, 'no-date': 3 };
    return categoryOrder[timeA.category] - categoryOrder[timeB.category];
  });
}

export default function Dashboard() {
  const [dataLoading, setDataLoading] = useState(true);
  const [dispatches, setDispatches] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const { user, loading: authLoading } = useAuth();
  const { dispatchId } = useContext(VehiclesContext);

  // TODO - Filter by role once auth is implemented
  useEffect(() => {
    fetch(`${api_url}/dispatches`)

    .then(res => res.json())
    .then(data => {
      if (user.role === 'DISPATCHER'){
        setDispatches(data)
      }
      else if(user.role === 'DRIVER'){
        setDispatches(
          data.filter(dispatch => dispatch.requestor_id == user.dod_id)
        )
      }
      else{
        setDispatches([])
      }
    })
    .catch(err => console.log(err.message))
  }, [user.dod_id, user.role])

  useEffect(() => {
    if (dispatches.length === 0) {
      setDataLoading(false);
    }
  }, [dispatches]);

  ////// TODO - refactor when auth is implemented //////

  // 1) Wait for auth to resolve (both dev & prod)
  if (authLoading) return <Loading label="Loading account…" />;

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
  const IMAGES = [
    "/media/1.png",
    "/media/2.png",
    "/media/3.png",
    "/media/4.png",
    "/media/5.png",
  ];

  // Filter and sort dispatches
  const sortedDispatches = useMemo(() => {
    return sortDispatches([...dispatches]);
  }, [dispatches]);

  const filteredDispatches = useMemo(() => {
    if (activeTab === 'ALL') return sortedDispatches;
    return sortedDispatches.filter(dispatch => getDispatchStatus(dispatch) === activeTab);
  }, [sortedDispatches, activeTab]);

  const tabs = ['ALL', 'DENIED', 'PENDING', 'APPROVED'];

  const getTabCount = (status) => {
    if (status === 'ALL') return dispatches.length;
    return dispatches.filter(dispatch => getDispatchStatus(dispatch) === status).length;
  };

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

        <h1 className="cc-page-title">Dashboard</h1>

        {/* Tab Navigation */}
        <div className="cc-actionbar">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
              >
                {tab} ({getTabCount(tab)})
              </button>
            ))}
          </div>
        </div>

        {/* Dispatch List */}
        {filteredDispatches.length > 0 ? (
          filteredDispatches.map((dispatch) => (
            <div key={dispatch.dispatch_id} className="add-margin">
              <DashboardTile dispatch={dispatch} />
            </div>
          ))
        ) : (
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">No {activeTab.toLowerCase()} dispatches</h3>
              <p className="card-subtitle">
                {activeTab === 'ALL'
                  ? 'No dispatches found for your role.'
                  : `No ${activeTab.toLowerCase()} dispatches at this time.`
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
