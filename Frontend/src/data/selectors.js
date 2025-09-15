// Shared selectors for business logic

// Returns a Set of driver IDs considered busy (any dispatch row)
export function getBusyDriverIds(dispatches = []) {
  return new Set(
    (dispatches || [])
      .map((d) => Number(d.driver_id))
      .filter((n) => Number.isFinite(n) && n > 0)
  );
}

// Returns eligible drivers for a vehicle, filtered by qualification, busy set, and form selections
export function getEligibleDrivers({
  vehicle,
  users,
  userQuals,
  busySet,
  selectedDriverIds,
}) {
  if (!vehicle) return [];
  const required = vehicle.qual_id;
  const selected = new Set((selectedDriverIds || []).map((n) => Number(n)));
  return (users || [])
    .filter((u) => (userQuals[u.dod_id] || []).includes(required))
    .filter((u) => !selected.has(Number(u.dod_id)))
    .filter((u) => !(busySet || new Set()).has(Number(u.dod_id)));
}

// Returns human-friendly Type strings for a driver's quals using vehicles list + bumper pattern
export function getDriverQualTypes({ driverId, driverQuals, vehicles }) {
  const ids = driverId ? driverQuals[driverId] || [] : [];
  const types = ids
    .map((qid) => {
      const v = (vehicles || []).find(
        (vv) => Number(vv.qual_id) === Number(qid)
      );
      const bumper = v?.bumper_no || "";
      const typeCode = String(bumper).replace(/[^a-zA-Z]/g, "");
      return typeCode || String(qid);
    })
    .filter(Boolean);
  return Array.from(new Set(types));
}
