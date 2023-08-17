import { ChangeDetectorRef, Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Competition } from '../model/competition';
import { PronoWeek } from '../model/pronoWeek';
import { Pronostic } from '../model/pronostic';
import { DataService } from '../services/data.service';
import { CompetitionService } from '../services/competition.service';
import { PronosticService } from '../services/pronostic.service';
import { GroupService } from '../services/group.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Match } from '../model/match';
import { Observable, of } from 'rxjs';
import { Team } from '../model/team';
import { MatchScore } from '../model/matchScore';
import { MatDialog } from '@angular/material/dialog';
import { RandomValidationComponent } from './random-validation/random-validation.component';

@Component({
  selector: 'app-competition',
  templateUrl: './competition.component.html',
  styleUrls: ['./competition.component.scss']
})
export class CompetitionComponent implements OnInit, OnDestroy {
  
  public currentCompetition?: Competition;
  public currentWeek!: PronoWeek;
  public currentIndex!: number;
  public pronoWeeks!: PronoWeek[];
  public userPronos!: Pronostic;
  public possibleOutcomes: {bo: number, outcomes: string[]}[] = [];
  public scoreForMatch: { [key: string]: string} = {};
  public showCoin = false;
  public saving = false;
  public needSaving = false;
  public loading = false;
  public smallScreen = false;
  private intervalId: any;
  
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }
  
  private checkScreenSize() {
    this.smallScreen = window.innerWidth <= 599;
  }
  
  constructor(public dataService: DataService,
    protected competitionService: CompetitionService,
    protected pronoService: PronosticService,
    protected groupService: GroupService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected datePipe: DatePipe,
    protected snackBar: MatSnackBar,
    private dialog: MatDialog,
    protected cd: ChangeDetectorRef) {
    }
    
    ngOnInit(): void {
      this.checkScreenSize();
      this.loading = true;
      const groupId = this.route.snapshot.paramMap.get('id');
      const competitionId = this.route.snapshot.paramMap.get('competitionId');
      if (this.dataService.currentUser) {
        if (groupId) {
          this.groupService.getGroup(groupId).subscribe(group => {
            this.dataService.currentGroup = group;
          });
        }
        if (competitionId) {
          this.competitionService.getCompetition(competitionId).subscribe(competition => {
            this.currentCompetition = competition;
            this.selectCompetition(this.currentCompetition);
          });
        } else if (this.dataService.currentCompetition) {
          this.currentCompetition = this.dataService.currentCompetition;
          this.selectCompetition(this.currentCompetition);
        }
        this.possibleOutcomes = [];
        this.possibleOutcomes.push({bo: 3, outcomes: this.generateOutcomes(3)});
        this.possibleOutcomes.push({bo: 5, outcomes: this.generateOutcomes(5)});
        this.startAutoSave();
      }
    }
    
    ngOnDestroy(): void {
      clearInterval(this.intervalId);
    }
    
    getPossibleOutcomes(bo: number): string[] {
      const outcomes = this.possibleOutcomes.find(oc => oc.bo === bo);
      if (outcomes) {
        return outcomes.outcomes;
      }
      return [];
    }
    
    selectCompetition(competition: Competition) {
      this.currentCompetition = competition;
      this.dataService.currentCompetition = competition;
      this.pronoService.getPronoWeeks(this.dataService.currentCompetition.id).subscribe(pronoWeeks => {
        pronoWeeks.sort((a, b) => new Date(a.lockDate).getTime() - new Date(b.lockDate).getTime());
        this.pronoWeeks = pronoWeeks;
        const closestWeek = this.findClosestWeek();
        if (closestWeek && closestWeek.week && closestWeek.index > -1) {
          this.currentWeek = closestWeek.week;
          this.currentIndex = closestWeek.index;
        }
        this.showCoin = this.showTheCoin();
        if (this.currentWeek) {
          this.getPronoForUser(this.currentWeek.id);
        } else {
          this.loading = false;
        }
      });
    }
    
    findClosestWeek(): { week: PronoWeek | null, index: number } {
      const today = new Date();
      let closestWeek: PronoWeek | null = null;
      let closestFinishedWeek: PronoWeek | null = null;
      let closestIndex = -1;
      let closestFinishedIndex = -1;
      let closestTimeDiff = Number.MAX_VALUE;
      let closestFinishedTimeDiff = Number.MAX_VALUE;
      
      for (let i = 0; i < this.pronoWeeks.length; i++) {
        const event = this.pronoWeeks[i];
        event.pronoDays.forEach(pronoDay => {
          let allFinished = true;
          let hasCloser = false;
          pronoDay.matchs?.forEach(match => {
            if (match) {
              if (match.state !== 'completed') {
                allFinished = false;
              }
              if (match.dateTime) {
                const timeDiff = Math.abs(new Date(match.dateTime).getTime() - today.getTime());
                if (match.state !== 'completed' && timeDiff < closestTimeDiff) {
                  closestTimeDiff = timeDiff;
                  // closestWeek = event;
                  // closestIndex = i;
                  hasCloser = true;
                } else {
                  if (timeDiff < closestFinishedTimeDiff) {
                    closestFinishedTimeDiff = timeDiff;
                    hasCloser = true;
                  }
                }
              }
            }
          });
          if (hasCloser && allFinished) {
            closestFinishedWeek = event;
            closestFinishedIndex = i;
          }
          if (hasCloser && !allFinished) {
            closestWeek = event;
            closestIndex = i;
          }
        });
      }
      if (closestWeek && closestIndex > -1) {
        return { week: closestWeek, index: closestIndex };
      }
      return { week : closestFinishedWeek, index: closestFinishedIndex };
    }
    
    isLocked(match: Match) {
      if (match.inProgress) {
        return true;
      }
      const today = new Date();
      if (match.teams.length === 2 && (match.teams[0].code === 'TBD' || match.teams[1].code === 'TBD')) {
        return true;
      }
      if (match.dateTime) {
        return new Date(match.dateTime).getTime() < today.getTime();
      }
      return true;
    }
    
    getPreviousWeek() {
      if (this.currentIndex === 0) {
        return;
      }
      if (!this.currentWeek || !this.pronoWeeks) {
        return;
      }
      this.currentIndex = this.currentIndex - 1;
      this.currentWeek = this.pronoWeeks[this.currentIndex];
      this.showCoin = this.showTheCoin();
      this.getPronoForUser(this.currentWeek.id);
    }
    
    getNextWeek() {
      if (this.currentIndex >= this.pronoWeeks.length - 1) {
        return;
      }
      if (!this.currentWeek || !this.pronoWeeks) {
        return;
      }
      this.currentIndex = this.currentIndex + 1;
      this.currentWeek = this.pronoWeeks[this.currentIndex];
      this.showCoin = this.showTheCoin();
      this.getPronoForUser(this.currentWeek.id);
    }
    
    getPronoForUser(weekId: string) {
      if (this.currentCompetition) {
        this.pronoService.getPronoForUser(this.currentCompetition.id, this.dataService.currentGroup.id, weekId, this.dataService.currentUser.userId)
        .subscribe(pronos => {
          if (pronos) {
            this.userPronos = pronos;
            this.loadScores();
          } else {
            this.initUserPronos().subscribe(() => {
              this.loadScores();
            });
          }
          this.loading = false;
        });
      }
    }
    
    loadScores() {
      this.userPronos.scores.forEach(matchScore => {
        if (matchScore && matchScore.matchId && matchScore.score){
          this.scoreForMatch[matchScore.matchId] = matchScore.score;
        }
      });
    }
    
    initUserPronos():Observable<Pronostic> {
      this.userPronos = new Pronostic();
      const obs: Observable<any>[] = [];
      if (this.currentCompetition) {
        this.userPronos.competitionId = this.currentCompetition.id;
        this.userPronos.groupId = this.dataService.currentGroup.id;
        this.userPronos.userId = this.dataService.currentUser.userId;
        this.userPronos.weekId = this.currentWeek.id;
        this.userPronos.scores = [];
        return this.pronoService.setAnswer(this.userPronos, this.dataService.currentUser.userId);
      }
      return of(this.userPronos);
    }
    
    isTeamSelected(match: Match, team: Team): boolean {
      if (match.teams.length === 2 && match.teams[0].code === match.teams[1].code) {
        return false;
      }
      if (this.userPronos && this.userPronos.scores) {
        const index = this.userPronos.scores.findIndex(score => score.matchId === match.id);
        if (index > -1) {
          return this.userPronos.scores[index].winner === team.code;
        }
        return false;
      }
      return false;
    }
    
    setScore(match: Match) {
      const outcome = this.scoreForMatch[match.id];
      const scores = outcome.split('-');
      let team;
      if (scores.length > 1 && scores[0] > scores[1]) {
        team = match.teams[0];
      } else {
        team = match.teams[1];
      }
      this.updateProno(match, team, outcome);
    }
    
    selectTeam(match: Match, team: Team) {
      if (match.strategy.count > 1) {
        return;
      }
      this.updateProno(match, team, '');
    }
    
    updateProno(match: Match, team: Team, outcome: string) {
      if (this.isLocked(match)) {
        return;
      }
      if (this.userPronos && this.userPronos.scores) {
        const index = this.userPronos.scores.findIndex(score => score.matchId === match.id);
        if (index > -1) {
          if (this.userPronos.scores[index].winner === team.code && this.userPronos.scores[index].score === outcome) {
            return;
          }
          this.userPronos.scores[index].winner = team.code;
          this.userPronos.scores[index].score = outcome;
        } else {
          const matchScore = new MatchScore();
          matchScore.matchId = match.id;
          matchScore.winner = team.code;
          matchScore.score = outcome;
          this.userPronos.scores.push(matchScore);
        }
      }
      this.needSaving = true;
    }
    
    startAutoSave() {
      this.intervalId = setInterval(() => {
        if (this.needSaving && !this.saving) {
          this.needSaving = false;
          this.saving = true;
          this.pronoService.setAnswer(this.userPronos, this.dataService.currentUser.userId).subscribe(prono => {
            this.saving = false;
            if (!this.needSaving) {
              this.snackBar.open("Pronostic enregitré", 'x', {duration: 5000});
            }
          });
        }
      }, 1500);
    }
    
    randomize() {
      this.dialog.open(RandomValidationComponent).afterClosed().subscribe(result => {
        if (result) {
          this.saving = true;
          const obs: Observable<Pronostic>[] = [];
          this.currentWeek.pronoDays.forEach(day => {
            day.matchs?.forEach(match => {
              if (!this.isLocked(match)) {
                if (this.userPronos && this.userPronos.scores) {
                  const index = this.userPronos.scores.findIndex(score => score.matchId === match.id);
                  let randomTeam = Math.round(Math.random());
                  let outcome = '';
                  if (match.strategy.count > 1) {
                    outcome = this.getPossibleOutcomes(match.strategy.count)[Math.floor(Math.random() * (match.strategy.count + 1))];
                    const scores = outcome.split('-');
                    const n1 = parseFloat(scores[0]);
                    const n2 = parseFloat(scores[1]);
                    if (n1 > n2) {
                      randomTeam = 0;
                    } else {
                      randomTeam = 1;
                    }
                    this.scoreForMatch[match.id] = outcome;
                  }
                  if (index > -1) {
                    if (this.userPronos.scores[index].winner === match.teams[randomTeam].code && this.userPronos.scores[index].score === outcome) {
                      return;
                    }
                    this.userPronos.scores[index].winner = match.teams[randomTeam].code;
                    this.userPronos.scores[index].score = outcome;
                  } else {
                    const matchScore = new MatchScore();
                    matchScore.matchId = match.id;
                    matchScore.winner = match.teams[randomTeam].code;
                    matchScore.score = outcome;
                    this.userPronos.scores.push(matchScore);
                  }
                }
              }
            });
          });
          this.pronoService.setAnswer(this.userPronos, this.dataService.currentUser.userId).subscribe(() => {
            this.saving = false;
            this.snackBar.open("Pronostics de 1Head enregistrés", 'x', {duration: 5000});
          });
        }
      });
    }
    
    showTheCoin() {
      let showCoin = false;
      if (this.currentWeek) {
        this.currentWeek.pronoDays.forEach(day => {
          day.matchs?.forEach(match => {
            if (!this.isLocked(match)) {
              showCoin = true;
              return;
            }
          });
        });
      }
      return showCoin;
    }
    
    goBack() {
      this.router.navigate([`/grp/${this.dataService.currentGroup.id}`]);
    }
    
    generateOutcomes(bo: number) {
      const maxWins = (bo + 1) / 2;
      const possibleOutcomes = [];
      for (let i = 0; i < maxWins; i++) {
        possibleOutcomes.push(`${maxWins}-${i}`);
      }
      for (let i = 0; i < maxWins; i++) {
        possibleOutcomes.push(`${i}-${maxWins}`);
      }
      return possibleOutcomes;
    }
    
  }
  