import {Component, NgZone, OnInit} from '@angular/core';
import {createWebpackLoggingCallback} from '@angular-devkit/build-angular/src/webpack/utils/stats';
import {Router} from '@angular/router';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
    title: string = "Home";
    isLoggedIn: string;
    isCollapsed = false;


    constructor(private router: Router, private zone: NgZone) {
      if(!localStorage.getItem('isLoggedIn')){
        localStorage.setItem('isLoggedIn', 'false');
        console.log("constructor");
      }
    }

    ngOnInit(): void {
      this.isLoggedIn = this.readLocalStorage('isLoggedIn');
      console.log("onInit");
    }

    readLocalStorage(key: string): string{
      return localStorage.getItem(key);
      console.log("readLocalStorage");
    }

    logOut(): void{
      localStorage.setItem("isLoggedIn", "false");
      localStorage.setItem("currentUser", "0");
      setTimeout(()=>{
        // this.router.navigate(['/home']).then(()=>{window.location.reload();})
        this.zone.run(()=>{
          console.log("zone in nav");
          this.router.navigate(['/home']);
        });
      }, 100);
      alert("Good bye!");
    }
}
