import { useEffect, useState, memo } from "react";
import StatusBadge from '../components/StatusBadge';
import { getDispatchStatus } from '../utils/dispatchStatus';

const api_url = import.meta.env.VITE_API_URL || 'http://localhost:8080'

function DashboardTile({ dispatch }){

  const [vehicle, setVehicle] = useState([])
  const [driver, setDriver] = useState([])
  const [requestor, setRequestor] = useState([])

  useEffect(() => {
    fetch(`${api_url}/users/id/${dispatch.requestor_id}`)
    .then(res => res.json())
    .then(data => setRequestor(data))
    .catch(err => console.error(err.message))

    fetch(`${api_url}/drivers/${dispatch.driver_id}`)
    .then(res => res.json())
    .then(data => setDriver(data[0]))
    .catch(err => console.error(err.message))

    fetch(`${api_url}/vehicles/id/${dispatch.vehicle_id}`)
    .then(res => res.json())
    .then(data => {
      setVehicle(data)
      fetch(`${api_url}/faults/${data.vehicle_id}`)
      .then(res => res.json())
      .then(data => setFaults(data))
      .catch(err => console.error(err))
    })
    .catch(err => console.error(err.message))

  }, [dispatch.requestor_id, dispatch.driver_id, dispatch.vehicle_id])

  return (
    <div className="grid gap-3">
        <div key={dispatch.dispatch_id} className="card">
          <div className="card-body">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>
                <strong>Vehicle: </strong>
                <span>{vehicle.bumper_no}</span>
              </span>
              <span>
                <strong>Requestor: </strong>
                <span>{requestor.last_name}, {requestor.first_name}</span>
              </span>
              <span>
                <strong>Driver: </strong>
                <span>{driver.last_name}, {driver.first_name}</span>
              </span>
              <StatusBadge status={getDispatchStatus(dispatch)} />
            </div>
            {dispatch.start_time !== null && dispatch.end_time !== null &&
              <div className="text-muted" style={{ fontSize: 13 }}>
                  {new Date(dispatch.start_time).toLocaleString()} → {new Date(dispatch.end_time).toLocaleString()}
              </div>
            }
            {(dispatch.start_time === null || dispatch.end_time === null) &&
              <div className="text-muted italic" style={{ fontSize: 13 }}>
                Pending date
              </div>
            }
          </div>
        </div>
    </div>
  );
}

export default memo(DashboardTile);