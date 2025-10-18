// src/screens/SearchScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { searchMovies, IMAGE_BASE } from "../services/tmdb";

export default function TelaIBusca({ navigation }) {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function doSearch(reset = true) {
    if (!query.trim()) {
      setError("Digite o nome do filme");
      setMovies([]);
      return;
    }
    setError("");
    setLoading(true);
    try {
      const usePage = reset ? 1 : page;
      const data = await searchMovies(query, usePage);
      if (reset) {
        setMovies(data.results || []);
        setPage(1);
      } else {
        setMovies((prev) => [...prev, ...(data.results || [])]);
      }
      setTotalPages(data.total_pages || 1);
    } catch (err) {
      console.error(err);
      setError("Erro ao buscar filmes. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function loadMore() {
    if (loading) return;
    if (page >= totalPages) return;
    const next = page + 1;
    setPage(next);
    // buscar próxima página e concatenar:
    (async () => {
      setLoading(true);
      try {
        const data = await searchMovies(query, next);
        setMovies((prev) => [...prev, ...(data.results || [])]);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar mais resultados.");
      } finally {
        setLoading(false);
      }
    })();
  }

  useEffect(() => {
    // se quiser busca automática ao digitar, pode descomentar:
    // const timer = setTimeout(() => { if(query) doSearch(); }, 700);
    // return () => clearTimeout(timer);
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate("Details", { movieId: item.id })}
    >
      {item.poster_path ? (
        <Image source={{ uri: IMAGE_BASE + item.poster_path }} style={styles.poster} />
      ) : (
        <View style={[styles.poster, styles.posterPlaceholder]}>
          <Text style={{ color: "#999" }}>Sem imagem</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.release}>{item.release_date}</Text>
        <Text numberOfLines={3} style={styles.overview}>
          {item.overview || "Sem sinopse."}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Pesquisar filme..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => doSearch(true)}
          returnKeyType="search"
        />
        <Button title="Buscar" onPress={() => doSearch(true)} />
      </View>

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={movies}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{ paddingBottom: 30 }}
      />

      {!loading && movies.length === 0 && !error && (
        <View style={{ alignItems: "center", marginTop: 30 }}>
          <Text>Nenhum filme exibido — pesquise por um título.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: "#fefefe" },
  searchRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 44,
    backgroundColor: "#fff",
  },
  item: {
    flexDirection: "row",
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 1,
  },
  poster: { width: 100, height: 150 },
  posterPlaceholder: { justifyContent: "center", alignItems: "center", backgroundColor: "#eee" },
  info: { flex: 1, padding: 10 },
  title: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  release: { color: "#666", marginBottom: 6 },
  overview: { color: "#333", fontSize: 13 },
  error: { color: "red", textAlign: "center", marginVertical: 8 },
});
