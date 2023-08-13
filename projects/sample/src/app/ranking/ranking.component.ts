import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
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
  
  public group!: Group;
  public groups: Group[] = [];
  public competition!: Competition;
  public competitions!: Competition[];
  public sortedRanking: { key: string, value: number | string, index: number }[] | undefined;
  public sortedRankingWithUserData: PronoRanking[] = [];
  public pageSize = 10;
  public pageSizeOptions: number[] = [10, 20, 50];
  public displayedColumns: string[] = ['rank', 'avatar', 'name', 'score'];
  public dataSource!: MatTableDataSource<PronoRanking>;
  @ViewChild('paginator') paginator!: MatPaginator;
  
  constructor(public dataService: DataService,
    protected groupService: GroupService,
    protected competitionService: CompetitionService,
    protected pronoService: PronosticService,
    protected userService: UserService,
    protected cd: ChangeDetectorRef) { }
    
    ngOnInit(): void {
      const obs: Observable<any>[] = [];
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
          }
          this.getCompetitions(this.group).subscribe(() => {
            if (this.dataService.currentCompetition) {
              this.competition = this.dataService.currentCompetition;
            } else {
              this.dataService.currentCompetition = this.competition;
            }
            this.loadRanking();
          });
        }
      });
    }
    
    changeGroup() {
      this.dataService.currentGroup = this.group;
      this.getCompetitions(this.group).subscribe(() => {
        if (this.competition) {
          this.loadRanking();
        }
      });
    }
    
    changeCompetition() {
      this.dataService.currentCompetition = this.competition;
      this.loadRanking();
    }
    
    loadRanking() {
      this.sortedRankingWithUserData = [];
      const rankingWithUserData: PronoRanking[] = [];
      const obs: Observable<any>[] = [];
      this.pronoService.getRanking(this.competition.id, this.group.id).subscribe((ranking: {key: string, value: number}) => {
        const dataArray = Object.entries(ranking).map(([key, value], index) => ({ key, value, index}));
        dataArray.forEach((kv) => {
          obs.push(this.userService.getLightUser(kv.key).pipe(tap((user: User) => {
            rankingWithUserData.push(new PronoRanking(user, kv.value));
            return user;
          })));
        });
        forkJoin(obs).subscribe(() => {
          this.sortedRankingWithUserData = rankingWithUserData.sort((a, b) => Number(b.score) - Number(a.score));
          this.sortedRankingWithUserData.forEach((value, index) => {
            value.rank = index + 1;
          });
          this.dataSource = new MatTableDataSource(this.sortedRankingWithUserData);
          this.dataSource.paginator = this.paginator;
          this.cd.markForCheck();
        });
      });
    }
    
    getCompetitions(group: Group): Observable<Competition[]> {
      return this.competitionService.getAllByIds(group.competitions).pipe(map(competitions => {
        this.competitions = competitions;
        if (competitions.length > 0 ) {
          this.competition = competitions[0];
        }
        return competitions;
      }));
    }
    
  }
  