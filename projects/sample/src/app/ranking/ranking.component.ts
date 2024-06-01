import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../services/data.service';
import { Group } from '../model/group';
import { Competition } from '../model/competition';
import { GroupService } from '../services/group.service';
import { CompetitionService } from '../services/competition.service';
import { PronosticService } from '../services/pronostic.service';
import { Observable, forkJoin, map, tap } from 'rxjs';
import { PronoRanking } from '../model/prono-ranking';
import { User } from '../model/user';
import { UserService } from '../services/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {
  
  public group!: Group | undefined;
  public groups: Group[] = [];
  public competition!: Competition | undefined;
  public competitions!: Competition[];
  public sortedRanking: { key: string, value: number | string, index: number }[] | undefined;
  public sortedRankingWithUserData: PronoRanking[] = [];
  public pageSize = 10;
  public pageSizeOptions: number[] = [10, 20, 50];
  public displayedColumns: string[] = ['rank', 'avatar', 'name', 'score'];
  public dataSource!: MatTableDataSource<PronoRanking>;
  public loggedUserRanking!: PronoRanking;
  public userIsBadButShownAnyway = false;
  public loading = false;
  public smallScreen = false;
  public guestMode = false;
  @ViewChild('paginator') paginator!: MatPaginator;
  
  
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }
  
  private checkScreenSize() {
    this.smallScreen = window.innerWidth <= 599;
  }
  
  constructor(public dataService: DataService,
    protected groupService: GroupService,
    protected competitionService: CompetitionService,
    protected pronoService: PronosticService,
    protected userService: UserService,
    protected cd: ChangeDetectorRef) { }
    
    ngOnInit(): void {
      this.checkScreenSize();
      this.loading = true;
      const obs: Observable<any>[] = [];
      if (this.dataService.currentUser) {
        this.dataService.currentUser.groups?.forEach(userGroup => {
          obs.push(this.groupService.getGroup(userGroup.id).pipe(tap(group => {
            this.groups.push(group);
            if (!this.group || (this.dataService.currentGroup && this.dataService.currentGroup.id === group.id)) {
              this.group = group;
            }
            return group;
          })));
        });
        forkJoin(obs).subscribe(() => {
          if (this.group) {
            if (!this.dataService.currentGroup) {
              this.dataService.currentGroup = this.group;
              this.dataService.refreshBreadcrumbsGroup();
            }
            this.getCompetitions(this.group).subscribe(() => {
              if (this.dataService.currentCompetition) {
                this.competition = this.dataService.currentCompetition;
              } else {
                this.dataService.currentCompetition = this.competition;
                this.dataService.refreshBreadcrumbsCompetition();
              }
              this.loadRanking();
            });
          }
        });
      } else {
        const publicGroups = sessionStorage.getItem('publicGroups');
        const guestGroup = sessionStorage.getItem('guestGroup');
        if (publicGroups) {
          this.groups = JSON.parse(publicGroups) as Group[];
          this.guestMode = true;
        }
        if (guestGroup) {
          this.group = this.groups.find(g => g.id === (JSON.parse(guestGroup) as Group).id);
          if (this.group){
            this.getCompetitions(this.group).subscribe(() => {
              if (this.dataService.currentCompetition) {
                this.competition = this.dataService.currentCompetition;
              } else {
                this.dataService.currentCompetition = this.competition;
                this.dataService.refreshBreadcrumbsCompetition();
              }
              this.loadRanking();
            });
          }
        }
      }
    }
    handleMissingAvatar(event: Event) {
      (event.target as HTMLImageElement).src = "assets/images/avatar-placeholder.png";
    }
    changeGroup() {
      this.dataService.currentGroup = this.group;
      this.userIsBadButShownAnyway = false;
      this.dataService.refreshBreadcrumbsGroup();
      if (this.group) {
        this.getCompetitions(this.group).subscribe(() => {
          if (this.competition) {
            this.loadRanking();
          }
        });
      }
    }
    
    changeCompetition() {
      this.userIsBadButShownAnyway = false;
      const comp = this.competitions.find(c => c.id === this.competition?.id);
      this.dataService.currentCompetition = comp;
      this.dataService.refreshBreadcrumbsCompetition();
      this.loadRanking();
    }
    
    generateSnapshot() {
      if (this.group && this.competition) {
        this.pronoService.generateSnapshot(this.competition.id, this.group.id).subscribe();
      }
    }

    isAdministrator(): boolean {
      if (this.dataService.currentUser && this.group) {
        return this.group.administrators.includes(this.dataService.currentUser.userId);
      }
      return false;
    }
    
    loadRanking() {
      this.loading = true;
      this.sortedRankingWithUserData = [];
      const rankingWithUserData: PronoRanking[] = [];
      const obs: Observable<any>[] = [];
      if (this.group && this.competition) {
        this.pronoService.getRanking(this.competition.id, this.group.id).subscribe((ranking: {key: string, value: number[]}) => {
          const dataArray = Object.entries(ranking).map(([key, value], index) => ({ key, value, index}));
          dataArray.forEach((kv) => {
            obs.push(this.userService.getLightUser(kv.key).pipe(tap((user: User) => {
              let array: number[] = kv.value as number[];
              if (kv.value && array.length === 3) {
                rankingWithUserData.push(new PronoRanking(user, array[0], array[1], array[2]));
                if (this.dataService.currentUser && user.displayName === this.dataService.currentUser.displayName) {
                  this.loggedUserRanking = new PronoRanking(user, array[0], array[1], array[2]);
                }
              }
              return user;
            })));
          });
          forkJoin(obs).subscribe(() => {
            if (this.dataService.currentUser) {
              this.sortedRankingWithUserData = rankingWithUserData.sort((a, b) => (Number(b.score) - Number(a.score)) !== 0 ? (Number(b.score) - Number(a.score)) : (Number(b.goodGuess / b.totalGuess) - Number(a.goodGuess / a.totalGuess) !== 0 ? (Number(b.goodGuess / b.totalGuess) - Number(a.goodGuess / a.totalGuess)): b.user?.displayName === this.dataService.currentUser.displayName ? 1 : -1));
            } else {
              this.sortedRankingWithUserData = rankingWithUserData.sort((a, b) => (Number(b.score) - Number(a.score)) !== 0 ? (Number(b.score) - Number(a.score)) : (Number(b.goodGuess / b.totalGuess) - Number(a.goodGuess / a.totalGuess) !== 0 ? (Number(b.goodGuess / b.totalGuess) - Number(a.goodGuess / a.totalGuess)): -1));
            }
            let previousValue: PronoRanking;
            this.sortedRankingWithUserData.forEach((value, index) => {
              let rank: number;
              if (previousValue) {
                if (previousValue.score === value.score && (Number(previousValue.goodGuess / previousValue.totalGuess) === (Number(value.goodGuess / value.totalGuess)))) {
                  rank = previousValue.rank;
                } else {
                  rank = index + 1;
                  value.displayedRank = rank;
                }
              } else {
                rank = index + 1;
                value.displayedRank = rank;
              }
              value.rank = rank;
              previousValue = value;
              if (value.user?.displayName === this.dataService.currentUser?.displayName) {
                value.displayedRank = value.rank;
                this.loggedUserRanking.displayedRank = value.rank;
              }
            });
            const firstPage = this.sortedRankingWithUserData.slice(0, this.pageSize);
            if (firstPage.findIndex(r => r.user?.displayName === this.dataService.currentUser?.displayName) === -1 && !this.guestMode) {
              this.userIsBadButShownAnyway = true;
            }
            this.dataSource = new MatTableDataSource(this.sortedRankingWithUserData);
            this.dataSource.paginator = this.paginator;
            this.loading = false;
            this.cd.markForCheck();
          });
        });
      }
    }
    
    pageChange(event: any) {
      if (event.previousPageIndex !== event.pageIndex) { 
        event.pageSize = event.pageIndex * event.pageSize + event.pageSize;
      }
      const page = this.sortedRankingWithUserData.slice(0, event.pageSize);
      this.userIsBadButShownAnyway = !this.guestMode && page.findIndex(r => r.user?.displayName === this.dataService.currentUser.displayName) === -1;
    }
    
    getCompetitions(group: Group): Observable<Competition[]> {
      return this.competitionService.getAllByIds(group.competitions).pipe(map(competitions => {
        this.competitions = competitions.filter(c => c.current);
        if (this.competitions.length > 0 ) {
          this.competition = this.competitions[0];
        }
        if (this.competitions.findIndex(c => c.id === this.dataService.currentCompetition.id) < 0) {
          this.dataService.currentCompetition = this.competition;
        }
        return competitions;
      }));
    }
    
  }
  