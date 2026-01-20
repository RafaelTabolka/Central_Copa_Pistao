import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CupRegisterComponent } from './cup-register.component';

describe('CupRegisterComponent', () => {
  let component: CupRegisterComponent;
  let fixture: ComponentFixture<CupRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CupRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CupRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
