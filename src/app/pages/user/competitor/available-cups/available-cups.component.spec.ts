import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableCupsComponent } from './available-cups.component';

describe('AvailableCupsComponent', () => {
  let component: AvailableCupsComponent;
  let fixture: ComponentFixture<AvailableCupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailableCupsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailableCupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
