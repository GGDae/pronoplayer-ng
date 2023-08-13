import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../model/user';
import { UserService } from '../services/user.service';
import { CompetitionService } from '../services/competition.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  
  public currentUser!: User;
  
  constructor(private route: ActivatedRoute,
    private competitionService: CompetitionService,
    private snackBar: MatSnackBar,
    private userService: UserService) { }
    
    ngOnInit(): void {
      const userId = this.route.snapshot.paramMap.get('id');
      if (!!userId) {
        this.userService.getUser(userId).subscribe(user => {
          this.currentUser = user;
        });
      }
    }
    
    loadMatchs() {
      this.competitionService.loadFromLolesports().subscribe(() => {
        this.snackBar.open("Compétitions mises à jour.", 'x', {duration: 5000});
      });
    }
  }
  