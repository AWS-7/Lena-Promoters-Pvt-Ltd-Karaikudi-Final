export function scheduleIdleTask(task: () => void, timeout = 2500) {
  if (typeof window === "undefined") return () => {};

  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(task, { timeout });
    return () => window.cancelIdleCallback(id);
  }

  const timer = setTimeout(task, 120);
  return () => clearTimeout(timer);
}
