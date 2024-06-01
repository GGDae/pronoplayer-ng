import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { GroupModule } from '../group/group.module';
import { CompetitionModule } from '../competition/competition.module';
import { MatDialogModule } from '@angular/material/dialog';
import { InfoDialogComponent } from '../header/info-dialog/info-dialog.component';

@NgModule({
  declarations: [
    HomeComponent,
    InfoDialogComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatSidenavModule,
    MatRadioModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    MatSnackBarModule,
    GroupModule,
    CompetitionModule,
    MatDialogModule,
  ]
})
export class HomeModule { }
