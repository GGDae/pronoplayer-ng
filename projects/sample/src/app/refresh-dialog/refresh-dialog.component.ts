import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-refresh-dialog',
  templateUrl: './refresh-dialog.component.html',
  styleUrls: ['./refresh-dialog.component.scss']
})
export class RefreshDialogComponent implements OnInit {



  constructor(public dialog: MatDialogRef<RefreshDialogComponent>) { }

  ngOnInit(): void {
  }

  onValidate() {
    this.dialog.close(true);
  }

}
