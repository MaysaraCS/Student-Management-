import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyLecturersComponent } from './my-lecturers.component';

describe('MyLecturersComponent', () => {
  let component: MyLecturersComponent;
  let fixture: ComponentFixture<MyLecturersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyLecturersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyLecturersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
