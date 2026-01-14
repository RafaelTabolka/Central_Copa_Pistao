import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTeamDetailComponent } from './my-team-detail.component';

describe('MyTeamDetailComponent', () => {
  let component: MyTeamDetailComponent;
  let fixture: ComponentFixture<MyTeamDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyTeamDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyTeamDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
