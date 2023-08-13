import { Component, OnInit } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { GroupService } from '../../services/group.service';
import { DataService } from '../../services/data.service';
import { Group } from '../../model/group';
import { CompetitionService } from '../../services/competition.service';
import { Competition } from '../../model/competition';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  
  public groups!: Group[];
  public group!: Group;
  public competitions!: Competition[];
  public loading = false;
  
  constructor(protected groupService: GroupService,
    protected competitionService: CompetitionService,
    protected snackBar: MatSnackBar,
    protected clipboard: Clipboard,
    public dataService: DataService) { }
    
    ngOnInit(): void {
      if (this.dataService.currentUser) {
        this.loading = true;
        this.groupService.getManagedGroups(this.dataService.currentUser.userId).subscribe(groups => {
          this.groups = groups;
          this.loading = false;
          if (this.groups && this.groups.length > 0) {
            this.group = this.groups[0];
          }
        });
        this.competitionService.getAllCurrents().subscribe(competitions => {
          this.competitions = competitions;
        });
      }
    }

    getInviteId() {
      this.groupService.getInviteId(this.group.id, this.dataService.currentUser.userId).subscribe(response => {
        const url = `${window.location.origin}/#/grp/invite/${response.data}`;
        this.clipboard.copy(url);
        this.snackBar.open("URL d'invitation copiée dans le presse-papier", 'x', {duration: 5000});
      });
    }
    
    isCompetitionInGroup(competition: Competition) {
      return this.group.competitions.findIndex(comp => comp === competition.id) > -1;
    }
    
    addOrRemoveCompetition(competition: Competition, $event: any) {
      if (!$event.checked && this.isCompetitionInGroup(competition)) {
        this.groupService.removeCompetitionFromGroup(this.group.id, competition.id, this.dataService.currentUser.userId).subscribe(group => {
          if (this.group.id === group.id) {
            this.group.competitions.splice(this.group.competitions.indexOf(competition.id), 1);
          }
        });
      } else if ($event.checked && !this.isCompetitionInGroup(competition)) {
        this.groupService.addCompetitionToGroup(this.group.id, competition.id, this.dataService.currentUser.userId).subscribe(group => {
          if (this.group.id === group.id) {
            this.group.competitions.push(competition.id);
          }
        });
      }
    }
  }
  