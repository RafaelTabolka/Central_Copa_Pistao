import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CupsComponent } from './cups.component';

describe('CupsComponent', () => {
  let component: CupsComponent;
  let fixture: ComponentFixture<CupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CupsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
