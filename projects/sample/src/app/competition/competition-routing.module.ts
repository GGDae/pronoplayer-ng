import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompetitionComponent } from './competition.component';
import { CompetitionResolver } from '../resolvers/competition-resolver';

const routes: Routes = [
    {
        path: 'grp/:id/:competitionId',
        component: CompetitionComponent,
        resolve: {
            data: CompetitionResolver,
        }
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class CompetitionRoutingModule { }
