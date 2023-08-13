import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupComponent } from './group.component';
import { JoinComponent } from './join/join.component';
import { ManageComponent } from './manage/manage.component';

const routes: Routes = [
    { path: 'grp/manage', component: ManageComponent},
    { path: 'grp/:id', component: GroupComponent},
    { path: 'grp/invite/:id', component: JoinComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class GroupRoutingModule { }
