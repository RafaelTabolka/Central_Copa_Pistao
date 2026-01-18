import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTeamEditComponent } from './my-team-edit.component';

describe('MyTeamEditComponent', () => {
  let component: MyTeamEditComponent;
  let fixture: ComponentFixture<MyTeamEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyTeamEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyTeamEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
