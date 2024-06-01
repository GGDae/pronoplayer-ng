import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { BehaviorSubject } from 'rxjs';
import { Group } from '../model/group';
import { Competition } from '../model/competition';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private _breadcrumbItems!: BreadcrumbItem[];
  private _theme!: string;
  private _currentUser!: User | any;
  private _currentGroup!: Group | any;
  private _currentCompetition!: Competition | any;
  public isMobile = false;
  public showHome = false;
  public guestMode = false;
  public loginSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor() { }

  public clear() {
    this._currentGroup = null;
    this._currentCompetition = null;
    this._currentUser = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentGroup');
    localStorage.removeItem('currentCompetition');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  get theme(): string {
    if (this._theme) {
      return this._theme;
    }
    const storage = localStorage.getItem('theme');
    if (storage) {
      this._theme = JSON.parse(storage);
    }
    return this._theme;
  }

  set theme(theme: string) {
    if (this._theme !== theme) {
      document.body.classList.toggle('dark-mode');
    }
    localStorage.setItem('theme', JSON.stringify(theme));
    this._theme = theme;
  }

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

  
  get breadcrumbItems() {
    if (this._breadcrumbItems) {
      return this._breadcrumbItems;
    }
    const storage = localStorage.getItem('breadcrumbs');
    if (storage) {
      this._breadcrumbItems = JSON.parse(storage) as BreadcrumbItem[];
    }
    return this._breadcrumbItems;
  }

  set breadcrumbItems(breadcrumbs: BreadcrumbItem[]) {
    localStorage.setItem('breadcrumbs', JSON.stringify(breadcrumbs));
    this._breadcrumbItems = breadcrumbs;
  }

  addBreadcrumbItem(label: string, url: string) {
    const items = this.breadcrumbItems;
    items.push({ label, url });

    this.breadcrumbItems = items;
  }

  clearBreadcrumb() {
    this._breadcrumbItems = [];
    localStorage.removeItem('breadcrumbs');
  }

  refreshBreadcrumbsCompetition() {
    this.clearBreadcrumb();
    this.addBreadcrumbItem('Accueil', '/home');
    if (this._currentGroup) {
      this.addBreadcrumbItem(this._currentGroup.name, `/grp/${this._currentGroup.id}`);
    }
    if (this._currentGroup && this._currentCompetition) {
      this.addBreadcrumbItem(this._currentCompetition.name, `/grp/${this._currentGroup.id}/${this._currentCompetition.id}`);
    }
  }

  refreshBreadcrumbsGroup() {
    this.clearBreadcrumb();
    this.addBreadcrumbItem('Accueil', '/home');
    if (this._currentGroup) {
      this.addBreadcrumbItem(this._currentGroup.name, `/grp/${this._currentGroup.id}`);
    }
  }

}

interface BreadcrumbItem {
  label: string;
  url: string;
}