## 1. Users (App Accounts & Roles)
- **id** (pk)
- **dod_id** (unique)
- **rank**, **first_name**, **last_name**
- **unit**, **platoon**, **phone**, **email**
- **role** (enum: driver, dispatcher, motor_sgt, viewer, admin)
- **is_active** (bool)

## 2. Licenses (OF-346 + Endorsements)
- **id** (pk)
- **user_id** (fk → users)
- **license_number**, **issue_date**, **expiration_date**
- **endorsements** (text[]; e.g., HMMWV, LMTV, HET, FLA)
- **restrictions** (text), **suspended** (bool), **remarks**

## 3. Vehicle Types
- **id** (pk)
- **nsn** (nullable)
- **code** (e.g., M1151), **name** (HMMWV), **class** (wheeled/track)
- **required_endorsement** (text)
- **fuel_type** (enum: F24, Diesel, Gas, etc.)
- **service_interval_miles**, **service_interval_hours**

## 4. Vehicles
- **id** (pk)
- **bumper_number** (unique), **vin_sn**, **registration_number**
- **vehicle_type_id** (fk → vehicle_types)
- **unit**, **location** (motorpool/bldg)
- **status** (enum: FMC, PMC, NMC, DD)
- **odometer_miles**, **engine_hours**
- **last_service_at_miles**, **last_service_at_hours**, **last_service_date**
- **bii_coei_complete** (bool), **remarks**

## 5. Mission Requests (Request Before Dispatch)
- **id** (pk)
- **requested_by_id** (fk → users), **submitted_at**
- **purpose** (text), **priority** (enum: routine, priority, immediate)
- **pax_count**, **cargo_desc**
- **origin_name**, **origin_coords** (point), **dest_name**, **dest_coords** (point)
- **earliest_start**, **latest_end**
- **required_vehicle_type_id** (fk → vehicle_types, nullable)
- **special_equipment** (text), **notes**
- **status** (enum: pending, approved, denied, cancelled)

## 6. Approvals
- **id** (pk)
- **mission_request_id** (fk)
- **approver_id** (fk → users)
- **decision** (enum: approved, denied)
- **decided_at**, **remarks**

## 7. Dispatches (The DA 5987-E Core)
- **id** (pk)
- **mission_request_id** (fk, nullable), **vehicle_id** (fk)
- **driver_id** (fk → users), **a_driver_id** (fk → users, nullable)
- **Out:** time_out, odometer_out, fuel_level_out (0–100), pmcs_before_ok (bool)
- **In:** time_in, odometer_in, fuel_level_in, pmcs_after_ok (bool)
- **route_summary** (text), **miles_driven** (generated or computed on close)
- **dispatcher_id** (fk → users), **approving_official_id** (fk → users, nullable)
- **status** (enum: scheduled, enroute, closed, aborted)
- **remarks**

## 8. Trip Stops (Optional but Useful)
- **id** (pk)
- **dispatch_id** (fk)
- **seq** (int), **name**, **coords** (point), **arrived_at**, **departed_at**

## 9. Fuel Issues
- **id** (pk)
- **dispatch_id** (fk), **vehicle_id** (fk)
- **issued_at**, **source** (e.g., bulk, card), **quantity_liters**, **cost** (numeric)
- **receipt_number** (text), **odometer_at_issue**

## 10. Inspections (PMCS/Before/After/Weekly)
- **id** (pk)
- **vehicle_id** (fk), **inspector_id** (fk → users)
- **type** (enum: before, after, weekly, semiannual, corrective)
- **performed_at**, **pass** (bool), **overall_status** (FMC/PMC/NMC)
- **notes**

## 11. Faults (Linked to Inspection or Maintenance Ticket)
- **id** (pk)
- **vehicle_id** (fk), **inspection_id** (fk nullable)
- **fault_code** (text), **description**, **deadline** (date, if deadline fault)
- **nmc** (bool), **reported_by_id** (fk → users), **reported_at**
- **status** (enum: open, in_progress, deferred, closed)

## 12. Maintenance Work Orders
- **id** (pk)
- **vehicle_id** (fk)
- **fault_id** (fk nullable), **opened_at**, **closed_at** (nullable)
- **type** (enum: scheduled, unscheduled)
- **actions_taken** (text), **parts_used** (jsonb), **shop** (text)
- **restored_status** (enum: FMC, PMC, NMC), **notes**

## 13. Accidents/Incidents (If You Need It)
- **id** (pk)
- **dispatch_id** (fk), **vehicle_id** (fk)
- **occurred_at**, **location** (text/point), **severity** (enum), **description**
- **injuries** (text), **police_report_number** (text), **attachments** (jsonb)

## 14. Attachments (File Metadata, S3/GCS URL)
- **id** (pk)
- **entity_type** (enum: vehicle, dispatch, inspection, accident, work_order)
- **entity_id** (uuid/int), **filename**, **mime_type**, **size_bytes**, **url**, **uploaded_by_id**, **uploaded_at**

## 15. Audit Log (Who Did What)
- **id** (pk)
- **actor_id** (fk → users), **action** (text/enum), **entity_type**, **entity_id**, **at**, **diff** (jsonb)

---

### Helpful Constraints & Indexes

- **Unique:** vehicles.bumper_number, users.dod_id, (licenses.user_id, licenses.license_number)
- **Check constraints:** fuel_level_out/in between 0–100; odometer_in >= odometer_out; expiration_date > issue_date.
- **Indexes:** dispatches.vehicle_id, time_out; fuel_issues.vehicle_id, issued_at; faults.status; maintenance_work_orders.closed_at.
- **Foreign keys:** Sensible cascades (usually ON DELETE RESTRICT for safety; SET NULL for soft-links).

---

### Data Captured on a Dispatch (Cheat Sheet)

- **Who:** driver, A-driver, dispatcher, approving official
- **What:** vehicle (by bumper number/type), mission request link, cargo/pax
- **When:** time out/in, stops times
- **Where:** origin/destination (names + coords), stops (optional)
- **Meters:** odometer out/in, miles driven, engine hours (if relevant)
- **Fuel:** levels out/in, issues during trip
- **Condition:** PMCS before/after, faults discovered
- **Status:** scheduled → enroute → closed (or aborted)
- **Docs:** receipts, photos, 5987-E export (as PDF attachment)

---

### Stretch Fields That Make Your App Stand Out

- **geofences** (jsonb) per mission → late/early arrival flags
- **telematics_ingest** (table) if you simulate GPS pings
- **duty_roster** (who’s available to drive), availability windows
- **bii_coei_items & vehicle_load_plans** (accountability by scan/QR)
- **readiness_snapshots** (daily FMC/PMC/NMC by unit for trend charts)