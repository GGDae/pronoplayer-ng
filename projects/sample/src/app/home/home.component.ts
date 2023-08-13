import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSidenav } from '@angular/material/sidenav';
import { DataService } from '../services/data.service';
import { Competition } from '../model/competition';
import { Group } from '../model/group';
import { GroupService } from '../services/group.service';
import { catchError, of } from 'rxjs';
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
  
  @ViewChild('sidenav') sidenav!: MatSidenav;
  
  
  constructor(public http: HttpClient,
    public route: ActivatedRoute,
    public dataService: DataService,
    private groupService: GroupService,
    protected snackBar: MatSnackBar,
    private router: Router) {
    }
    
    ngOnInit() {
      this.dataService.loadingSubject.subscribe(loading => {
        this.loading = loading;
      });
    }
    
    selectGroup(selectedGroup: Group) {
      this.dataService.currentGroup = selectedGroup;
      this.router.navigate([`/grp/${selectedGroup.id}`]);
    }
    
    joinGroup() {
      this.groupService.joinGroup(this.groupIdToJoin, this.dataService.currentUser.userId).pipe(catchError(() => {
        this.snackBar.open("Le groupe n'existe pas", 'x', {duration: 10000});
        return of(null);
      })).subscribe((group) => {
        if (group) {
          this.dataService.currentGroup = group;
          this.router.navigate([`grp/${group.id}`]);
        }
      });
    }
  }
  