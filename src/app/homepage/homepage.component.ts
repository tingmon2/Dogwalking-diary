import {Component, NgZone, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {DatabaseService} from "../services/database.service";
import {PagecontrolService} from '../services/pagecontrol.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {


  constructor(private builder: FormBuilder, private database: DatabaseService,
              private router:Router, private zone: NgZone) {
    this.zone.run(() => {
      console.log('zone test');
    });
  }

  isLoggedIn: string;
  userName: string;

  ngOnInit(): void {
    console.log("homepage init");
    this.database.getDatabase();
    this.isLoggedIn = localStorage.getItem('isLoggedIn');
    this.userName = localStorage.getItem('userName');
    localStorage.setItem('isChecked', "false");
    localStorage.setItem('isOverlap', "false");
  }

  readLocalStorage(key: string): string{
    return localStorage.getItem(key);
  }

  formName = "Sign In Form";

  feedbackForm = this.builder.group({
    _name:['Thomas', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
    _email:['', [Validators.required, Validators.email]],
    _password:['', [Validators.required]],
  }, {});

  getEmail(){
    return this.feedbackForm.get('_email');
  }

  getPassword(){
    return this.feedbackForm.get('_password');
  }

  btnSubmit_click(){
    console.info(this.feedbackForm.value);
    console.info(this.feedbackForm.get('_email').value);
    console.info(this.getPassword().value);

    let email:string = this.feedbackForm.get('_email').value;
    let password:string = this.feedbackForm.get('_password').value;

    this.database.loginUser(email, password, ()=>{});
    setTimeout(()=>{
      this.userName = localStorage.getItem('userName');
      this.zone.run(() => {
        console.info("zone after login")
        this.router.navigate(['/home']);
      });
    }, 100);
  }



}
