import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { RankingComponent } from './ranking.component';
import { RankingRoutingModule } from './ranking-routing.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
    declarations: [
        RankingComponent,
    ],
    imports: [
        CommonModule,
        RankingRoutingModule,
        MatSidenavModule,
        MatRadioModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatTableModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
    ],
    providers: [
        DatePipe,
    ]
})
export class RankingModule { }
