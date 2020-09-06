import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamColorPickerDialogComponent } from './team-color-picker-dialog.component';

describe('TeamColorPickerDialogComponent', () => {
  let component: TeamColorPickerDialogComponent;
  let fixture: ComponentFixture<TeamColorPickerDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamColorPickerDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamColorPickerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
