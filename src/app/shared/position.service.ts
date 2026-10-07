import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

@Service()
export class PositionService {
    http = inject(HttpClient)
    host = 'http://localhost:8000'

    getPosition(){
        const url = this.host + '/api/positions'
        return this.http.get(url)
    }
}
