import React from "react";
import { useAuth } from "../../Context/AuthContext";
import { useFetch } from "../../Hooks/useFetch";
import { listVehicles } from "../../API/client"; // implement to return { items: [...] }
import Loading from "../../Components/Loading";
import EmptyState from "../../Components/EmptyState";
import StatusBadge from "../../Components/StatusBadge";

export default function Vehicles() {
  const { user, loading: authLoading } = useAuth();
  if (authLoading) return <Loading label="Loading account…" />;
  if (user && user.role !== "DISPATCHER" && !import.meta.env.DEV) {
    return (
      <div className="cc-page">
        <div className="card">
          <div className="card-body">
            <h3 className="card-title">Access restricted</h3>
            <p className="card-subtitle">Dispatcher role required.</p>
          </div>
        </div>
      </div>
    );
  }

  const { data, loading } = useFetch(() => listVehicles(), []);

  return (
    <div className="cc-page space-y-6">
      <h1 className="cc-page-title">Vehicles</h1>

      {loading ? (
        <div className="card">
          <div className="card-body">Loading…</div>
        </div>
      ) : !data?.items?.length ? (
        <EmptyState title="No vehicles in the system." />
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="thead">
              <tr>
                <th className="th th-sortable">Vehicle</th>
                <th className="th">Type</th>
                <th className="th">Status</th>
                <th className="th">Notes</th>
              </tr>
            </thead>
            <tbody className="tbody">
              {data.items.map((v) => (
                <tr key={v.id} className="tr tr-striped row-hover">
                  <td className="td px-4 py-2">{v.name}</td>
                  <td className="td px-4 py-2">{v.type}</td>
                  <td className="td px-4 py-2">
                    <StatusBadge
                      status={(v.status || "CLOSED").toUpperCase()}
                    />
                  </td>
                  <td className="td px-4 py-2">{v.notes || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
