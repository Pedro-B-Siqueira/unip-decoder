import { Injectable } from '@angular/core';
import { UsersServiceApi } from '@core/api/users/users.service';
import { Users } from '@core/api/users/users.type';


@Injectable({
  providedIn: 'root'
})
export class SignPageService {
  public constructor(
    private readonly usersServiceApi: UsersServiceApi
  ) { }

  public async updateLastLogin(id: string): Promise<void> {
    await this.usersServiceApi.update(id)
  }
}
