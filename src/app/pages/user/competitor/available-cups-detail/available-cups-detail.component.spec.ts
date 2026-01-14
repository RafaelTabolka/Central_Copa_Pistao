import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableCupsDetailComponent } from './available-cups-detail.component';

describe('AvailableCupsDetailComponent', () => {
  let component: AvailableCupsDetailComponent;
  let fixture: ComponentFixture<AvailableCupsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailableCupsDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailableCupsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
