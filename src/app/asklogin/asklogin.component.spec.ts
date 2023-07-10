import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskloginComponent } from './asklogin.component';

describe('AskloginComponent', () => {
  let component: AskloginComponent;
  let fixture: ComponentFixture<AskloginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AskloginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AskloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
