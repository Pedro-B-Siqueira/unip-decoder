const { createClient } = require('@supabase/supabase-js')

class Db {
    constructor() {
         this.supabaseUrl = 'https://lckdbhezinjmuoblqqdr.supabase.co'
         this.supabaseKey = process.env.dbKey
    }

    async connect() {
        this.client = createClient(this.supabaseUrl, this.supabaseKey)
        return this.client
    }

    async dbGraphQlConnection(query) {
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

module.exports = Db
