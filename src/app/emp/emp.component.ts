import { ChangeDetectorRef, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from '../shared/employee.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PositionService } from '../shared/position.service';
declare const bootstrap: any;

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-emp',
  styleUrl: './emp.component.css',
  templateUrl: './emp.component.html',
})
export class EmpComponent implements OnInit {
  @ViewChild('exampleModal') modalEl!: ElementRef;

  positionApi = inject(PositionService)
  empApi = inject(EmployeeService)
  cdr = inject(ChangeDetectorRef)
  builder = inject(FormBuilder)

  employees: any[] = [];

  empForm = this.builder.group({
    id: [''],
    name: ['', [Validators.required, Validators.minLength(2)]],
    city: ['', Validators.required],
    salary: [null as number | null, [Validators.required, Validators.min(0)]],
    positionId: ['', Validators.required],
  });

positions: any[] = [
    // { id: 1, title: 'Developer' },
    // { id: 2, title: 'Tester' },
    // { id: 3, title: 'Cleaner' },
  ];

get f() {
  return this.empForm.controls;
}

showPositions() {
  this.positionApi.getPosition().subscribe({
    next: (res: any) => {
      this.positions = res.data;
      this.cdr.detectChanges();
    },
    error: (err: any) => console.log(err),
  });
}

  ngOnInit() {
    this.showEmployees();
    this.showPositions();
  }

  showEmployees() {
    this.empApi.getEmployees().subscribe({
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
  this.isEdit ? this.updateEmp() : this.addEmp();
}

updateEmp() {
  const id = this.empForm.value.id;
  const emp = {
    name: this.empForm.value.name,
    city: this.empForm.value.city,
    salary: this.empForm.value.salary,
    positionId: Number(this.empForm.value.positionId),
  };

  this.empApi.updateEmp(id, emp).subscribe({
    next: () => {
      this.closeModal();
      this.empForm.reset({ positionId: '' });
      this.showEmployees();
    },
    error: (err) => console.log(err),
  });
}

  addEmp() {
    const emp = {
      name: this.empForm.value.name,
      city: this.empForm.value.city,
      salary: this.empForm.value.salary,
      positionId: Number(this.empForm.value.positionId),
    };

    this.empApi.createEmp(emp).subscribe({
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

  isEdit = false;

getPositionTitle(id: number) {
  return this.positions.find(p => p.id === id)?.title ?? id;
}

openAdd() {
  this.isEdit = false;
  this.empForm.reset({ positionId: '' });
}

editEmp(emp: any) {
  this.isEdit = true;
  this.empForm.patchValue({
    id: emp.id,
    name: emp.name,
    city: emp.city,
    salary: emp.salary,
    positionId: emp.positionId,
  });
}

deleteEmp(emp: any) {
  if (!confirm(`Delete ${emp.name}?`)) return;

  this.empApi.deleteEmp(emp.id).subscribe({
    next: () => this.showEmployees(),
    error: (err) => console.log(err),
  });
}

}