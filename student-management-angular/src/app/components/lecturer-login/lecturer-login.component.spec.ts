import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LecturerLoginComponent } from './lecturer-login.component';

describe('LecturerLoginComponent', () => {
  let component: LecturerLoginComponent;
  let fixture: ComponentFixture<LecturerLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LecturerLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LecturerLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
