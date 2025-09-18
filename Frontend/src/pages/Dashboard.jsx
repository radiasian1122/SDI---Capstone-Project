// src/pages/Dashboard.jsx
import { useMemo, useEffect, useState, useContext } from "react";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";
import DevRoleSwitcher from "../components/DevRoleSwitcher";
import BackgroundSlideshow from "../components/BackgroundSlideshow";
import DashboardTile from "../components/DashboardTile";
import { getDispatchStatus, sortDispatches } from "../utils/dispatchStatus";

const api_url = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function Dashboard() {
  const [dispatches, setDispatches] = useState([]);
  const [activeTab, setActiveTab] = useState("ALL");
  const { user, loading: authLoading } = useAuth();

  // Filter and sort dispatches - moved before early returns to fix hooks rule
  const sortedDispatches = useMemo(() => {
    return sortDispatches([...dispatches]);
  }, [dispatches]);

  const filteredDispatches = useMemo(() => {
    if (activeTab === "ALL") return sortedDispatches;
    return sortedDispatches.filter(
      (dispatch) => getDispatchStatus(dispatch) === activeTab
    );
  }, [sortedDispatches, activeTab]);

  const tabs = ["ALL", "DENIED", "PENDING", "APPROVED"];

  const getTabCount = (status) => {
    if (status === "ALL") return dispatches.length;
    return dispatches.filter(
      (dispatch) => getDispatchStatus(dispatch) === status
    ).length;
  };

  // TODO - Filter by role once auth is implemented
  useEffect(() => {
    fetch(`${api_url}/dispatches`)
      .then((res) => res.json())
      .then((data) => {
        if (user.role === "DISPATCHER") {
          setDispatches(data);
        } else if (user.role === "DRIVER") {
          setDispatches(
            data.filter((dispatch) => dispatch.requestor_id == user.dod_id)
          );
        } else {
          setDispatches([]);
        }
      })
      .catch((err) => console.log(err.message));
  }, [user.dod_id, user.role]);

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

  const IMAGES = [
    "/media/1.png",
    "/media/2.png",
    "/media/3.png",
    "/media/4.png",
    "/media/5.png",
  ];

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
            {tabs.map((tab) => {
              let tabStyle;
              switch (tab) {
                case "ALL":
                  tabStyle = "btn-primary";
                  break;
                case "PENDING":
                  tabStyle = "state-PENDING";
                  break;
                case "DENIED":
                  tabStyle = "state-DENIED";
                  break;
                case "APPROVED":
                  tabStyle = "state-APPROVED";
                  break;
              }

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`btn ${activeTab === tab ? tabStyle : "btn-secondary"}`}
                >
                  {tab} ({getTabCount(tab)})
                </button>
              );
            })}
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
              <h3 className="card-title">
                No {activeTab.toLowerCase()} dispatches
              </h3>
              <p className="card-subtitle">
                {activeTab === "ALL"
                  ? "No dispatches found for your role."
                  : `No ${activeTab.toLowerCase()} dispatches at this time.`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
