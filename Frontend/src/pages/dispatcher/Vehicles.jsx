import React from "react";
import { useAuth } from "../../context/AuthContext";
import Loading from "../../components/Loading";
import StatusBadge from "../../components/StatusBadge";
import { useEffect, useState, useContext } from "react";
import { VehiclesContext } from "../../context/VehiclesContext";

export default function Vehicles() {
  const api_url = "http://localhost:8080";

  const [vehicles, setVehicles] = useState([]);
  const [vehicleFaults, setVehicleFaults] = useState([]);

  const [sortAsc, setSortAsc] = useState(true);
  const [sortColumn, setSortColumn] = useState(null);

  const sortedVehicles = React.useMemo(() => {
    if (!sortColumn) return vehicles;
    const copy = [...vehicles];
    const getValue = (v) => {
      switch (sortColumn) {
        case "type":
          return v.bumper_no?.startsWith("1.1")
            ? v.bumper_no.slice(0, 3)
            : (v.bumper_no || "").replace(/[^a-zA-Z]/g, "");
        case "callsign":
          return v.bumper_no || "";
        case "company":
          return v.uic?.slice(4, 5) || "";
        case "status":
          return v.deadlined ? "Deadlined" : "FMC";
        default:
          return "";
      }
    };
    copy.sort((a, b) => {
      const A = getValue(a);
      const B = getValue(b);
      if (A < B) return sortAsc ? -1 : 1;
      if (A > B) return sortAsc ? 1 : -1;
      return 0;
    });
    return copy;
  }, [vehicles, sortColumn, sortAsc]);

  useEffect(() => {
    fetch(`${api_url}/vehicles`)
      .then((data) => data.json())
      .then((json) => {
        setVehicles(json || []);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    // reset faults when vehicles change
    setVehicleFaults([]);
    vehicles.forEach((vehicle) => {
      fetch(`${api_url}/faults/${vehicle.vehicle_id}`)
        .then((res) => res.json())
        .then((faults) => {
          let vehicleFaultsObj = {
            vehicle_id: vehicle.vehicle_id,
            faults: Array.isArray(faults) ? faults : [],
          };
          setVehicleFaults((prev) => [...prev, vehicleFaultsObj]);
        })
        .catch(() => {
          setVehicleFaults((prev) => [
            ...prev,
            { vehicle_id: vehicle.vehicle_id, faults: [] },
          ]);
        });
    });
  }, [vehicles]);

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

  function handleOrder(column) {
    // if clicking same column, toggle direction; otherwise set new column asc
    if (sortColumn === column) {
      setSortAsc((prev) => !prev);
    } else {
      setSortColumn(column);
      setSortAsc(true);
    }
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
              <th
                className="th th-sortable"
                scope="col"
                onClick={() => handleOrder("type")}
                style={{ cursor: "pointer" }}
              >
                Type
              </th>
              <th
                className="th th-sortable"
                scope="col"
                onClick={() => handleOrder("callsign")}
                style={{ cursor: "pointer" }}
              >
                Callsign
              </th>
              <th
                className="th th-sortable"
                scope="col"
                onClick={() => handleOrder("company")}
                style={{ cursor: "pointer" }}
              >
                Company
              </th>
              <th
                scope="col"
                onClick={() => handleOrder("status")}
                style={{ cursor: "pointer" }}
              >
                Status
              </th>
              <th scope="col">Faults</th>
            </tr>
          </thead>
          <tbody className="tbody">
            {sortedVehicles.map((vehicle) => (
              <tr
                key={vehicle.vehicle_id ?? vehicle.bumper_no}
                className="tr tr-striped row-hover"
              >
                <td className="td px-4 py-2">
                  {vehicle.bumper_no?.startsWith("1.1")
                    ? vehicle.bumper_no.slice(0, 3)
                    : (vehicle.bumper_no || "").replace(/[^a-zA-Z]/g, "")}
                </td>
                <td className="td px-4 py-2">{vehicle.bumper_no}</td>
                <td className="td px-4 py-2">{vehicle.uic?.slice(4, 5)}</td>
                <td className="td px-4 py-2">
                  {vehicle.deadlined ? "Deadlined" : "FMC"}
                </td>
                <td className="td px-4 py-2">
                  <ul>
                    {vehicleFaults.map((faultsObj) => {
                      if (faultsObj.vehicle_id == vehicle.vehicle_id) {
                        if (faultsObj.faults.length > 0) {
                          return faultsObj.faults.map((fault, idx) => (
                            <li key={fault.fault_id ?? idx}>
                              {fault.fault_description}
                            </li>
                          ));
                        } else {
                          return <li className="italic">NO FAULTS</li>;
                        }
                      }
                      return null;
                    })}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
