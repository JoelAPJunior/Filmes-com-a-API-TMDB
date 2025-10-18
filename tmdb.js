// src/services/tmdb.js
// Serviço simples para consumir a API TMDB usando fetch.
// Lê a API key de process.env.TMDB_API_KEY ou de um fallback.
// NÃO se deve deixar a chave hardcoded em produção.

import Constants from "expo-constants";

const FALLBACK_KEY = ""; // opcional (deixe vazio)
const API_KEY = Constants?.manifest?.extra?.TMDB_API_KEY || process.env.TMDB_API_KEY || FALLBACK_KEY;

const BASE_URL = "https://api.themoviedb.org/3";
export const IMAGE_BASE = "https://image.tmdb.org/t/p/w500"; // para posters

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} - ${text}`);
  }
  return res.json();
}

export async function searchMovies(query, page = 1) {
  const q = encodeURIComponent(query);
  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${q}&page=${page}&include_adult=false`;
  return fetchJson(url);
}

export async function getMovieDetails(movieId) {
  const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=pt-BR`;
  return fetchJson(url);
}
