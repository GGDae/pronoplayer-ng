import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { StandingsComponent } from './standings.component';
import { StandingsRoutingModule } from './standings-routing.module';
import { MatTooltipModule } from '@angular/material/tooltip';



@NgModule({
  declarations: [
    StandingsComponent
  ],
  imports: [
    CommonModule,
    StandingsRoutingModule,
    MatSidenavModule,
    MatRadioModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
  ]
})
export class StandingsModule { }
