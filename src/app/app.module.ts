import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ReactiveFormsModule} from "@angular/forms";
import { NavComponent } from './nav/nav.component';
import { AddpageComponent } from './addpage/addpage.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ShowpageComponent } from './showpage/showpage.component';
import { ModifypageComponent } from './modifypage/modifypage.component';
import { SignupComponent } from './signup/signup.component';
import { AboutpageComponent } from './aboutpage/aboutpage.component';
import { AskloginComponent } from './asklogin/asklogin.component';

@NgModule({
    declarations: [
        AppComponent,
        NavComponent,
        AddpageComponent,
        HomepageComponent,
        ShowpageComponent,
        ModifypageComponent,
        SignupComponent,
        AboutpageComponent,
        AskloginComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
