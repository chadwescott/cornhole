import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TeamColor } from 'src/app/models/team-color';

import { MatRadioChange } from '@angular/material/radio';
import { TEAM_COLORS } from '../../constants/team-color.constants';
import { DesignOptions } from '../../models/design-options.enum';

@Component({
  selector: 'ch-team-color-picker-dialog',
  templateUrl: './team-color-picker-dialog.component.html',
  styleUrls: ['./team-color-picker-dialog.component.scss']
})
export class TeamColorPickerDialogComponent {
  designOptions = DesignOptions;
  teamColors = TEAM_COLORS;
  teamColor: TeamColor;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<TeamColorPickerDialogComponent>) {
    this.teamColor = new TeamColor(data.teamColor.colorScheme, data.teamColor.design);
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
