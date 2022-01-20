import { useState, useEffect } from "react";
import axios from "axios";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import "./App.css";

interface Publication {
  chave: number;
  id: number;
  titulo: string;
  autor: string;
  ano: string;
  link: string;
  classificacao: string;
  nomenclatura: string;
}

function App() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const scrollRef = useBottomScrollListener<HTMLDivElement>(handleUpdateData, {
    offset: 0,
    debounce: 0,
    triggerOnNoScroll: false,
  });

  async function handleUpdateData() {
    if (loading) return;

    setLoading(true);

    const { data } = await axios.get<{ items: Publication[] }>(
      generateURL(page + 1)
    );

    setPublications([...publications, ...data.items]);

    setPage(page + 1);
    setLoading(false);
  }

  function generateURL(page: number) {
    return `https://servicodados.ibge.gov.br/api/v1/publicacoes/popula%C3%A7%C3%A3o?page=${page}&qtd=20`;
  }

  useEffect(() => {
    async function firstPublicationLoad() {
      if (publications.length === 0) {
        if (loading) return;

        setLoading(true);

        const { data } = await axios.get<{ items: Publication[] }>(
          generateURL(page)
        );

        setPublications([...publications, ...data.items]);

        setPage(page);
        setLoading(false);
      }
    }

    firstPublicationLoad();
  });

  return (
    <div className="App">
      <div ref={scrollRef} className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Autor</th>
              <th>Ano</th>
              <th>Link</th>
              <th className="classification">Classificação</th>
              <th>Nomenclatura</th>
            </tr>
          </thead>
          <tbody>
            {publications.map((publication) => (
              <tr key={publication.chave}>
                <td>{publication.id}</td>
                <td>{publication.titulo}</td>
                <td>{publication.autor}</td>
                <td>{publication.ano}</td>
                <td>
                  <a href={publication.link}>{publication.link}</a>
                </td>
                <td className="classification">{publication.classificacao}</td>
                <td>
                  {publication.nomenclatura ? publication.nomenclatura : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {loading ? <h1>Carregando...</h1> : <></>}
    </div>
  );
}

export default App;
