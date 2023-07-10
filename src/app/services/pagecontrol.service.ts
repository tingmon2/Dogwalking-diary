import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PagecontrolService {

  constructor() { }

  verifyEmailFirst(){
    var lv = document.getElementById("checkEmailMessage");
    if(localStorage.getItem('isChecked') == 'false' || localStorage.getItem('isOverlap') == 'true'){
      lv.innerText="Pass email duplication test to proceed";
    }
    else{
      lv.innerText="";
    }
  }

  beforeSignUp():boolean{
    if(localStorage.getItem('isChecked') == 'true'){
      if(localStorage.getItem('isOverlap') == 'false'){
        return true;
      }
    }
    return false;
  }
}
