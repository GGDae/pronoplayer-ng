import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatRadioModule } from '@angular/material/radio';
import { GroupComponent } from '../group/group.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { GroupRoutingModule } from './group-routing.module';
import { JoinComponent } from './join/join.component';
import { ManageComponent } from './manage/manage.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';


@NgModule({
    declarations: [
        GroupComponent,
        JoinComponent,
        ManageComponent,
        BreadcrumbComponent,
    ],
    imports: [
        CommonModule,
        GroupRoutingModule,
        MatSidenavModule,
        MatRadioModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
    ],
    exports: [
        BreadcrumbComponent,
        GroupComponent,
    ],
    providers: [
        DatePipe,
    ]
})
export class GroupModule { }
