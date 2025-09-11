import { useEffect, useState } from "react";
import StatusBadge from "./StatusBadge";

const api_url = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export default function DispatchCard({ dispatch, status }) {

  const [driver, setDriver] = useState(null)
  const [requestor, setRequestor] = useState(null)
  const [vehicle, setVehicle] = useState(null)

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
    .then(data => setVehicle(data))
    .catch(err => console.error(err.message))
  }, [dispatch.requestor_id, dispatch.driver_id, dispatch.vehicle_id])

  if (driver && requestor && vehicle){
    return (
      <div className="card">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <StatusBadge status={dispatch.approved ? 'APPROVED' : 'PENDING'} />
          </div>
          <div className="text-muted text-[13px] mt-1">
            <p>VEHICLE: {vehicle.bumper_no}</p>
            <p>DRIVER: {driver.last_name},{driver.first_name}</p>
            <p>DRIVER QUALIFICATIONS:</p>
            {driver.qualifications.map((qual) => {
                return <p>{qual}</p>
            })}
          </div>
          <button className="btn btn-primary">Approve</button>
          {dispatch.purpose && <div className="text-[13px] mt-1">{dispatch.purpose}</div>}
        </div>
      </div>
    );
  }
  else{
    return(
      <p>loading dispatches...</p>
    )
  }
}
