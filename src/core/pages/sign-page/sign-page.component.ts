import { Component } from '@angular/core';
import { UsersServiceApi } from '@api/users/users.service';

@Component({
  selector: 'app-sign-page',
  imports: [],
  templateUrl: './sign-page.component.html',
  styleUrl: './sign-page.component.scss'
})
export class SignPageComponent {

  public constructor(
    private readonly usersServiceApi: UsersServiceApi
  ) {}

  public getAllUsers(): any {
    return this.usersServiceApi.search()
  }
}

