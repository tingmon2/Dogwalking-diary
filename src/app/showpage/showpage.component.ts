import {Component, OnInit} from '@angular/core';
import {DatabaseService} from "../services/database.service";
import {Router} from "@angular/router";
import {Diary} from '../models/Diary';

@Component({
    selector: 'app-showpage',
    templateUrl: './showpage.component.html',
    styleUrls: ['./showpage.component.css']
})
export class ShowpageComponent implements OnInit {
    diaries: Diary[] = [];
    userAuth: string;
    name: string;
    admin: string;
    constructor(private database: DatabaseService,
                private router: Router) {
    }

    ngOnInit(): void {
      if(localStorage.getItem('userAuth') == "1"){
        this.name = "Show All";
        this.userAuth = "true";
        this.admin = "Admin Mode";
      }
      else{
        this.name = localStorage.getItem('userName');
        this.userAuth = "false";
      }
      if(localStorage.getItem('isLoggedIn') == 'false'){
        this.router.navigate(['asklogin']);
      }
      else{
        console.log("showpage init");
        this.diaries = [];
        this.database.selectAllDiaries(parseInt(localStorage.getItem('currentUser')),
          parseInt(localStorage.getItem('userAuth'))).subscribe((data)=>{
          console.info(data);
          this.diaries = data;
        }, (err)=>{
          console.log(err);
        });
      }
    }

    readLocalStorage(key: string): string{
      return localStorage.getItem(key);
    }

    btnModify_click(diary: Diary){
        this.router.navigate(['modify/' + diary.id]);
    }

    btnDelete_click(diary: Diary){
        let flag = confirm("Are you sure?");
        console.info(flag);
        function callback(){
            console.info("Record deleted successfully");
        }
        this.database.deleteDiary(diary, callback);

        let index = this.diaries.indexOf(diary);
        this.diaries.splice(index, 1);

    }
}
