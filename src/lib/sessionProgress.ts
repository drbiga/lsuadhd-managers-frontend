import { Session, SessionAnalytics } from "@/services/sessionExecution";

export function presentPercentage(pct: number): string {
    return pct > 0 ? Math.round(pct * 100).toString() + '%' : '-';
  }
  
export function findAnalytics(sessionsAnalytics: SessionAnalytics[], session: Session): SessionAnalytics | null {
    for (let s of sessionsAnalytics) {
      if (s.session_seqnum === session.seqnum) {
        return s;
      }
    }
    return null;
  }
  