import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSidenav } from '@angular/material/sidenav';
import { DataService } from '../services/data.service';
import { Competition } from '../model/competition';
import { Group } from '../model/group';
import { GroupService } from '../services/group.service';
import { catchError, map, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  public loading = false;
  public username!: string;
  public userId!: string;
  public competitions!: Competition[];
  public groupIdToJoin = "";
  public showBlabla = true;
  // public groupChoice = false;
  public publicGroups!: Group[];
  
  @ViewChild('sidenav') sidenav!: MatSidenav;
  
  
  constructor(public http: HttpClient,
    public route: ActivatedRoute,
    public dataService: DataService,
    private groupService: GroupService,
    protected snackBar: MatSnackBar,
    private router: Router) {
    }
    
    ngOnInit() {
      this.groupService.getPublicGroups().subscribe(groups => {
        if (groups) {
          this.publicGroups = groups;
        }
      });
      this.dataService.loadingSubject.subscribe(loading => {
        this.loading = loading;
      });
      this.dataService.clearBreadcrumb();
      this.dataService.addBreadcrumbItem('Accueil', '/home');
      if (this.dataService.currentGroup) {
        this.dataService.addBreadcrumbItem(this.dataService.currentGroup.name, `/grp/${this.dataService.currentGroup.id}`);
      }
      if (this.dataService.currentGroup && this.dataService.currentCompetition) {
        this.dataService.addBreadcrumbItem(this.dataService.currentCompetition.name, `/grp/${this.dataService.currentGroup.id}/${this.dataService.currentCompetition.id}`);
      }
      this.showBlabla = !this.dataService.currentGroup;
    }

    goToRanking(group: Group) {
      this.dataService.guestMode = true;
      sessionStorage.setItem('publicGroups', JSON.stringify(this.publicGroups));
      sessionStorage.setItem('guestGroup', JSON.stringify(group));
      this.router.navigate(['ranking']);
    }
    
    goToPronos() {
      this.dataService.showHome = false;
      if (this.dataService.currentGroup && this.dataService.currentCompetition && this.dataService.breadcrumbItems.length === 3) {
        this.router.navigate([`grp/${this.dataService.currentGroup.id}/${this.dataService.currentCompetition.id}`]);
      } else if (this.dataService.currentGroup) {
        this.router.navigate([`grp/${this.dataService.currentGroup.id}`]);
      }
    }
    
    selectGroup(selectedGroup: Group) {
      this.dataService.showHome = false;
      this.dataService.currentGroup = selectedGroup;
      this.dataService.clearBreadcrumb();
      this.dataService.addBreadcrumbItem('Accueil', '/home');
      this.dataService.addBreadcrumbItem(selectedGroup.name, `/grp/${selectedGroup.id}`);
      this.router.navigate([`/grp/${selectedGroup.id}`]);
    }
    
    joinGroup() {
      this.groupService.joinGroup(this.groupIdToJoin, this.dataService.currentUser.userId).pipe(catchError(() => {
        this.snackBar.open("Le groupe n'existe pas", 'x', {duration: 10000});
        return of(null);
      })).subscribe((group) => {
        if (group) {
          this.dataService.currentGroup = group;
          this.dataService.clearBreadcrumb();
          this.dataService.addBreadcrumbItem('Accueil', '/home');
          this.dataService.addBreadcrumbItem(group.name, `/grp/${group.id}`);
          this.router.navigate([`grp/${group.id}`]);
        }
      });
    }
  }
  