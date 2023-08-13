import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { CompetitionService } from '../services/competition.service';
import { Competition } from '../model/competition';
import { Standing } from '../model/standing';
import { Stage } from '../model/stage';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss']
})
export class StandingsComponent implements OnInit {
  
  public competitions!: Competition[];
  public competition!: Competition;
  public standing!: Standing;
  public smallScreen = false;
  public currentStage!: Stage;
  
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }
  
  private checkScreenSize() {
    this.smallScreen = window.innerWidth <= 599;
  }
  
  
  constructor(public dataService: DataService,
    protected competitionService: CompetitionService,
    protected cd: ChangeDetectorRef) { }
    
    ngOnInit(): void {
      this.checkScreenSize();
      this.competitionService.getAllCurrents().subscribe(competitions => {
        this.competitions = competitions;
        if (this.dataService.currentCompetition) {
          this.competition = this.competitions.find(c => c.id === this.dataService.currentCompetition.id) || this.competitions[0];
        }
        if (this.competition) {
          this.selectCompetition();
        }
      });
    }
    
    selectCompetition() {
      this.dataService.currentCompetition = this.competition;
      this.competitionService.getStandings(this.competition.id).subscribe(standing => {
        this.standing = standing;
        if (this.standing.stages && this.standing.stages.length > 0) {
          this.currentStage = this.standing.stages[0];
        }
      });
    }
    
  }
  