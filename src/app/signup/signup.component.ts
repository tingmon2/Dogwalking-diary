import {Component, NgZone, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {DatabaseService} from "../services/database.service";
import {PagecontrolService} from '../services/pagecontrol.service';
import {User} from '../models/User';
import {Router} from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  formName = "Sign Up Form"
  isChecked: string;
  isOverlap: string;
  test: number = 0;

  constructor(private builder: FormBuilder, private database: DatabaseService, private router: Router,
              private page: PagecontrolService, private zone: NgZone) {
    this.zone.run(() => {
      console.log('zone test');
    });
  }

  signUpForm = this.builder.group({
    _name:['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
    _authId:['',[Validators.required]],
    _email:['', [Validators.required, Validators.email]],
    passwordGroup: this.builder.group({
      _password:['', [Validators.required]],
      _verifyPassword:['', [Validators.required]]
    },{validators: this.mathPassword})
  }, {});

  getName(){
    return this.signUpForm.get('_name');
  }

  getEmail(){
    return this.signUpForm.get('_email');
  }

  getPassword(){
    return this.signUpForm.get('passwordGroup').get('_password');
  }

  getVerifyPassword(){
    return this.signUpForm.get('passwordGroup').get('_verifyPassword');
  }

  mathPassword(group: AbstractControl): any{
    let password = group.get('_password');
    let verifyPassword = group.get('_verifyPassword');

    if(password.value === verifyPassword.value){
      return null;
    }
    else{
      return{'passwordMismatchError': true}
    }
  }

  readLocalStorage(){
    this.isOverlap = localStorage.getItem('isOverlap');
    this.isChecked = localStorage.getItem('isChecked');
  }

  btnCheckEmail_click(){
    this.database.checkDuplicateEmail(this.signUpForm.get('_email').value);
    this.readLocalStorage();
  }

  onEmailChange(){
    localStorage.setItem('isChecked', "false");
  }

  btnSubmit_click(){
      console.info(this.signUpForm.value);

      let user: User = new User(
        this.signUpForm.get('_authId').value,
        this.signUpForm.get('_name').value,
        this.signUpForm.get('_email').value,
        this.signUpForm.get('passwordGroup').get('_password').value);

      console.info(user);
      let flag:boolean = this.page.beforeSignUp();
      if(flag){
        this.page.verifyEmailFirst();
        this.database.insertUser(user, ()=>{
          setTimeout(()=>{
            // this.router.navigate(['/home']).then(()=>{window.location.reload();});
            this.zone.run(() => {
              console.info('zone in signup');
              this.router.navigate(['/home']);
            });
          }, 1000);
          alert("User Created");
        });
      }
      this.page.verifyEmailFirst();
  }

  ngOnInit(): void {
  }
}
