import { Injectable } from '@angular/core';
import { UsersServiceApi } from '@core/api/users/users.service';
import { Users, UsersSearchParams } from '@core/api/users/users.type';

@Injectable({
  providedIn: 'root',
})
export class SignDialogService {
  public constructor(private readonly usersServiceApi: UsersServiceApi) {}

  public async getUser(params: UsersSearchParams): Promise<Users | null> {
    return this.usersServiceApi.verifyLogin(params);
  }
}
