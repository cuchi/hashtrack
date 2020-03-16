import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TweetCardComponent } from './tweet-card.component';

describe('TweetCardComponent', () => {
  let component: TweetCardComponent;
  let fixture: ComponentFixture<TweetCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TweetCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TweetCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
