// Centralized dispatch status logic

/**
 * Determines the status of a dispatch based on approval and comments
 * @param {Object} dispatch - The dispatch object
 * @returns {string} - 'APPROVED', 'DENIED', or 'PENDING'
 */
export function getDispatchStatus(dispatch) {
  if (dispatch.approved === true) return 'APPROVED';
  if (dispatch.approved === false && dispatch.comments) return 'DENIED';
  return 'PENDING';
}

/**
 * Calculates time relationship for dispatch sorting
 * @param {Object} dispatch - The dispatch object
 * @returns {Object} - { category: string, priority: number }
 */
export function getTimeCategory(dispatch) {
  const now = new Date();
  const startTime = dispatch.start_time ? new Date(dispatch.start_time) : null;
  const endTime = dispatch.end_time ? new Date(dispatch.end_time) : null;

  if (!startTime || !endTime) return { category: 'no-date', priority: 999 };

  if (startTime <= now && now <= endTime) {
    // Currently active - priority by remaining time (shorter remaining = higher priority)
    const remainingMs = endTime.getTime() - now.getTime();
    return { category: 'active', priority: remainingMs };
  } else if (startTime > now) {
    // Future - priority by closeness to start (closer = higher priority)
    const timeToStart = startTime.getTime() - now.getTime();
    return { category: 'future', priority: timeToStart };
  } else {
    // Past - priority by recency (more recent = higher priority)
    const timeSinceEnd = now.getTime() - endTime.getTime();
    return { category: 'past', priority: timeSinceEnd };
  }
}

/**
 * Sorts dispatches by status and date priority
 * @param {Array} dispatches - Array of dispatch objects
 * @returns {Array} - Sorted array of dispatches
 */
export function sortDispatches(dispatches) {
  return dispatches.sort((a, b) => {
    // Primary sort: Status (DENIED → PENDING → APPROVED)
    const statusA = getDispatchStatus(a);
    const statusB = getDispatchStatus(b);
    const statusOrder = { 'DENIED': 0, 'PENDING': 1, 'APPROVED': 2 };

    if (statusOrder[statusA] !== statusOrder[statusB]) {
      return statusOrder[statusA] - statusOrder[statusB];
    }

    // Secondary sort: Date logic within same status
    const timeA = getTimeCategory(a);
    const timeB = getTimeCategory(b);

    // Same category, sort by priority
    if (timeA.category === timeB.category) {
      return timeA.priority - timeB.priority;
    }

    // Different categories: active → future → past → no-date
    const categoryOrder = { 'active': 0, 'future': 1, 'past': 2, 'no-date': 3 };
    return categoryOrder[timeA.category] - categoryOrder[timeB.category];
  });
}