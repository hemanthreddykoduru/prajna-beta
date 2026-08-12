/**
 * The module registry — every backend service this UI knows how to call.
 *
 * Endpoints come from the platform UI handoff contract. Availability is NOT
 * hardcoded here: it is discovered at runtime by actually calling the endpoint
 * (see `useModuleData`). That means a module going live enables its screen on
 * the next page load with no change to this app.
 *
 * When adding a module, give it the collection endpoint that answers "does this
 * service exist and what does it hold for me" with a plain GET.
 */

export type ModuleKey =
  | 'profile'
  | 'teaching'
  | 'research'
  | 'achievements'
  | 'fdp'
  | 'admin'
  | 'todo'
  | 'companion'
  | 'notifications'
  | 'apar'

export interface ModuleSpec {
  key: ModuleKey
  /** Sidebar label — must match the nav entry. */
  label: string
  /** Platform module number, for messages like "Module 9 is not deployed". */
  moduleNo: string
  moduleName: string
  /** GET endpoint used both to render the screen and to detect availability. */
  endpoint: string
  /** Property on the response holding the list, if it is wrapped. */
  listKey?: string
  /** Columns to show when rows are objects. Falls back to the row's own keys. */
  columns?: { field: string; header: string }[]
  /** One-line description shown above the table. */
  blurb: string
}

export const MODULES: Record<ModuleKey, ModuleSpec> = {
  profile: {
    key: 'profile',
    label: 'Profile',
    moduleNo: 'Module 7',
    moduleName: 'Personal & Professional Profile',
    // GET /faculty/profile does not exist — that path is PUT-only.
    endpoint: '/faculty/me',
    blurb: 'Your profile record, qualifications and identifiers.',
  },
  teaching: {
    key: 'teaching',
    label: 'Teaching',
    moduleNo: 'Module 8',
    moduleName: 'Course Deliverables & Teaching',
    endpoint: '/faculty/teaching/deliverables',
    listKey: 'items',
    columns: [
      { field: 'title', header: 'Deliverable' },
      { field: 'courseCode', header: 'Course' },
      { field: 'status', header: 'Status' },
    ],
    blurb: 'Course deliverables, submissions, feedback and gradebook entries.',
  },
  research: {
    key: 'research',
    label: 'Research',
    moduleNo: 'Module 9',
    moduleName: 'Research & Innovation',
    endpoint: '/faculty/research/publications',
    listKey: 'items',
    columns: [
      { field: 'title', header: 'Title' },
      { field: 'journalName', header: 'Journal' },
      { field: 'year', header: 'Year' },
      { field: 'doi', header: 'DOI' },
    ],
    blurb: 'Publications, grants, patents and research scholars.',
  },
  achievements: {
    key: 'achievements',
    label: 'Achievements',
    moduleNo: 'Module 10',
    moduleName: 'Achievements & Recognition',
    endpoint: '/faculty/achievements',
    listKey: 'data',
    columns: [
      { field: 'title', header: 'Achievement' },
      { field: 'achievementType', header: 'Type' },
      { field: 'achievementDate', header: 'Date' },
      { field: 'recognitionStatus', header: 'Status' },
    ],
    blurb: 'Awards, invited talks and recognitions.',
  },
  fdp: {
    key: 'fdp',
    label: 'FDP & Growth',
    moduleNo: 'Module 11',
    moduleName: 'Faculty Development & Growth',
    endpoint: '/faculty/fdp/fdp-short-term',
    listKey: 'items',
    columns: [
      { field: 'title', header: 'Programme' },
      { field: 'organizer', header: 'Organiser' },
      { field: 'status', header: 'Status' },
    ],
    blurb: 'FDPs, MOOCs, certifications and upskilling records.',
  },
  admin: {
    key: 'admin',
    label: 'Admin',
    moduleNo: 'Module 12',
    moduleName: 'Administrative & Lifecycle',
    endpoint: '/faculty/admin',
    listKey: 'items',
    columns: [
      { field: 'title', header: 'Contribution' },
      { field: 'kind', header: 'Type' },
      { field: 'status', header: 'Status' },
    ],
    blurb: 'Committee roles, events, admissions and accreditation documentation.',
  },
  todo: {
    key: 'todo',
    label: 'To-Do',
    moduleNo: 'Module 23',
    moduleName: 'Dynamic To-Do Engine',
    endpoint: '/todo',
    listKey: 'items',
    columns: [
      { field: 'title', header: 'Task' },
      { field: 'dueDate', header: 'Due' },
      { field: 'priority', header: 'Priority' },
    ],
    blurb: 'Your prioritised tasks for today.',
  },
  companion: {
    key: 'companion',
    label: 'AI Companion',
    moduleNo: 'Module 20',
    moduleName: 'AI Companion Chat',
    endpoint: '/companion/briefing',
    blurb: 'Your daily briefing and career guidance.',
  },
  notifications: {
    key: 'notifications',
    label: 'Notifications',
    moduleNo: 'Module 16',
    moduleName: 'Notification Engine',
    endpoint: '/notifications',
    listKey: 'items',
    columns: [
      { field: 'title', header: 'Notification' },
      { field: 'createdAt', header: 'When' },
    ],
    blurb: 'Your in-app notifications.',
  },
  apar: {
    key: 'apar',
    label: 'APAR',
    moduleNo: 'Module 18',
    moduleName: 'APAR & Appraisal',
    endpoint: '/apar/drafts',
    listKey: 'items',
    blurb: 'Your annual appraisal drafts and review status.',
  },
}

export const moduleByLabel = (label: string): ModuleSpec | undefined =>
  Object.values(MODULES).find((m) => m.label === label)
