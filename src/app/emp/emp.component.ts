import { ChangeDetectorRef, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
declare const bootstrap: any;

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-emp',
  styleUrl: './emp.component.css',
  templateUrl: './emp.component.html',
})
export class EmpComponent implements OnInit {
  @ViewChild('exampleModal') modalEl!: ElementRef;

  api = inject(ApiService);
  cdr = inject(ChangeDetectorRef);
  builder = inject(FormBuilder);

  employees: any[] = [];

  empForm = this.builder.group({
    id: [''],
    name: ['', [Validators.required, Validators.minLength(2)]],
    city: ['', Validators.required],
    salary: [null as number | null, [Validators.required, Validators.min(0)]],
    positionId: ['', Validators.required],
  });

  positions = [
    { id: 1, title: 'Developer' },
    { id: 2, title: 'Tester' },
    { id: 3, title: 'Cleaner' },
  ];

  get f() {
    return this.empForm.controls;
  }

  ngOnInit() {
    this.showEmployees();
  }

  showEmployees() {
    this.api.getEmployees().subscribe({
      next: (res: any) => {
        this.employees = res.data;
        this.cdr.detectChanges();
      },
      error: (err) => console.log(err),
    });
  }

  saveEmp() {
    if (this.empForm.invalid) {
      this.empForm.markAllAsTouched();
      return;
    }
    this.addEmp();
  }

  addEmp() {
    const emp = {
      name: this.empForm.value.name,
      city: this.empForm.value.city,
      salary: this.empForm.value.salary,
      positionId: Number(this.empForm.value.positionId),
    };

    this.api.createEmp(emp).subscribe({
      next: () => {
        this.closeModal();
        this.empForm.reset({ positionId: '' });
        this.showEmployees();
      },
      error: (err) => console.log(err),
    });
  }

  closeModal() {
    bootstrap.Modal.getInstance(this.modalEl.nativeElement)?.hide();
  }

  updateEmp() {}
}