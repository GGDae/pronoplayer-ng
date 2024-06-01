import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { User } from '../model/user';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  constructor(protected http: HttpClient,
              protected dataService: DataService) { }
  
  getUser(userId: string): Observable<User> {
    const url = `api/user/${userId}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'refreshToken': `${localStorage.getItem('refreshToken')}`
    });
    return this.http.get<User>(url, {headers});
  }
    
  getLightUser(userId: string): Observable<User> {
    const url = `api/user/${userId}/light`;
    return this.http.get<User>(url);
  }

  updateCurrentUser(user: User) {
    const url = `api/user`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'refreshToken': `${localStorage.getItem('refreshToken')}`
    });
    return this.http.post<User>(url, user, { headers }).pipe(tap(updatedUser => {
      this.dataService.currentUser = updatedUser;
    }));
  }
  
  getUserFromToken() {
    const url = `api/user`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'refreshToken': `${localStorage.getItem('refreshToken')}`
    });
    return this.http.get<any>(url, {headers, observe: 'response'}).pipe(map(
      response => {
        const user = response.body;
        const accessToken = response.headers.get('access_token');
        const refreshToken = response.headers.get('refresh_token');
        if (accessToken && refreshToken) {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
        }
        return user;
      }
      ),
      catchError(err => {
        if (err.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
        return of(null);
      }));
    }
    
    getTwitchAuth(code: any) {
      const url = `api/user/token?code=${code}&redirect_uri=${window.location.origin}`;
      return this.http.get(url).pipe(map((token: any) => {
        localStorage.setItem('accessToken', token['access_token']);
        localStorage.setItem('refreshToken', token['refresh_token']);
      }));
    }
  }
  