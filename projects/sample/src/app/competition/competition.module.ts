import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { CompetitionComponent } from './competition.component';
import { CompetitionRoutingModule } from './competition-routing.module';
import { RandomValidationComponent } from './random-validation/random-validation.component';
import { GroupModule } from '../group/group.module';


@NgModule({
  declarations: [
    CompetitionComponent,
    RandomValidationComponent,
  ],
  imports: [
    CommonModule,
    CompetitionRoutingModule,
    MatSidenavModule,
    MatRadioModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    GroupModule,
  ],
  exports: [
    CompetitionComponent,
  ]
})
export class CompetitionModule { }
