import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CupEditComponent } from './cup-edit.component';

describe('CupEditComponent', () => {
  let component: CupEditComponent;
  let fixture: ComponentFixture<CupEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CupEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CupEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
