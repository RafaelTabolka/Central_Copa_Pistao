import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarCompetitorComponent } from './sidebar-competitor.component';

describe('SidebarCompetitorComponent', () => {
  let component: SidebarCompetitorComponent;
  let fixture: ComponentFixture<SidebarCompetitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarCompetitorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarCompetitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
