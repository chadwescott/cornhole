import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmDialogData {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}

@Component({
    selector: 'ch-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss'],
    standalone: true,
    imports: [MatDialogModule, MatButtonModule]
})
export class ConfirmDialogComponent {
    data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
    private readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);

    confirmText = this.data.confirmText ?? 'Confirm';
    cancelText = this.data.cancelText ?? 'Cancel';

    confirm(): void {
        this.dialogRef.close(true);
    }

    cancel(): void {
        this.dialogRef.close(false);
    }
}
