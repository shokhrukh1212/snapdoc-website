export const WIZARD_KEY = 'snapdoc-demo-wizard';
export const TASKS_KEY = 'snapdoc-demo-tasks';
export const TASKS_EXTRA_KEY = 'snapdoc-demo-tasks-extra';

export function clearDemoStorage() {
  try {
    localStorage.removeItem(WIZARD_KEY);
    localStorage.removeItem(TASKS_KEY);
    localStorage.removeItem(TASKS_EXTRA_KEY);
  } catch {
    // ignore (e.g. private browsing with storage blocked)
  }
}
