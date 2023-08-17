import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-random-validation',
  templateUrl: './random-validation.component.html',
  styleUrls: ['./random-validation.component.scss']
})
export class RandomValidationComponent implements OnInit {

  constructor(public dialog: MatDialogRef<RandomValidationComponent>) { }

  ngOnInit(): void {
  }

  onValidate() {
    this.dialog.close(true);
  }

}
