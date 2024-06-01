import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { GroupService } from '../services/group.service';
import { CompetitionService } from '../services/competition.service';

@Injectable({
    providedIn: 'root'
})
export class CompetitionResolver implements Resolve<any[]> {
    constructor(private groupService: GroupService,
        private competitionService: CompetitionService) {}
        
        resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any[]> {
            const splittedUrl = state.url.split('/');
            const obs = [];
            if (splittedUrl.length > 2 && splittedUrl.length < 5) {
                obs.push(this.groupService.getGroup(splittedUrl[2]));
                
                if (splittedUrl.length === 4) {
                    obs.push(this.competitionService.getCompetition(splittedUrl[3]));
                }
            }
            return forkJoin(obs);
        }
    }
    