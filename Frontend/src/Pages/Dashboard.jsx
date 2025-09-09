import React, { useMemo } from "react";
import { useAuth } from "../Context/AuthContext";
import { listRequests } from "../API/client";
import { useFetch } from "../Hooks/useFetch";

export default function Dashboard() {
  const { user } = useAuth();

  const params = useMemo(() => {
    if (user.role === "DRIVER") return { mine: true };
    if (user.role === "APPROVER") return { status: "PENDING" };
    return { status: "OUT" }; // dispatcher: show active
  }, [user.role]);

  const { data, loading } = useFetch(() => listRequests(params), [user.role]);

  return (
    <div style={{ padding: 16 }}>
      <h2>Dashboard</h2>
      <p>Welcome back, {user.first_name}.</p>

      {loading && <div>Loading...</div>}

      {!loading && (
        <div style={{ display: "grid", gap: 12 }}>
          {data?.items?.length ? (
            data.items.map((r) => (
              <div
                key={r.id}
                style={{
                  border: "1px solid #eee",
                  padding: 12,
                  borderRadius: 8,
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <strong>{r.destination}</strong>
                  <StatusBadge status={r.status} />
                </div>
                <div style={{ fontSize: 13, color: "#555" }}>
                  {new Date(r.start_time).toLocaleString()} →{" "}
                  {new Date(r.end_time).toLocaleString()}
                </div>
                <div style={{ fontSize: 13 }}>{r.purpose}</div>
              </div>
            ))
          ) : (
            <div>No items to show.</div>
          )}
        </div>
      )}
    </div>
  );
}
