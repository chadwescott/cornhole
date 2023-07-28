import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardComponent } from './components/card/card.component';
import { FullScoreboardComponent } from './components/full-scoreboard/full-scoreboard.component';
import { GameOptionsComponent } from './components/game-options/game-options.component';
import { GameSetupComponent } from './components/game-setup/game-setup.component';
import { GameComponent } from './components/game/game.component';
import { PlayerSelectorComponent } from './components/player-selector/player-selector.component';
import { PlayerStatsComponent } from './components/player-stats/player-stats.component';
import { RoundTeamScoreComponent } from './components/round-team-score/round-team-score.component';
import { RoundThrowsComponent } from './components/round-throws/round-throws.component';
import { RoundComponent } from './components/round/round.component';
import { ScoreboardComponent } from './components/scoreboard/scoreboard.component';
import { TeamColorPickerDialogComponent } from './components/team-color-picker-dialog/team-color-picker-dialog.component';
import { TeamScoreComponent } from './components/team-score/team-score.component';
import { TeamSelectorComponent } from './components/team-selector/team-selector.component';
import { ThrowResultIconComponent } from './components/throw-result-icon/throw-result-icon.component';
import { ThrowResultComponent } from './components/throw-result/throw-result.component';

@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    FullScoreboardComponent,
    GameComponent,
    GameOptionsComponent,
    GameSetupComponent,
    PlayerSelectorComponent,
    PlayerStatsComponent,
    RoundComponent,
    RoundTeamScoreComponent,
    RoundThrowsComponent,
    ScoreboardComponent,
    TeamColorPickerDialogComponent,
    TeamScoreComponent,
    TeamSelectorComponent,
    ThrowResultComponent,
    ThrowResultIconComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatDialogModule,
    MatInputModule,
    MatRadioModule,
    MatTabsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
