import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useFetch } from "../../hooks/useFetch";
import { listVehicles } from "../../api/client"; // implement to return { items: [...] }
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";
import { useEffect, useState, useContext } from "react";
import { VehiclesContext } from "../../context/VehiclesContext";

export default function Vehicles() {
  const { user, loading: authLoading } = useAuth();
  const { dispatchId, setDispatchId } = useContext(VehiclesContext);
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

  // const { loading } = useFetch(() => listVehicles(), []);

  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/vehicles")
      .then((data) => data.json())
      .then((json) => {
        setVehicles(json);
      });
  }, []);

  function handleBumperNumbers(num) {
    if (dispatchId.includes(num)) {
      let newArray = dispatchId.filter((vic) => vic != num);
      setDispatchId(newArray);
      return;
    }
    setDispatchId((prev) => [...prev, num]);
  }

  return (
    <div className="cc-page space-y-6">
      <h1 className="cc-page-title">Vehicles</h1>
      <div className="vehicles-container">
        <table>
          <thead>
            <tr>
              <th className="th th-sortable" scope="col">
                Type
              </th>
              <th className="th th-sortable" scope="col">
                Callsign
              </th>
              <th className="th th-sortable" scope="col">
                Company
              </th>
              <th scope="col">Status</th>
              <th scope="col">Check Box to Add</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr>
                <td className="td px-4 py-2">
                  {vehicle.bumper_no.replace(/[^a-zA-Z]/g, "")}
                </td>
                <td className="td px-4 py-2">{vehicle.bumper_no}</td>
                <td className="td px-4 py-2">{vehicle.uic.slice(4, 5)}</td>
                <td className="td px-4 py-2">
                  {vehicle.deadlined ? "Deadlined" : "FMC"}
                </td>
                <td className="td px-4 py-2">
                  <input
                    type="checkbox"
                    onChange={() => handleBumperNumbers(vehicle)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* {loading ? (
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
      )} */}
    </div>
  );
}
