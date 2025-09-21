import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitsExplorerComponent } from './limits-explorer.component';

describe('LimitsExplorerComponent', () => {
  let component: LimitsExplorerComponent;
  let fixture: ComponentFixture<LimitsExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LimitsExplorerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LimitsExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
