import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HashtagListComponent } from './hashtag-list.component';

describe('HashtagListComponent', () => {
  let component: HashtagListComponent;
  let fixture: ComponentFixture<HashtagListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HashtagListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HashtagListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
