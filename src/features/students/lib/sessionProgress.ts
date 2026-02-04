import { SessionExecutionSession, SessionAnalytics } from "../services/studentService";

export function presentPercentage(pct: number | null | undefined, isExplicitNull: boolean = false): string {
  if (pct === null || pct === undefined) {
    return isExplicitNull ? 'N/A' : '-';
  }
  return Math.round(pct * 100).toString() + '%';
}

export function findAnalytics(sessionsAnalytics: SessionAnalytics[], session: SessionExecutionSession): SessionAnalytics | null {
  for (const s of sessionsAnalytics) {
    if (s.session_seqnum === session.seqnum) {
      return s;
    }
  }
  return null;
}
