import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppConfirmDialogComponent } from './app-confirm-dialog.component';

describe('AppConfirmDialogComponent', () => {
  let component: AppConfirmDialogComponent;
  let fixture: ComponentFixture<AppConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppConfirmDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
