import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlagioComponent } from './plagio.component';

describe('PlagioComponent', () => {
  let component: PlagioComponent;
  let fixture: ComponentFixture<PlagioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlagioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlagioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
