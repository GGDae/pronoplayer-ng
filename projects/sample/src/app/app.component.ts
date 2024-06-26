import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { User } from './model/user';
import { MatSidenav } from '@angular/material/sidenav';
import { DataService } from './services/data.service';
import { UserService } from './services/user.service';
import { SwUpdate } from '@angular/service-worker';
import { MatDialog } from '@angular/material/dialog';
import { RefreshDialogComponent } from './refresh-dialog/refresh-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  
  public username!: string;
  public userId!: string;
  public currentUser!: User;
  public loading = false;
  private intervalId: any;
  
  @ViewChild('sidenav') sidenav!: MatSidenav;
  
  constructor(public http: HttpClient,
    public route: ActivatedRoute,
    public router: Router,
    public dataService: DataService,
    private userService: UserService,
    private dialog: MatDialog,
    private swUpdate: SwUpdate) {
      this.swUpdate.versionUpdates.subscribe(async evt => {
        switch (evt.type) {
            case 'VERSION_DETECTED':
                console.log(`Downloading new app version: ${evt.version.hash}`);
                break;
            case 'VERSION_READY':
                console.log(`Current app version: ${evt.currentVersion.hash}`);
                console.log(`New app version ready for use: ${evt.latestVersion.hash}`);
                this.dialog.open(RefreshDialogComponent).afterClosed().subscribe(result => {
                  if (result) {
                    window.location.reload();
                  }
                });
                break;    
            case 'VERSION_INSTALLATION_FAILED':
                console.log(`Failed to install app version '${evt.version.hash}': ${evt.error}`);
                break;
        }
    });
      this.intervalId = setInterval(() => {
        this.checkForUpdates();
      }, 240000);
    }
    
    private checkForUpdates() {
      if (this.swUpdate.isEnabled) {
        this.swUpdate.checkForUpdate().then(result => {
          if (result) {
            console.log('new version available');
            this.dialog.open(RefreshDialogComponent).afterClosed().subscribe(result => {
              if (result) {
                window.location.reload();
              }
            });
          }
        });
      }
    }
    
    ngOnDestroy(): void {
      clearInterval(this.intervalId);
    }
    
    ngOnInit() {
      if (this.dataService.theme === 'dark') {
        document.body.classList.toggle('dark-mode');
      }
      let baseUrl = '';
      if (this.dataService.currentUser) {
        this.dataService.guestMode = false;
      }
      const urlParams : {key: string, value: string}[] = [];
      if (window.location.search && !this.dataService.currentUser) {
        if (window.location.search !== '?') {
          baseUrl = location.href.split('?')[0];
          const queryString = window.location.search.split(/\?(.*)/)[1];
          const params = queryString.split('&');
          if (params) {
            params.forEach(param => {
              const p = param.split('=');
              urlParams.push({key: p[0], value: p[1]});
              sessionStorage.setItem(p[0], p[1]);
            });
          }
        }
      }
      const sessionToken = localStorage.getItem('accessToken');
      if (sessionToken && !this.dataService.currentUser) {
        this.loading = true;
        this.dataService.loadingSubject.next(true);
        this.userService.getUserFromToken().subscribe((user: User) => {
          if (baseUrl !== '') {
            window.location.href = baseUrl;
          } else {
            this.afterLogin(user);
          }
        });
      } else {
        if (sessionStorage.getItem('code')) {
          if (sessionStorage.getItem('state') === 'c3ab8aa609ea11e793ae92361f002679') {
            
            this.loading = true;
            this.dataService.loadingSubject.next(true);
            this.userService.getTwitchAuth(sessionStorage.getItem('code')).subscribe(() => {
              this.userService.getUserFromToken().subscribe((user: User) => {
                sessionStorage.removeItem('code');
                sessionStorage.removeItem('scope');
                sessionStorage.removeItem('state');
                if (baseUrl !== '') {
                  window.location.href = baseUrl;
                } else {
                  this.afterLogin(user);
                }
              });
            });
          }
        }
      }
    }
    
    goToRanking() {
      this.sidenav.toggle();
      this.router.navigate(['ranking']);
    }
    
    goToGroupManagement() {
      this.sidenav.toggle();
      this.router.navigate(['grp/manage']);
    }
    
    goToStandings() {
      this.sidenav.toggle();
      this.router.navigate(['standings']);
    }

    goToPronos() {
      this.sidenav.toggle();
      if (this.dataService.currentGroup && this.dataService.currentCompetition && this.dataService.breadcrumbItems.length === 3) {
        this.router.navigate([`grp/${this.dataService.currentGroup.id}/${this.dataService.currentCompetition.id}`]);
      } else if (this.dataService.currentGroup) {
        this.router.navigate([`grp/${this.dataService.currentGroup.id}`]);
      }
    }
    
    toggleSidenav() {
      this.sidenav.toggle();
    }
    
    closeSidenav() {
      if (this.sidenav.opened) {
        this.sidenav.toggle();
      }
    }
    
    afterLogin(user: User) {
      this.dataService.currentUser = user;
      this.currentUser = user;
      this.loading = false;
      this.dataService.guestMode = false;
      this.dataService.loadingSubject.next(false);
      this.dataService.loginSubject.next(true);
    }

    disconnect() {
      this.dataService.clear();
      this.closeSidenav();
      this.router.navigate(['']);
    }
  }
  