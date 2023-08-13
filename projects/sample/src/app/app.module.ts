import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { HomeModule } from './home/home.module';
import { ProfileModule } from './profile/profile.module';
import { GroupModule } from './group/group.module';
import { RankingModule } from './ranking/ranking.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FooterComponent } from './footer/footer.component';
import { AboutComponent } from './about/about.component';
import { LocationStrategy } from '@angular/common';
import { HashPreserveQueryLocationStrategy } from './strategy/hash-preserve-query-location-strategy';
import { CompetitionModule } from './competition/competition.module';
import { MatDialogModule } from '@angular/material/dialog';
import { StandingsModule } from './standings/standings.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { RefreshDialogComponent } from './refresh-dialog/refresh-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    AboutComponent,
    RefreshDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    HomeModule,
    ProfileModule,
    GroupModule,
    RankingModule,
    StandingsModule,
    CompetitionModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashPreserveQueryLocationStrategy},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
