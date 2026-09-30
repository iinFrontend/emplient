import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmpComponent } from './emp.component';

describe('EmpComponent', () => {
  let component: EmpComponent;
  let fixture: ComponentFixture<EmpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
