import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../model/user';
import { UserService } from '../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from '../services/data.service';
import { Badge } from '../model/badge';
import { UserDiscord } from '../model/userDiscord';
import { Competition } from '../model/competition';
import { CompetitionService } from '../services/competition.service';
import { GroupService } from '../services/group.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  
  public currentUser!: User;
  public darkMode!: boolean;
  private codeLength = 20;
  private characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  public competitions!: Competition[];
  public competitionNames!: string[];
  public loading = false;
  
  constructor(private route: ActivatedRoute,
    public dataService: DataService,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private competitionService: CompetitionService,
    private groupService: GroupService) {}
    
    ngOnInit(): void {
      const userId = this.route.snapshot.paramMap.get('id');
      this.darkMode = this.dataService.theme === 'dark';
      if (!!userId) {
        if (this.dataService.currentUser && this.dataService.currentUser.userId === userId) {
          this.userService.getUser(userId).subscribe(user => {
            this.currentUser = user;
            this.getCompetitions();
          });
        } else {
          this.userService.getLightUser(userId).subscribe(user => {
            this.currentUser = user;
          });
        }
      }
    }
    
    getCompetitions() {
      if (this.currentUser && this.currentUser.groups) {
        const compIds: string[] = [];
        this.currentUser.groups.forEach(group => {
          this.groupService.getGroup(group.id).subscribe(actualGroup => {
            actualGroup.competitions.forEach(competition => {
              if (!compIds.includes(competition)) {
                compIds.push(competition);
              }
            });
            this.competitionService.getAllByIds(compIds).subscribe(results => {
              this.competitionNames = results.reduce((acc: string[], comp) => {
                if (acc.indexOf(comp.name) === -1) {
                  acc.push(comp.name);
                }
                return acc;
              }, []);
              this.competitions = results.filter(c => c.current);
            });
          });
        });
      }
    }
    
    switchMode() {
      this.darkMode = !this.darkMode;
      this.dataService.theme = this.darkMode ? 'dark': 'light';
    }
    
    updateBadge(badge: Badge, value: boolean) {
      this.currentUser.badges?.forEach(b => b.active = false);
      badge.active = value;
      this.save();
    }
    
    save() {
      this.loading = true;
      this.userService.updateCurrentUser(this.currentUser).subscribe(() => {
        this.loading = false;
        this.snackBar.open('Profil mis à jour.', 'x', {duration: 5000});
      });
    }
    
    notifyCopy() {
      this.snackBar.open('Copié !', 'x', {duration: 5000});
    }
    
    generateDiscordCode() {
      const code = this.generateRandomString();
      if (!this.currentUser.discord) {
        this.currentUser.discord = new UserDiscord();
      }
      this.currentUser.discord.code = code;
      this.save();
    }
    
    generateRandomString() {
      let result = '';
      
      for (let i = 0; i < this.codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * this.characters.length);
        result += this.characters.charAt(randomIndex);
      }
      
      return result;
    }
    
    areNotificationEnabled(competition: string) {
      if (this.currentUser.discord?.competitions) {
        return this.currentUser.discord?.competitions.includes(competition);
      }
      return false;
    }
    
    addOrRemoveNotification(competition: string, $event: any) {
      if (this.currentUser.discord) {
        if (!this.currentUser.discord.competitions) {
          this.currentUser.discord.competitions = [];
        }
        if ($event.checked) {
          this.currentUser.discord?.competitions.push(competition);
        } else {
          this.currentUser.discord.competitions = this.currentUser.discord?.competitions.filter(c => c !== competition);
        }
        this.save();
      }
    }
  }
  