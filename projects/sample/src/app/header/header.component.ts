import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  
  public loading = false;
  
  @Output()
  public eventEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  constructor(public dataService: DataService,
    public router: Router) { }
    
    ngOnInit(): void {
      this.dataService.loginSubject.subscribe(s => {
        if (s) {
          const originalHash = sessionStorage.getItem('originalHash');
          if (originalHash) {
            sessionStorage.removeItem('originalHash');
            this.router.navigate([originalHash]);
          }
        }
      });
      this.dataService.loadingSubject.subscribe(loading => {
        this.loading = loading;
      });
    }
    
    toggleSidenav() {
      this.eventEmitter.emit(true);
    }
    
    goHome() {
      this.router.navigate(['/']);
    }
    
    goToProfile() {
      this.router.navigate([`/profile/${this.dataService.currentUser.userId}`]);
    }
    
    connectWithTwitch() {
      const originalHash = window.location.hash;
      sessionStorage.setItem('originalHash', originalHash.replace('#', ''));
      window.location.href = `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=q38439mgc2wn7b04sr0ls8ghsox1z0&redirect_uri=${window.location.origin}&scope=&state=c3ab8aa609ea11e793ae92361f002679`;
    }
  }
  