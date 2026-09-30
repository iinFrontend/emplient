import { Component, inject } from '@angular/core';
import { ApiService } from '../shared/api.service';

@Component({
  imports: [],
  selector: 'app-emp',
  styleUrl: './emp.component.css',
  templateUrl: './emp.component.html',
})
export class EmpComponent 
{
  api = inject(ApiService)
  employees: any[] = []

  ngOnInit(){
    this.showEmployees()
  }

  showEmployees(){
    this.api.getEmployees().subscribe({
      next: (res: any) => {
        console.log(res.data)
        this.employees = res.data
      },
      error:() => {}
    })
  }
}
