import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Group } from '../model/group';
import { Observable, tap } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  
  constructor(protected http: HttpClient,
              protected dataService: DataService) { }
  
  getGroup(groupId: string): Observable<Group> {
    const url = `api/group/${groupId}`
    return this.http.get<Group>(url);
  }

  getGroupByIdOrInviteId(id: string): Observable<Group> {
    const url = `api/group/invite/${id}`
    return this.http.get<Group>(url);
  }
  
  joinGroup(groupId: string, userId: string): Observable<Group> {
    const url = `api/group/join/${groupId}?userId=${userId}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'refreshToken': `${localStorage.getItem('refreshToken')}`
    });
    return this.http.get<Group>(url, { headers }).pipe(tap(group => {
      const currentUser = this.dataService.currentUser;
      if (!currentUser.groups) {
        currentUser.groups = [];
      }
      currentUser.groups.push(group);
      this.dataService.currentUser = currentUser;
    }));
  }

  getInviteId(groupId: string, userId: string): Observable<any> {
    const url = `api/group/${groupId}/inviteId?userId=${userId}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'refreshToken': `${localStorage.getItem('refreshToken')}`
    });
    return this.http.get<any>(url, { headers });
  }
  
  getManagedGroups(userId: string): Observable<Group[]> {
    const url = `api/group/managed/${userId}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'refreshToken': `${localStorage.getItem('refreshToken')}`
    });
    return this.http.get<Group[]>(url, { headers });
  }
  
  addCompetitionToGroup(groupId: string, competitionId: string, userId: string) {
    const url = `api/group/${groupId}/addCompetition?competitionId=${competitionId}&userId=${userId}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'refreshToken': `${localStorage.getItem('refreshToken')}`
    });
    return this.http.get<Group>(url, { headers });
  }
  
  removeCompetitionFromGroup(groupId: string, competitionId: string, userId: string) {
    const url = `api/group/${groupId}/removeCompetition?competitionId=${competitionId}&userId=${userId}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'refreshToken': `${localStorage.getItem('refreshToken')}`
    });
    return this.http.get<Group>(url, { headers });
  }
    
  addDiscordNotificationForCompetition(groupId: string, competitionId: string, userId: string) {
    const url = `api/group/${groupId}/addNotification?competitionId=${competitionId}&userId=${userId}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'refreshToken': `${localStorage.getItem('refreshToken')}`
    });
    return this.http.get<Group>(url, { headers });
  }
  
  removeDiscordNotificationForCompetition(groupId: string, competitionId: string, userId: string) {
    const url = `api/group/${groupId}/removeNotification?competitionId=${competitionId}&userId=${userId}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'refreshToken': `${localStorage.getItem('refreshToken')}`
    });
    return this.http.get<Group>(url, { headers });
  }

  getPublicGroups(): Observable<Group[]> {
    const url = `api/group/public`;
    return this.http.get<Group[]>(url);
  }

}
