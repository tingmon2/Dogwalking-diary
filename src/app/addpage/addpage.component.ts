import {Component, NgZone, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {DatabaseService} from "../services/database.service";
import {Diary} from '../models/Diary';
import {Router} from '@angular/router';
declare var H: any;

@Component({
    selector: 'app-addpage',
    templateUrl: './addpage.component.html',
    styleUrls: ['./addpage.component.css']
})
export class AddpageComponent implements OnInit {
    latitude: any;
    longitude: any;
    constructor(private builder: FormBuilder, private database: DatabaseService, private router: Router, private zone:NgZone) {
    }

    diaryAddForm = this.builder.group({
        _date:['', [Validators.required]],
        _title:['', [Validators.required]],
        _content:['', []]
    });

    getDate(){
      return this.diaryAddForm.get('_date');
    }

    getTitle(){
      return this.diaryAddForm.get('_title');
    }

    readLocalStorage(key: string): string{
      return localStorage.getItem(key);
    }

    ngOnInit(): void {
      if(localStorage.getItem('isLoggedIn') == 'false'){
        console.log("go router");
        this.router.navigate(['asklogin']);
      }
      else{
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            console.info('lat : ' + this.latitude);
            console.info('lng : ' + this.longitude);
            this.populateMap();
          });
        }
        else {
          alert('Geolocation is not supported by this browser.');
        }
      }
    }

    btnAdd_click() {
      let diary: Diary = new Diary(parseInt(
        localStorage.getItem('currentUser')),
        this.diaryAddForm.get('_title').value,
        this.diaryAddForm.get('_date').value,
        this.diaryAddForm.get('_content').value,
        this.latitude,
        this.longitude);

      this.database.insertDiary(diary, ()=>{
        alert("Diary added successfully");
        setTimeout(()=>{
          this.zone.run(() => {
            console.info("zone in add page")
            this.router.navigate(['/show']);
          });
        }, 100)

      })
    }
  public populateMap() {

    document.getElementById('mapContainer').innerHTML = '';
    // Initialize the platform object:
    var platform = new H.service.Platform({
      'apikey': 'g3OImBdDbf2SqsXMhPTkM3I4nO9XDOgzlAN7CXa1kzo'
    });

    var maptypes = platform.createDefaultLayers();

    var options = {
      zoom: 15,
      center: {
        lat: this.latitude, lng: this.longitude
      }
    };

    var map = new H.Map(
      document.getElementById('mapContainer'),
      maptypes.vector.normal.map,
      options
    );

    var icon = new H.map.Icon('assets/img/angular.ico');
    var marker = new H.map.Marker({
      lat: this.latitude, lng: this.longitude
    }, {icon: icon});
    map.addObject(marker);

  }
}
