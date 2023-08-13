import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from '../../services/group.service';
import { Group } from '../../model/group';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})
export class JoinComponent implements OnInit {
  
  public group!: Group;
  public alreadyMember = false;
  
  constructor(private route: ActivatedRoute,
    private router: Router,
    protected dataService: DataService,
    protected groupService: GroupService,
    protected cd: ChangeDetectorRef) { }
    
    ngOnInit(): void {
      const id = this.route.snapshot.paramMap.get('id');
      if (this.dataService.currentUser && !!id) {
        this.groupService.getGroupByIdOrInviteId(id).subscribe(group => {
          const a = this.dataService.currentUser.groups?.findIndex(g => g.id === group.id);
          if (a !== undefined && a > -1) {
            this.alreadyMember = true;
          }
          this.group = group;
        });
      }
    }
    
    joinGroup() {
      this.groupService.joinGroup(this.group.id, this.dataService.currentUser.userId).subscribe((group: Group) => {
        this.dataService.currentGroup = group;
        this.router.navigate([`grp/${group.id}`]);
      });
    }
    
  }
  