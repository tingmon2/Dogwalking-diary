import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-asklogin',
  templateUrl: './asklogin.component.html',
  styleUrls: ['./asklogin.component.css']
})
export class AskloginComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    setTimeout(()=>{
      this.router.navigate(['/home']);
    }, 2000)
  }

}
