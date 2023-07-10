import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute} from "@angular/router";
import {DatabaseService} from "../services/database.service";
import {Diary} from '../models/Diary';
import {Router} from "@angular/router";
declare var H: any;

@Component({
    selector: 'app-modifypage',
    templateUrl: './modifypage.component.html',
    styleUrls: ['./modifypage.component.css']
})
export class ModifypageComponent implements OnInit {
    diary: Diary;
    latitude: any;
    longitude: any;
    diaryEditForm = this.builder.group({
      _date:['', [Validators.required]],
      _title:['', [Validators.required]],
      _content:['', []]
    });

    getDate(){
      return this.diaryEditForm.get('_date');
    }

    getTitle(){
      return this.diaryEditForm.get('_title');
    }

    readLocalStorage(key: string): string{
      return localStorage.getItem(key);
    }

    constructor( private builder: FormBuilder,
                 private activatedRoute: ActivatedRoute,
                 private database: DatabaseService,
                 private router: Router) {
    }

    ngOnInit(): void {
        let id: number = Number(this.activatedRoute.snapshot.paramMap.get('id'));
        this.database.selectDiary(id).subscribe((data)=>{
            this.diary = data;
            this.diaryEditForm.get('_date').setValue(this.diary.date);
            this.diaryEditForm.get('_title').setValue(this.diary.title);
            this.diaryEditForm.get('_content').setValue(this.diary.content);
            this.latitude = this.diary.latitude;
            this.longitude = this.diary.longitude;
            this.populateMap();
        });
    }

    btnUpdate_click(){
        this.diary.date = this.diaryEditForm.get('_date').value;
        this.diary.title = this.diaryEditForm.get('_title').value;
        this.diary.content = this.diaryEditForm.get('_content').value;

        this.database.updateDiary(this.diary, ()=>{
            alert("Record updated successfully");
        });
        setTimeout(()=>{
          // this.router.navigate(['/show']).then(()=>{window.location.reload();});
          this.router.navigate(['/show']);
        }, 100)

    }

    btnCancel_click(){
        setTimeout(()=>{
          // this.router.navigate(['/show']).then(()=>{window.location.reload();});
          this.router.navigate(['/show']);
        }, 100)

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
