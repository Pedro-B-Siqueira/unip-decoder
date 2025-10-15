import { Injectable } from '@angular/core';
import { UsersServiceApi } from '@core/api/users/users.service';
import { Users, UsersSaveParams, UsersSearchParams } from '@core/api/users/users.type';


@Injectable({
  providedIn: 'root'
})
export class RegisterDialogService {
  public constructor(
    private readonly usersServiceApi: UsersServiceApi
  ) { }

  public async save(params: UsersSaveParams): Promise<Users | null> {
    return await this.usersServiceApi.save(params)
  }
}
