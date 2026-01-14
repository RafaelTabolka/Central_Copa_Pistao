import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CupsDetailComponent } from './cups-detail.component';

describe('CupsDetailComponent', () => {
  let component: CupsDetailComponent;
  let fixture: ComponentFixture<CupsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CupsDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CupsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
