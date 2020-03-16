import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyStateCardComponent } from './empty-state-card.component';

describe('EmptyStateCardComponent', () => {
  let component: EmptyStateCardComponent;
  let fixture: ComponentFixture<EmptyStateCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmptyStateCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyStateCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
