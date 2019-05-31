import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

// Flex Layout
import { FlexLayoutModule } from '@angular/flex-layout';

// Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule, MatListModule,
  MatMenuModule, MatOptionModule, MatProgressSpinnerModule, MatSelectModule,
  MatToolbarModule, MatTooltipModule,
  MatDialogModule, MatDividerModule, MatStepperModule, MatTableModule
} from '@angular/material';

// Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { HomeComponent } from './components/public/home/home.component';
import { SummonerComponent } from './components/public/summoner/summoner.component';
import { HttpClientModule } from '@angular/common/http';
import { LivestreamsComponent } from './components/public/livestreams/livestreams.component';
import { SignupModalComponent } from './components/shared/navbar/signup-modal/signup-modal.component';
import { LoginModalComponent } from './components/shared/navbar/login-modal/login-modal.component';
import { UserProfileComponent } from './components/private/user-profile/user-profile.component';
import { StatisticsComponent } from './components/public/statistics/statistics.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    SummonerComponent,
    LivestreamsComponent,
    SignupModalComponent,
    LoginModalComponent,
    UserProfileComponent,
    StatisticsComponent
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatOptionModule,
    MatSelectModule,
    MatListModule,
    MatDialogModule,
    MatDividerModule,
    MatStepperModule,
    MatTableModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    SignupModalComponent,
    LoginModalComponent
  ]
})
export class AppModule { }
