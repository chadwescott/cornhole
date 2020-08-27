import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundThrowsComponent } from './round-throws.component';

describe('RoundThrowsComponent', () => {
  let component: RoundThrowsComponent;
  let fixture: ComponentFixture<RoundThrowsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoundThrowsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundThrowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
