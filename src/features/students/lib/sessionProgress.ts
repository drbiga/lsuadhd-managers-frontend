import { SessionExecutionSession, SessionAnalytics } from "../services/studentService";

export function presentPercentage(pct: number): string {
  return pct > 0 ? Math.round(pct * 100).toString() + '%' : '-';
}

export function findAnalytics(sessionsAnalytics: SessionAnalytics[], session: SessionExecutionSession): SessionAnalytics | null {
  for (const s of sessionsAnalytics) {
    if (s.session_seqnum === session.seqnum) {
      return s;
    }
  }
  return null;
}
