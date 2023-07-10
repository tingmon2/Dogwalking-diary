import {Injectable} from '@angular/core';
import {Authority} from "../models/Authority";
import {Observable} from "rxjs";
import {User} from '../models/User';
import {Diary} from '../models/Diary';

//both will work
// declare function openDatabase(shortName, version, displayName, dbSize, dbCreateSuccess): any;
declare const openDatabase;

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {
    private db: any = null;

    constructor() {
    }

    private static errorHandler(error): any {
        console.error("Error : " + error.message);
    }

    getDatabase(): any {
        this.initDB();
        return this.db;
    }

    initDB() {
        if (this.db == null) {
            try {
                this.createDatabase();
                this.createTables();
            } catch (e) {
                console.error("Error in initDB(): " + e);
            }
        }
    }

    private dropTables(): void {

    }

    public deleteDB(): void {
        this.dropTables();
        console.info("dropTables function not implemented, database NOT deleted");
    }

    private createDatabase(): any {
        var shortName = "DiaryDB";
        var version = "1.0";
        var displayName = "DB for Angular Diary App";
        var dbSize = 2 * 1024 * 1024;

        function dbCreateSuccess() {
            console.info("Success: Database created successfully.");
        }

        this.db = openDatabase(shortName, version, displayName, dbSize, dbCreateSuccess);
    }

    private createTables(): void {

      function txFunction(tx: any): void {
        let sql: string[] = [];
        if(localStorage.getItem("tables") !== "true"){
          sql = [
            "CREATE TABLE IF NOT EXISTS authorities("
            + "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "
            + "name VARCHAR(20) NOT NULL);",
            "INSERT INTO authorities VALUES(NULL, 'Admin');",
            "INSERT INTO authorities VALUES(NULL, 'Customer');",
            "CREATE TABLE IF NOT EXISTS users("
            + "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "
            + "authId INTEGER NOT NULL, "
            + "name VARCHAR(20) NOT NULL, "
            + "email VARCHAR(40) NOT NULL, "
            + "password VARCHAR(20) NOT NULL); ",
            "CREATE TABLE IF NOT EXISTS diaries("
            + "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "
            + "userId INTEGER NOT NULL, "
            + "title VARCHAR(20) NOT NULL, "
            + "date VARCHAR(20) NOT NULL, "
            + "content TEXT, "
            + "latitude FLOAT(25), "
            + "longitude FLOAT(25)); "];
          console.info("Creating Table....");
          localStorage.setItem("tables", "true");
        }

        var options = [];

        function successCreate() {
            console.info("Success: Create Table successful");
        }
        for (let i = 0; i < sql.length; i++){
          console.info(sql[i]);
          tx.executeSql(sql[i], options, successCreate, DatabaseService.errorHandler);
        }
      }
      function successTransaction() {
          console.info("Success: Transaction successful");
      }
      this.getDatabase().transaction(txFunction, DatabaseService.errorHandler, successTransaction);
    }

    public loginUser(email: string, password: string, callback){
      let flag: boolean = false;
      function txFunction(tx){
        let sql = 'SELECT * FROM users WHERE email=? AND password=?;';
        let options = [email, password];
        tx.executeSql(sql, options, (tx, results)=>{
          console.info("search result: " + results)
          for (let i = 0; i < results.rows.length; i++) {
            console.info(results.rows[i]);
            let row = results.rows[i];
            if(row['email'] == email && row['password'] == password){
              alert('Hello!');
              flag = true;
              localStorage.setItem('currentUser', row['id'].toString());
              localStorage.setItem('userAuth', row['authId']);
              localStorage.setItem('isLoggedIn', 'true');
              localStorage.setItem('userName', row['name']);
            }
          }
        }, DatabaseService.errorHandler);
      }
      function successTransaction(){
        if(flag == false){
          // alert("Wrong email or password");
          var lv = document.getElementById("loginErrorMessage");
          lv.innerText="Wrong email or password";
        }
        console.info('Success: Login user transaction successful');
      }
      this.getDatabase().transaction(txFunction, DatabaseService.errorHandler, successTransaction);
    }

    public checkDuplicateEmail(email: string){
      function txFunction(tx){
        localStorage.setItem('isChecked', "true");
        localStorage.setItem('isOverlap', 'false');
        var sql = 'SELECT * FROM users WHERE email=?;';
        var options = [email];
        tx.executeSql(sql, options, (tx, results)=>{
          for (let i = 0; i < results.rows.length; i++) {
            let row = results.rows[i];
            if(row['email'] == email){
              console.info("duplicate true");
              localStorage.setItem('isOverlap', 'true');
            }
          }
        }, DatabaseService.errorHandler);
      }
      function successTransaction(){
        console.info("check done  " + localStorage.getItem('isOverlap'));

        var lv = document.getElementById("duplicateFlag");
        if(localStorage.getItem('isOverlap') == 'true'){
          lv.setAttribute("src", "assets/img/x.png");
          lv.setAttribute("style", "width:35px;");
          alert("Same email exists. Enter another email and check again");
        }
        else{
          lv.setAttribute("src", "assets/img/ok.png");
          lv.setAttribute("style", "width:35px;");
          alert("You can use this email");
        }
      }
      this.getDatabase().transaction(txFunction, DatabaseService.errorHandler, successTransaction);
    }

    public insertUser(user: User, callback){
      console.info("insert running");
      function txFunction(tx){
        var sql = 'INSERT INTO users(authId, name, email, password) VALUES(?, ?, ?, ?);';
        console.info(user.password);
        var options = [user.authId, user.name, user.email, user.password];
        tx.executeSql(sql, options, callback, DatabaseService.errorHandler);
      }
      function successTransaction() {
        console.info('Success: insert user transaction successful');
        localStorage.setItem('isLoggedIn', "false");
      }
      this.getDatabase().transaction(txFunction, DatabaseService.errorHandler, successTransaction);
    }

    public insertDiary(diary: Diary, callback){
      function txFunction(tx){
        var sql = 'INSERT INTO diaries(userId, title, date, content, latitude, longitude) VALUES(?, ? ,? ,?, ?, ?);';
        var options = [diary.userId, diary.title, diary.date, diary.content, diary.latitude, diary.longitude];
        tx.executeSql(sql, options, callback, DatabaseService.errorHandler);
      }
      function successTransaction() {
        console.info('Success: insert diary transaction successful');
      }
      this.getDatabase().transaction(txFunction, DatabaseService.errorHandler, successTransaction);
    }

    public selectAllDiaries(userId: number, authId: number): Observable<any>{
      let options = [userId];
      let diaries: Diary[] = [];
      let sql = "";
      console.info("select all: " + userId);
      function txFunction(tx){
        if(authId == 1){
          console.info("select all admin");
          sql = 'SELECT * FROM diaries;';
          options = [];
        }
        else{
          console.info("select all customer");
          sql = 'SELECT * FROM diaries WHERE userId=?;';
        }
        tx.executeSql(sql, options, (tx, results)=>{
          for (let i = 0; i < results.rows.length; i++) {
            console.log(i);
            let row = results.rows[i];
            let d = new Diary();
            d.id = row['id'];
            d.userId = row['userId'];
            d.title = row['title'];
            d.date = row['date'];
            d.content = row['content'];
            d.latitude = row['latitude'];
            d.longitude = row['longitude'];
            diaries.push(d);
          }
        }, DatabaseService.errorHandler);
      }

      function successTransaction() {
        console.info('Success: selectAll Diaries transaction successful');
      }

      this.getDatabase().transaction(txFunction, DatabaseService.errorHandler, successTransaction);

      return new Observable<any>((observer)=>{
        setTimeout(()=>{
          if (diaries.length != 0) {
            observer.next(diaries);
          } else{
            observer.error('Select All returned 0 records');
          }
        }, 200);

      });
    }

    public deleteDiary(diary: Diary, callback): void{
      function txFunction(tx){
        let sql = 'DELETE FROM diaries WHERE id=?;';
        let options = [diary.id];
        tx.executeSql(sql, options, callback, DatabaseService.errorHandler);
      }
      function successTransaction() {
        console.info('Success: delete diary transaction successful');
      }
      this. getDatabase().transaction(txFunction, DatabaseService.errorHandler, successTransaction);
    }

    public selectDiary(id: number): Observable<any>{
      let options = [id];
      let diary: Diary = null;
      function txFunction(tx){
        let sql = 'SELECT * FROM diaries WHERE id=?;';
        tx.executeSql(sql, options, (tx, result) => {
          let row = result.rows[0];
          diary = new Diary();
          diary.id = row['id'];
          diary.userId = row['userId'];
          diary.title = row['title'];
          diary.date = row['date'];
          diary.content = row['content'];
          diary.latitude = row['latitude'];
          diary.longitude = row['longitude'];
        }, DatabaseService.errorHandler)
      }
      function successTransaction() {

      }
      this.getDatabase().transaction(txFunction, DatabaseService.errorHandler, successTransaction);

      return new Observable(observer => {
        setTimeout(() => {
          if (diary) {
            observer.next(diary);
          } else {
            observer.error('error happened');
          }
        }, 100);
      });
    }

    public updateDiary(diary: Diary, callback): void{
      function txFunction(tx){
        let sql = 'UPDATE diaries SET title=?, date=?, content=? WHERE id=?;';
        let options = [diary.title, diary.date, diary.content, diary.id];
        tx.executeSql(sql, options, callback, DatabaseService.errorHandler);
      }
      function successTransaction() {
        console.info('Success: update diary transaction successful');
      }
      this.getDatabase().transaction(txFunction, DatabaseService.errorHandler, successTransaction);
    }
}
