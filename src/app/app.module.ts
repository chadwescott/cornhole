import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './components/game/game.component';
import { RoundComponent } from './components/round/round.component';
import { ScoreboardComponent } from './components/scoreboard/scoreboard.component';
import { ThrowResultComponent } from './components/throw-result/throw-result.component';
import { RoundThrowsComponent } from './components/round-throws/round-throws.component';
import { TeamScoreComponent } from './components/team-score/team-score.component';

@NgModule({
  declarations: [
    AppComponent,
    ThrowResultComponent,
    RoundComponent,
    GameComponent,
    ScoreboardComponent,
    RoundThrowsComponent,
    TeamScoreComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatTabsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
