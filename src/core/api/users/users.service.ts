import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Users, UsersSaveParams, UsersSearchParams } from './users.type';
import { Db } from '@api/db/dbConnect';
import { SEARCH_USERS } from './users.query';
import bcrypt from 'bcryptjs';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(timezone);
dayjs.extend(utc);

@Injectable({
  providedIn: 'root',
})
export class UsersServiceApi {
  private dbInstance = new Db();

  public constructor() {}

  public async search(): Promise<Users> {
    return firstValueFrom(await this.dbInstance.dbGraphQlConnection(SEARCH_USERS));
  }

  public async getOne(id: string): Promise<Users | null> {
    const db = await this.dbInstance.connect();

    const query = db.from('users').select('*').filter('id', 'eq', id).limit(1);

    const { data, error } = await query;

    if (data && !error) {
      return data[0] as Users;
    } else {
      throw new Error(`Houve um erro na busca`);
    }
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
      if (data.length > 0) {
        const hashedPassword = data[0].password;
        if (await bcrypt.compare(params.password, hashedPassword)) {
          return data[0] as Users;
        }
        alert('⚠️ As senhas não coincidem')
        throw new Error(`A conta não existe no banco de dados`);
      } else {
        alert('⚠️ A conta que você inseriu não existe')
        throw new Error(`As senhas não coincidem`);
      }
    } else {
      alert('⚠️ Houve um erro ao tentar verificar o login')
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
        alert('⚠️ Houve um erro ao tentar salvar o usuário')
        throw new Error(`Houve um erro ao salvar o usuário: ${error?.message || ''}`);
      }

      if (data) {
        return data[0] as Users;
      }
      alert('⚠️ Houve um erro ao tentar salvar o usuário')
      throw new Error('Erro desconhecido ao salvar o usuário.');
    } catch (error) {
      alert('⚠️ Houve um erro ao tentar salvar o usuário')
      throw new Error('Erro ao salvar o usuário.');
    }
  }

  public async update(id: string): Promise<void> {
    const db = await this.dbInstance.connect();
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const todayInUserTimeZone = dayjs().tz(userTimeZone).format('YYYY-MM-DDTHH:mm:ss.SSSZ');

    const mutation = db.from('users').update({ last_login: todayInUserTimeZone }).eq('id', id);

    const { data, error } = await mutation;

    if (error) {
      alert('⚠️ Houve um erro ao tentar atualizar o usuário')
      throw new Error(`Houve um erro ao atualizar esse usuário: ${error?.message || ''}`);
    }
  }
}
