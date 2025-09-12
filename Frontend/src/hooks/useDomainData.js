import { useEffect, useMemo, useState } from "react";
import { useFetch } from "./useFetch";
import { listVehicles, listUsers, listDispatches, getUserQuals } from "../api/client";
import { getBusyDriverIds } from "../data/selectors";

export function useVehicles() {
  const q = useFetch(() => listVehicles(), []);
  return { items: q.data?.items || [], loading: q.loading, error: q.error };
}

export function useUsersWithQuals() {
  const uq = useFetch(() => listUsers(), []);
  const users = uq.data?.items || [];
  const [userQuals, setUserQuals] = useState({});
  const [qualsLoading, setQualsLoading] = useState(false);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!users.length) return;
      setQualsLoading(true);
      try {
        const entries = await Promise.all(
          users.map(async (u) => {
            try {
              const quals = await getUserQuals(u.dod_id);
              const ids = Array.isArray(quals)
                ? quals.map((q) => q.qual_id).filter((x) => x != null)
                : [];
              return [u.dod_id, ids];
            } catch {
              return [u.dod_id, []];
            }
          })
        );
        if (!cancelled) setUserQuals(Object.fromEntries(entries));
      } finally {
        if (!cancelled) setQualsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [users]);

  return { users, userQuals, loading: uq.loading || qualsLoading, error: uq.error };
}

export function useDispatches() {
  const dq = useFetch(() => listDispatches(), []);
  const items = dq.data?.items || [];
  const busySet = useMemo(() => getBusyDriverIds(items), [items]);
  return { items, busySet, loading: dq.loading, error: dq.error };
}

