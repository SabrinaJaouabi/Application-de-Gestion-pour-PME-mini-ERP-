import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-app-success-dialog-component',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './app-success-dialog-component.component.html',
  styleUrl: './app-success-dialog-component.component.css'
})
export class AppSuccessDialogComponentComponent {
constructor(@Inject(MAT_DIALOG_DATA) public data: {
    title?: string;
    message: string;
    confirmText?: string;
  }) {}
}
