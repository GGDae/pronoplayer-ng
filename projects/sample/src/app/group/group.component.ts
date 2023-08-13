import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Competition } from '../model/competition';
import { CompetitionService } from '../services/competition.service';
import { PronosticService } from '../services/pronostic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from '../services/group.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {
  
  public competitions!: Competition[];
  public currentCompetition!: Competition;
  
  constructor(public dataService: DataService,
    protected competitionService: CompetitionService,
    protected pronoService: PronosticService,
    protected groupService: GroupService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected cd: ChangeDetectorRef) {
    }
    
    ngOnInit(): void {
      const groupId = this.route.snapshot.paramMap.get('id');
      if (this.dataService.currentUser) {
        if (groupId) {
          this.groupService.getGroup(groupId).subscribe(group => {
            this.dataService.currentGroup = group;
            this.competitionService.getAllByIds(group.competitions).subscribe(competitions => {
              this.competitions = competitions.filter(comp => comp.current);
              this.cd.markForCheck();
            });
          });
        }
      }
    }
    
    selectCompetition(competition: Competition) {
      this.router.navigate([`grp/${this.dataService.currentGroup.id}/${competition.id}`]);
    }
    
    goBack() {
      this.router.navigate(['/']);
    }
  }
  