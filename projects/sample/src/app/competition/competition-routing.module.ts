import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompetitionComponent } from './competition.component';

const routes: Routes = [
    { path: 'grp/:id/:competitionId', component: CompetitionComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class CompetitionRoutingModule { }
