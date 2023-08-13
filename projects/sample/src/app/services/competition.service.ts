import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Competition } from '../model/competition';
import { Observable } from 'rxjs';
import { Standing } from '../model/standing';

@Injectable({
  providedIn: 'root'
})
export class CompetitionService {
  
  constructor(protected http: HttpClient) { }
  
  getAllCurrents(): Observable<Competition[]> {
    const url = `api/competition/currents`
    return this.http.get<Competition[]>(url);
  }
  
  getAllByIds(ids: string[]): Observable<Competition[]> {
    const url = `api/competition/ids`
    let params = new HttpParams();
    params = params.set('ids', ids.join(','));
    return this.http.get<Competition[]>(url, { params: params});
  }

  getCompetition(id: string): Observable<Competition> {
    const url = `api/competition/${id}`;
    return this.http.get<Competition>(url);
  }

  getStandings(id: string): Observable<Standing> {
    const url = `api/competition/${id}/standings`;
    return this.http.get<Standing>(url);
  }
  
  loadFromLolesports() {
    const url = `api/competition/load`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'refreshToken': `${localStorage.getItem('refreshToken')}`
    });
    return this.http.get<void>(url, { headers });
  }
  
}
