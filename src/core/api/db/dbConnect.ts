import { createClient } from '@supabase/supabase-js'
import { environment } from '@env/environment';

export class Db {
    constructor(
        private readonly supabaseUrl: string = 'https://lckdbhezinjmuoblqqdr.supabase.co',
        private readonly supabaseKey: string = environment.dbKey,
    ) {}
  
      async connect() {
          const client = createClient(this.supabaseUrl, this.supabaseKey)
          return client
      }
  
      async dbGraphQlConnection(query: any) {
          const response = await fetch(`${this.supabaseUrl}/graphql/v1`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'apikey': this.supabaseKey,
              },
              body: JSON.stringify({ query })
          });
          const result = await response.json();
          return result;
      }
}