import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitorComponent } from './competitor.component';

describe('CompetitorComponent', () => {
  let component: CompetitorComponent;
  let fixture: ComponentFixture<CompetitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompetitorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompetitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
