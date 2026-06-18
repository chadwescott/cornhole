import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { CardComponent } from '../card/card.component';

export interface PlayerAddDialogData {
  firstName: string;
  lastName: string;
}

@Component({
  selector: 'ch-player-add-dialog',
  templateUrl: './player-add-dialog.component.html',
  styleUrls: ['./player-add-dialog.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class PlayerAddDialogComponent {
  firstName: string = '';
  lastName: string = '';

  private dialogRef = inject(MatDialogRef<PlayerAddDialogComponent>);

  onAdd(): void {
    if (this.firstName.trim() && this.lastName.trim()) {
      this.dialogRef.close({
        firstName: this.firstName.trim(),
        lastName: this.lastName.trim()
      } as PlayerAddDialogData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
