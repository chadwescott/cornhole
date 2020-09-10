import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThrowResultIconComponent } from './throw-result-icon.component';

describe('ThrowResultIconComponent', () => {
  let component: ThrowResultIconComponent;
  let fixture: ComponentFixture<ThrowResultIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThrowResultIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThrowResultIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
