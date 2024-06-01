import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent {
  
  constructor(public dataService: DataService,
    public router: Router) { }
    
    goToLink(url: string, first: boolean) {
      this.router.navigate([url]);
    }
    
  }
  