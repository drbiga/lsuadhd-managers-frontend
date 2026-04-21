import api from "@/services/api";


import iamService from "@/services/iam";
import { AxiosError } from "axios";


import * as humps from 'humps';


export type SessionProgress = {
    studentName: string
    sessionNum: number
    tsStart: Date
    tsEnd: Date | null
    stage: string
    feedbacks: Feedback
    analytics: Analytics | null
}

export type Feedback = {

}

export type Analytics = {

}

class ManagementService {
  public async getSessionProgressList(studentName: string): Promise<SessionProgress[]> {
    const result =  await api.get(`/management/student/${studentName}/session_progress`);
    const sessionProgressList: SessionProgress[] = result.data.map(d => humps.camelizeKeys(d)) as SessionProgress[];
    console.log(sessionProgressList);
    return sessionProgressList;
  }
}

const managementService = new ManagementService();

export default managementService;
