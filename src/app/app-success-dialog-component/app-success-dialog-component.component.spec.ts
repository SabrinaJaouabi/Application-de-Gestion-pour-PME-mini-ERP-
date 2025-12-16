import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSuccessDialogComponentComponent } from './app-success-dialog-component.component';

describe('AppSuccessDialogComponentComponent', () => {
  let component: AppSuccessDialogComponentComponent;
  let fixture: ComponentFixture<AppSuccessDialogComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppSuccessDialogComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppSuccessDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
