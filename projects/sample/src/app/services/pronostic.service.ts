import { Injectable } from '@angular/core';
import { Pronostic } from '../model/pronostic';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PronoWeek } from '../model/pronoWeek';
import { Observable, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PronosticService {
  
  constructor(protected http: HttpClient) { }
    
    getPronoForUser(competitionId: string, groupId: string, week: string, userId: string) {
      const url = `api/prono/${userId}?competitionId=${competitionId}&groupId=${groupId}&weekId=${week}`
      return this.http.get<Pronostic>(url);
    }
    
    getPronoWeek(competitionId: string, week: string, period: string) {
      const url = `api/prono/week/${week}?competitionId=${competitionId}&period=${period}`
      return this.http.get<PronoWeek>(url);
    }
    
    getPronoCurrentWeek(competitionId: string) {
      const date = new Date().toISOString();
      const url = `api/prono/schedule/${date}?competitionId=${competitionId}`
      return this.http.get<PronoWeek>(url);
    }
    
    getPronoWeeks(competitionId: string): Observable<PronoWeek[]> {
      const url = `api/prono/schedule?competitionId=${competitionId}`
      return this.http.get<PronoWeek[]>(url);
    }
    
    setAnswer(pronostic: Pronostic, userId: string) {
      const url = `api/prono/${userId}`
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'refreshToken': `${localStorage.getItem('refreshToken')}`
      });
      return this.http.patch<Pronostic>(url, pronostic, { headers });
    }
    
    getRanking(competitionId: string, groupId: string) {
      const url = `api/prono/${groupId}/ranking?competitionId=${competitionId}`;
      return this.http.get<any>(url);
    }
  }
  