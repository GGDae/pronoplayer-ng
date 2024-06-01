import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { HomeResolver } from './home.resolver';

const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'home', component: HomeComponent, resolve: {data: HomeResolver}}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }
