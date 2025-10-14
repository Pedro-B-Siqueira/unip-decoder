const Db = require("../src/core/api/db/dbConnect");

async function main() {
  console.log("Iniciando conexão com o Supabase...");

  const dbInstance = new Db();
  const supabase = await dbInstance.connect();

  console.log("Conexão estabelecida com o Supabase.");

  const { data, error } = await supabase.from("db-test").select("*");

  if (error) {
    console.error("Erro ao buscar usuários:", error.message);
  } else {
    console.log("Usuários encontrados:", data);
  }

  console.log("Fim do script");
}

main();
