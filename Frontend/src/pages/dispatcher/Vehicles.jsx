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

  const api_url = 'http://localhost:8080'

  const [vehicles, setVehicles] = useState([])
  const [vehicleFaults, setVehicleFaults] = useState([])

  useEffect(() => {
    fetch(`${api_url}/vehicles`)
      .then((data) => data.json())
      .then((json) => {
        setVehicles(json);
      });
  }, []);

  useEffect(() => {
    vehicles.forEach((vehicle) => {
      fetch(`${api_url}/faults/${vehicle.vehicle_id}`)
      .then(res => res.json())
      .then(faults => {
        let vehicleFaultsObj = {
          vehicle_id: vehicle.vehicle_id,
          faults: []
        }
        if(faults.length > 0){
          faults.forEach((fault) => {
            vehicleFaultsObj.faults.push(fault)
          })
        }
        setVehicleFaults((prev) => [...prev, vehicleFaultsObj])
      })
    })
  }, [vehicles])

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

  function handleBumperNumbers(id) {
    if (dispatchId.includes(id)) {
      let newArray = dispatchId.filter((vic) => vic != id);
      setDispatchId(newArray);
      return;
    }
    setDispatchId((prev) => [...prev, id]);
  }

  return (
    <div className="cc-page space-y-6">
      <h1 className="cc-page-title">Vehicles</h1>
      <div className="vehicles-container">
        <table className="table">
          <thead className="thead">
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
              <th scope="col">Faults</th>
            </tr>
          </thead>
          <tbody className="tbody">
            {vehicles.map((vehicle) => (
              <tr key={vehicle.vehicle_id ?? vehicle.bumper_no} className="tr tr-striped row-hover">
                <td className="td px-4 py-2">
                  {vehicle.bumper_no.replace(/[^a-zA-Z]/g, "")}
                </td>
                <td className="td px-4 py-2">{vehicle.bumper_no}</td>
                <td className="td px-4 py-2">{vehicle.uic.slice(4, 5)}</td>
                <td className="td px-4 py-2">
                  {vehicle.deadlined ? "Deadlined" : "FMC"}
                </td>
                <td className="td px-4 py-2">
                  <ul>
                    {vehicleFaults.map((faultsObj) => {
                      if (faultsObj.vehicle_id == vehicle.vehicle_id){
                        if (faultsObj.faults.length > 0){
                          return faultsObj.faults.map(fault => {
                            console.log(fault.fault_description)
                            return <li>{fault.fault_description}</li>
                          })
                        }
                        else{
                          return <li className="italic">NO FAULTS</li>
                        }
                      }
                    })}
                  </ul>
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
