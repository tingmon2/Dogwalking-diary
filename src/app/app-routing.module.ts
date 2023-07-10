import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomepageComponent} from "./homepage/homepage.component";
import {AddpageComponent} from "./addpage/addpage.component";
import {ShowpageComponent} from "./showpage/showpage.component";
import {ModifypageComponent} from "./modifypage/modifypage.component";
import {SignupComponent} from './signup/signup.component';
import {AboutpageComponent} from './aboutpage/aboutpage.component';
import {AskloginComponent} from './asklogin/asklogin.component';


const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'home', component: HomepageComponent},
  {path: 'add', component: AddpageComponent},
  {path: 'show', component: ShowpageComponent},
  {path: 'modify/:id', component: ModifypageComponent},
  {path: 'home/signup', component: SignupComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'about', component: AboutpageComponent},
  {path: 'asklogin', component: AskloginComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
