import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './components/public/home/home.component';
import {SummonerComponent} from './components/public/summoner/summoner.component';
import {LivestreamsComponent} from './components/public/livestreams/livestreams.component';
import {UserProfileComponent} from './components/private/user-profile/user-profile.component';
import {StatisticsComponent} from './components/public/statistics/statistics.component';
import {ErrorComponent} from "./components/public/error/error.component";
import {NewsComponent} from "./components/public/news/news.component";

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'summoner/:region/:name', component: SummonerComponent},
  {path: 'livestreams', component: LivestreamsComponent},
  {path: 'profile', component: UserProfileComponent},
  {path: 'statistics', component: StatisticsComponent},
  {path: 'error', component: ErrorComponent},
  {path: 'news/:id', component: NewsComponent},
  {path: '**', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
