import { Injectable } from '@angular/core';
import { UsersServiceApi } from '@core/api/users/users.service';
import { Users } from '@core/api/users/users.type';


@Injectable({
  providedIn: 'root'
})
export class MainService {
  public constructor(
    private readonly usersServiceApi: UsersServiceApi
  ) { }

  public async getUser(id: string): Promise<Users | null> {
    return await this.usersServiceApi.getOne(id)
  }

  public async updateLastLogin(id: string): Promise<void> {
    await this.usersServiceApi.update(id)
  }
}
