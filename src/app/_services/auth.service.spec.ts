import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

import { HttpClientTestingModule } from "@angular/common/http/testing";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('AuthService', () => {

  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let service: AuthService;

  beforeEach(() => {

    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);

    service = new AuthService(httpClientSpy);


    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
  });

  it('should be created', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy();
  });

  it('debe retornar login correcto', (done: DoneFn) => {

    const mockUserCredentials = {
      "username": "admin",
      "password": "123456"
    }

    const mockResultLogin = {
      "id": "632d2413c9b0301fece9f4f7",
      "username": "admin",
      "email": "admin@user.com",
      "roles": [
        "ROLE_ADMIN"
      ],
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzMmQyNDEzYzliMDMwMWZlY2U5ZjRmNyIsImlhdCI6MTY2NDI2NzM3MiwiZXhwIjoxNjY0MzUzNzcyfQ.UsxU5sNkojxg19yXnWbr5tOPm18HWItfD1jZYG3q_kA"
    }

    httpClientSpy.post.and.returnValue(of(mockResultLogin))

    const credentials = mockUserCredentials

    service.login(credentials).subscribe({
      next: data => {
        expect(data).toEqual(mockResultLogin)
        done();
      }
    })
  });


  it('debe retornar error 401', (done: DoneFn) => {
    const mockUserCredentials = {
      "username": "admin",
      "password": "invalid"
    }

    const mockError401: HttpErrorResponse = new HttpErrorResponse({
      error: "Unauthorized",
      status: 401,
      statusText: "Invalid password"
    })

    httpClientSpy.post.and.returnValue(throwError(() => mockError401))

    const credentials = mockUserCredentials

    service.login(credentials).subscribe({
      next: data => done.fail('expected an error, no data'),
      error: (error) => {
        expect(error.status).toBe(401)
        expect(error.statusText).toContain("Invalid password")
        done()
      }
    })

  });

});
