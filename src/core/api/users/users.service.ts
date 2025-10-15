import { Injectable } from '@angular/core';
import { map, firstValueFrom } from 'rxjs';
import { Users, UsersSaveParams, UsersSearchParams } from './users.type';
import { Db } from '@api/db/dbConnect';
import { SEARCH_USERS } from './users.query';
import bcrypt from 'bcryptjs';

@Injectable({
  providedIn: 'root',
})
export class UsersServiceApi {
  private dbInstance = new Db();

  public constructor() {}

  public async search(): Promise<Users> {
    return firstValueFrom(await this.dbInstance.dbGraphQlConnection(SEARCH_USERS));
  }

  public async verifyLogin(params: UsersSearchParams): Promise<Users | null> {
    const db = await this.dbInstance.connect();

    const query = db.from('users').select('*').filter('active', 'eq', true);

    if (params.username) {
      query.eq('username', params.username);
    }

    if (params.id) {
      query.eq('id', params.id);
    }

    if (params.email) {
      query.eq('email', params.email.toLowerCase());
    }

    const { data, error } = await query;

    if (data && !error) {
      const hashedPassword = data[0].password
      if (await bcrypt.compare(params.password, hashedPassword)) {
        return data[0] as Users;
      }
      throw new Error(`As senhas não coincidem`);
    } else {
      throw new Error(`Houve um erro ao buscar esse usuário: ${error?.message || ''}`);
    }
  }

  public async save(params: UsersSaveParams): Promise<Users | null> {
    const db = await this.dbInstance.connect();

    try {
      const mutation = db
        .from('users')
        .insert({
          username: params.username,
          email: params.email.toLowerCase(),
          password: bcrypt.hashSync(params.password, 12),
        })
        .select();

      const { data, error } = await mutation;

      if (error) {
        console.error('Erro ao inserir usuário:', error);
        throw new Error(`Houve um erro ao salvar o usuário: ${error?.message || ''}`);
      }

      if (data) {
        return data[0] as Users;
      }

      throw new Error('Erro desconhecido ao salvar o usuário.');
    } catch (error) {
      console.error('Erro no processo de salvamento do usuário:', error);
      throw new Error('Erro ao salvar o usuário.');
    }
  }

  // public async create(group: Group): Promise<Group> {
  //   const url = `${this.url}`;

  //   return this.http.post(url, group);
  // }

  // public async update(group: Group): Promise<Group> {
  //   const url = `${this.url}/${group.id}`;

  //   return this.http.put(url, group);
  // }

  // public async createGroup(params: CreateGroupInput): Promise<Group | undefined> {
  //   return firstValueFrom(this.apollo.mutate<{ createGroup: Group }>({
  //     mutation: CREATE_GROUP_MUTATION,
  //     variables: { input: params },
  //     fetchPolicy: 'network-only',
  //   }).pipe(map((response) => response.data?.createGroup)));
  // }

  // public async updateGroup(params: UpdateGroupInput): Promise<Group | undefined> {
  //   return firstValueFrom(this.apollo.mutate<{ updateGroup: Group }>({
  //     mutation: UPDATE_GROUP_MUTATION,
  //     variables: { input: params },
  //     fetchPolicy: 'network-only',
  //   }).pipe(map((response) => response.data?.updateGroup)));
  // }

  // public async saveGroupUsers(params: SaveGroupUsersInput): Promise<GroupUser[]> {
  //   return firstValueFrom(this.apollo.mutate<{ saveGroupUsers: GroupUser[] }>({
  //     mutation: SAVE_GROUP_USERS_MUTATION,
  //     variables: { input: params },
  //     fetchPolicy: 'network-only',
  //   }).pipe(map((response) => response.data?.saveGroupUsers || [])));
  // }

  // public async deleteGroupUsers(params: DeleteGroupUsersInput): Promise<GroupUser[]> {
  //   return firstValueFrom(this.apollo.mutate<{ deleteGroupUsers: GroupUser[] }>({
  //     mutation: DELETE_GROUP_USERS_MUTATION,
  //     variables: { input: params },
  //     fetchPolicy: 'network-only',
  //   }).pipe(map((response) => response.data?.deleteGroupUsers || [])));
  // }

  // public async saveGroupEmployees(params: SaveGroupEmployeesInput): Promise<GroupEmployee[]> {
  //   return firstValueFrom(this.apollo.mutate<{ saveGroupEmployees: GroupEmployee[] }>({
  //     mutation: SAVE_GROUP_EMPLOYEES_MUTATION,
  //     variables: { input: params },
  //     fetchPolicy: 'network-only',
  //   }).pipe(map((response) => response.data?.saveGroupEmployees || [])));
  // }

  // public async deleteGroupEmployees(params: DeleteGroupEmployeesInput): Promise<GroupEmployee[]> {
  //   return firstValueFrom(this.apollo.mutate<{ deleteGroupEmployees: GroupEmployee[] }>({
  //     mutation: DELETE_GROUP_EMPLOYEES_MUTATION,
  //     variables: { input: params },
  //     fetchPolicy: 'network-only',
  //   }).pipe(map((response) => response.data?.deleteGroupEmployees || [])));
  // }

  // public async updatePermissions(id: string, permissionIds: string[]): Promise<Permission[]> {
  //   const url = `${this.url}/${id}/permissions`;

  //   return this.http.put(url, permissionIds);
  // }

  // public async updateGroupPermissions(params: UpdateGroupPermissionsInput): Promise<GroupPermission[]> {
  //   return firstValueFrom(this.apollo.mutate<{ updateGroupPermissions: GroupPermission[] }>({
  //     mutation: UPDATE_GROUP_PERMISSIONS_MUTATION,
  //     variables: { input: params },
  //     fetchPolicy: 'network-only',
  //   }).pipe(map((response) => response.data?.updateGroupPermissions || [])));
  // }

  // public async saveGroupPermissions(params: SaveGroupPermissionsInput): Promise<GroupPermission[]> {
  //   return firstValueFrom(this.apollo.mutate<{ saveGroupPermissions: GroupPermission[] }>({
  //     mutation: SAVE_GROUP_PERMISSIONS_MUTATION,
  //     variables: { input: params },
  //     fetchPolicy: 'network-only',
  //   }).pipe(map((response) => response.data?.saveGroupPermissions || [])));
  // }

  // public async deleteGroupPermissions(params: DeleteGroupPermissionsInput): Promise<GroupPermission[]> {
  //   return firstValueFrom(this.apollo.mutate<{ deleteGroupPermissions: GroupPermission[] }>({
  //     mutation: DELETE_GROUP_PERMISSIONS_MUTATION,
  //     variables: { input: params },
  //     fetchPolicy: 'network-only',
  //   }).pipe(map((response) => response.data?.deleteGroupPermissions || [])));
  // }
}
