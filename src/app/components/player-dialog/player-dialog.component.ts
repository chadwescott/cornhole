import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Player } from '../../models/player.model';
import { PlayerService } from '../../services/player.service';

export interface PlayerDialogData {
    mode: 'add' | 'edit';
    player?: Player;
}

@Component({
    selector: 'ch-player-dialog',
    templateUrl: './player-dialog.component.html',
    styleUrls: ['./player-dialog.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule
    ]
})
export class PlayerDialogComponent {
    readonly data = inject<PlayerDialogData>(MAT_DIALOG_DATA);

    firstName = this.data.player?.firstName ?? '';
    lastName = this.data.player?.lastName ?? '';
    isSaving = false;
    errorMessage: string | null = null;

    private readonly playerService = inject(PlayerService);
    private readonly dialogRef = inject(MatDialogRef<PlayerDialogComponent>);

    get title(): string {
        return this.data.mode === 'add' ? 'Add Player' : 'Edit Player';
    }

    get actionLabel(): string {
        return this.data.mode === 'add' ? 'Add Player' : 'Save';
    }

    canSave(): boolean {
        const firstName = this.firstName.trim();
        const lastName = this.lastName.trim();

        if (!firstName || !lastName) {
            return false;
        }

        if (this.data.mode === 'add') {
            return true;
        }

        const original = this.data.player;
        if (!original) {
            return false;
        }

        return firstName !== original.firstName || lastName !== original.lastName;
    }

    async save(): Promise<void> {
        if (!this.canSave()) {
            return;
        }

        this.isSaving = true;
        this.errorMessage = null;

        try {
            const firstName = this.firstName.trim();
            const lastName = this.lastName.trim();

            if (this.data.mode === 'add') {
                await this.playerService.createPlayer(firstName, lastName);
            } else {
                const original = this.data.player;
                if (!original) {
                    throw new Error('Missing player data for edit mode.');
                }

                const updatedPlayer: Player = {
                    ...original,
                    firstName,
                    lastName
                };

                await this.playerService.editPlayer(updatedPlayer);
            }

            this.dialogRef.close(true);
        } catch (error) {
            this.errorMessage = error instanceof Error ? error.message : 'Failed to save player';
        } finally {
            this.isSaving = false;
        }
    }

    cancel(): void {
        this.dialogRef.close(false);
    }
}
