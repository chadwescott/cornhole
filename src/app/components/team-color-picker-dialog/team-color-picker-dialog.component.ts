import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { TEAM_COLORS } from '../../constants/team-color.constants';
import { DesignOptions } from '../../models/design-options.enum';
import { TeamColor } from '../../models/team-color';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'ch-team-color-picker-dialog',
  templateUrl: './team-color-picker-dialog.component.html',
  styleUrls: ['./team-color-picker-dialog.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    MatButtonModule,
    MatDialogModule,
    MatRadioModule
  ]
})
export class TeamColorPickerDialogComponent {
  designOptions = DesignOptions;
  teamColors = TEAM_COLORS;
  teamColor: TeamColor;
  data = inject<any>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<TeamColorPickerDialogComponent>);

  constructor() {
    this.teamColor = new TeamColor(this.data.teamColor.colorScheme, this.data.teamColor.design);
  }

  onDesignChanged(change: MatRadioChange): void {
    this.teamColor.design = change.value;
  }

  selectColorScheme(color: TeamColor): void {
    this.teamColor.colorScheme = color.colorScheme
  }

  onOk(): void {
    this.dialogRef.close(this.teamColor);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
