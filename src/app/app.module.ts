import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './components/game/game.component';
import { RoundComponent } from './components/round/round.component';
import { ScoreboardComponent } from './components/scoreboard/scoreboard.component';
import { ThrowResultComponent } from './components/throw-result/throw-result.component';

@NgModule({
  declarations: [
    AppComponent,
    ThrowResultComponent,
    RoundComponent,
    GameComponent,
    ScoreboardComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    MatTabsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
