import { useEffect, useState, memo, useContext } from "react";
import StatusBadge from '../components/StatusBadge';
import { getDispatchStatus } from '../utils/dispatchStatus';
import { ToastCtx } from "./ToastProvider";
import { useAuth } from "../context/AuthContext";

const api_url = import.meta.env.VITE_API_URL || 'http://localhost:8080'

function DashboardTile({ dispatch }){
  const { showToast } = useContext(ToastCtx) || { showToast: () => {} };
  const { user, loading: authLoading } = useAuth();

  const [vehicle, setVehicle] = useState([])
  const [driver, setDriver] = useState([])
  const [requestor, setRequestor] = useState([])
  const [showComments, setShowComments] = useState(false)

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
                <span>{requestor?.last_name}, {requestor?.first_name}</span>
              </span>
              <span>
                <strong>Driver: </strong>
                <span>{driver?.last_name}, {driver?.first_name}</span>
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

            {dispatch.comments &&
              <button
                className="btn btn-secondary"
                onClick={() => setShowComments(!showComments)}
              >
              {showComments ? "Hide Comments" : "Show Comments"}
              </button>
            }

            {showComments &&
            <div className="text-muted add-margin" style={{ fontSize: 13 }}>
                <span className="italic"><strong>Comments:</strong> </span> <span>{dispatch.comments}</span>
            </div>

            }
          </div>
        </div>
        { getDispatchStatus(dispatch) === 'DENIED' && user.role === 'DRIVER' &&
          <button
            className="btn btn-primary w-[500px] justify-self-center"
            onClick={() => {
              fetch(`${api_url}/dispatches/${dispatch.dispatch_id}`, {
                method: 'DELETE'
              })
              .then(res => {
                if (res.ok){
                  showToast("Denied dispatch was acknowledged. Please re-submit.", "error");
                  return;
                }
                else{
                  showToast("Something went wrong. Please try again.", "error");
                  return res.json();
                }
              })
              .then(data => {
                if(data){
                  console.log(data)
                }
              })
              .catch(err => {
                console.error(err.message)
                showToast("Something went wrong. Please try again.", "error");
              })
            }}
          >ACKNOWLEDGE DENIED REQUEST</button>
        }
    </div>
  );
}

export default memo(DashboardTile);