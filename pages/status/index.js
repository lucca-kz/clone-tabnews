import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status Page</h1>
      <UpdatedAt />
      <DatabaseStatus />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText = "Carregando ...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return <div>Ultima atualização dos dados: {updatedAtText}</div>;
}

function DatabaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let db = {};
  let databaseStatusData = "Carregando informações do banco de dados...";

  if (!isLoading && data) {
    db = data.dependencies.database;
    databaseStatusData = (
      <>
        <div>
          <h2>Banco de Dados</h2>
          <ul>
            <li>Versão: {db.version}</li>
            <li>Conexões máximas: {db.max_connections}</li>
            <li>
              Conexões abertas: {db.opened_connections}/{db.max_connections}
            </li>
          </ul>
        </div>
      </>
    );
  }

  return databaseStatusData;
}
