import { useState, useEffect, useRef } from "react";
import { getBooksByCategory } from "../services/books"; 
import { toast } from 'react-toastify';

const normalizeBooks = (data) => {
  // Se os livros estiverem dentro de uma propriedade "livros", usa esse array
  const books = data.livros ? data.livros : data;
  
  return books.map((book) => ({
    ...book,
    // Se authors for array, mantemos; se for string, transformamos em array
    authors: Array.isArray(book.authors)
      ? book.authors
      : book.authors
      ? book.authors.split(",").map((a) => a.trim())
      : [],
  }));
};

const useBooks = (categoria = "programming", pagina = 1) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasNext, setHasNext] = useState(true); 
  const cache = useRef({}); 
  const inFlight = useRef({});  
  const loadingTimeout = useRef(null); 

  useEffect(() => {
    let cancelled = false;

    const fetchBooks = async () => {
      loadingTimeout.current = setTimeout(() => {
        setLoading(true);
      }, 2500);

      // Se já estiver em cache, usa os livros normalizados
      if (cache.current[pagina] !== undefined) {
        setBooks(cache.current[pagina]);
        clearTimeout(loadingTimeout.current); 
        setLoading(false);
      } 
      else if (inFlight.current[pagina]) {
        try {
          const data = await inFlight.current[pagina];
          const normalized = normalizeBooks(data);
          if (!cancelled) {
            setBooks(normalized);
          }
        } catch (error) {
          if (!cancelled) {
            toast.error("Erro ao buscar livros");
          }
        } finally {
          if (!cancelled) {
            clearTimeout(loadingTimeout.current); 
            setLoading(false);
          }
        }
      } 
      else {
        inFlight.current[pagina] = getBooksByCategory(categoria, pagina);
        try {
          const data = await inFlight.current[pagina];
          const normalized = normalizeBooks(data);
          // Armazena o resultado normalizado no cache
          cache.current[pagina] = normalized;
          if (!cancelled) {
            setBooks(normalized);
          }
        } catch (error) {
          if (!cancelled) {
            toast.error("Erro ao buscar livros");
          }
        } finally {
          delete inFlight.current[pagina];
          if (!cancelled) {
            clearTimeout(loadingTimeout.current); 
            setLoading(false);
          }
        }
      }

      // Pré-carrega a próxima página com verificação de in-flight
      const nextPage = pagina + 1;
      if (cache.current[nextPage] === undefined && !inFlight.current[nextPage]) {
        inFlight.current[nextPage] = getBooksByCategory(categoria, nextPage);
        try {
          const nextData = await inFlight.current[nextPage];
          const normalizedNext = normalizeBooks(nextData);
          cache.current[nextPage] = normalizedNext;
          if (!cancelled) {
            setHasNext(normalizedNext && normalizedNext.length > 0);
          }
        } catch (error) {
          if (!cancelled) {
            setHasNext(false);
          }
        } finally {
          delete inFlight.current[nextPage];
        }
      } else if (cache.current[nextPage] !== undefined) {
        setHasNext(cache.current[nextPage].length > 0);
      }
    };

    fetchBooks();

    return () => {
      cancelled = true;
      clearTimeout(loadingTimeout.current); 
    };
  }, [categoria, pagina]);

  return { books, loading, hasNext };
};

export default useBooks;
