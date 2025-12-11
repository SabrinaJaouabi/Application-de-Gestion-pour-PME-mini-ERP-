import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-app-confirm-dialog',
  standalone: true,
imports: [MatDialogModule, MatButtonModule],
  templateUrl: './app-confirm-dialog.component.html',
  styleUrl: './app-confirm-dialog.component.css'
})
export class AppConfirmDialogComponent {
constructor(
    public dialogRef: MatDialogRef<AppConfirmDialogComponent>
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
