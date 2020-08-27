import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThrowResultComponent } from './throw-result.component';

describe('ThrowResultComponent', () => {
  let component: ThrowResultComponent;
  let fixture: ComponentFixture<ThrowResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThrowResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThrowResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
