import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { BehaviorSubject } from 'rxjs';
import { Group } from '../model/group';
import { Competition } from '../model/competition';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private _currentUser!: User;
  private _currentGroup!: Group | any;
  private _currentCompetition!: Competition;
  public isMobile = false;
  public loginSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor() { }

  get currentUser(): User {
    if (this._currentUser) {
      return this._currentUser;
    }
    const storage = localStorage.getItem('currentUser');
    if (storage) {
      this._currentUser = JSON.parse(storage);
    }
    return this._currentUser;
  }

  set currentUser(user: User) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this._currentUser = user;
  }

  get currentGroup(): Group {
    if (this._currentGroup) {
      return this._currentGroup;
    }
    const storage = localStorage.getItem('currentGroup');
    if (storage) {
      this._currentGroup = JSON.parse(storage);
    }
    return this._currentGroup;
  }

  set currentGroup(group: Group | any) {
    localStorage.setItem('currentGroup', JSON.stringify(group));
    this._currentGroup = group;
  }
  
  get currentCompetition(): Competition {
    if (this._currentCompetition) {
      return this._currentCompetition;
    }
    const storage = localStorage.getItem('currentCompetition');
    if (storage) {
      this._currentCompetition = JSON.parse(storage) as Competition;
    }
    return this._currentCompetition;
  }

  set currentCompetition(competition: Competition | any) {
    localStorage.setItem('currentCompetition', JSON.stringify(competition));
    this._currentCompetition = competition;
  }

}
