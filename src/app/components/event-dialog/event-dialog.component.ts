import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { SupabaseEvent } from '../../models/supabase/supabase-event.model';
import { EventService } from '../../services/event.service';

export interface EventDialogData {
    mode: 'add' | 'edit';
    event?: SupabaseEvent;
}

@Component({
    selector: 'ch-event-dialog',
    templateUrl: './event-dialog.component.html',
    styleUrls: ['./event-dialog.component.scss'],
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
export class EventDialogComponent {
    readonly data = inject<EventDialogData>(MAT_DIALOG_DATA);

    name = this.data.event?.name ?? '';
    eventDate = this.data.event?.event_date ?? '';
    isSaving = false;
    errorMessage: string | null = null;

    private readonly eventService = inject(EventService);
    private readonly dialogRef = inject(MatDialogRef<EventDialogComponent>);

    get title(): string {
        return this.data.mode === 'add' ? 'Add Event' : 'Edit Event';
    }

    get actionLabel(): string {
        return this.data.mode === 'add' ? 'Add Event' : 'Save';
    }

    canSave(): boolean {
        const name = this.name.trim();
        const eventDate = this.eventDate.trim();

        if (!name || !eventDate) {
            return false;
        }

        if (this.data.mode === 'add') {
            return true;
        }

        const original = this.data.event;
        if (!original) {
            return false;
        }

        return name !== original.name || eventDate !== original.event_date;
    }

    async save(): Promise<void> {
        if (!this.canSave()) {
            return;
        }

        this.isSaving = true;
        this.errorMessage = null;

        try {
            const name = this.name.trim();
            const eventDate = this.eventDate.trim();

            if (this.data.mode === 'add') {
                await this.eventService.createEvent(name, eventDate);
            } else {
                const original = this.data.event;
                if (!original) {
                    throw new Error('Missing event data for edit mode.');
                }

                await this.eventService.updateEvent(original.id, name, eventDate);
            }

            this.dialogRef.close(true);
        } catch (error) {
            this.errorMessage = error instanceof Error ? error.message : 'Failed to save event';
        } finally {
            this.isSaving = false;
        }
    }

    cancel(): void {
        this.dialogRef.close(false);
    }
}