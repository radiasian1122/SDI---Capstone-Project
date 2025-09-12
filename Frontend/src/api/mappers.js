// Normalizers for API rows -> app models

export function mapVehicle(v) {
  if (!v) return null;
  const uic = String(v.uic || "");
  const bumper = String(v.bumper_no || "");
  const typeCode = bumper.replace(/[^a-zA-Z]/g, "");
  return {
    id: v.vehicle_id,
    uic,
    company: typeof uic === "string" ? uic.slice(4, 5) : "",
    bumper_no: bumper,
    name: `${uic}-${bumper}`,
    qual_id: v.platform_variant,
    type: String(v.platform_variant),
    typeCode,
    status: v.deadlined ? "DEADLINED" : "FMC",
  };
}

export function mapUser(u) {
  if (!u) return null;
  return {
    dod_id: u.dod_id,
    first_name: u.first_name,
    last_name: u.last_name,
    uic: u.uic,
    username: u.username,
  };
}

export function mapDispatch(d) {
  if (!d) return null;
  return {
    id: d.dispatch_id ?? d.id,
    dispatch_id: d.dispatch_id ?? d.id,
    requestor_id: d.requestor_id,
    driver_id: d.driver_id,
    vehicle_id: d.vehicle_id,
    approved: Boolean(d.approved),
    start_time: d.start_time,
    end_time: d.end_time,
    purpose: d.purpose,
  };
}

