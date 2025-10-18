// src/screens/DetailsScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Image, ScrollView, StyleSheet } from "react-native";
import { getMovieDetails, IMAGE_BASE } from "../services/tmdb";

export default function TelaDetalhes({ route }) {
  const { movieId } = route.params;
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getMovieDetails(movieId);
        setMovie(data);
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar os detalhes.");
      } finally {
        setLoading(false);
      }
    })();
  }, [movieId]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  if (error) return <View style={s.center}><Text style={{ color: "red" }}>{error}</Text></View>;

  if (!movie) return null;

  return (
    <ScrollView style={s.container}>
      {movie.poster_path ? (
        <Image source={{ uri: IMAGE_BASE + movie.poster_path }} style={s.poster} />
      ) : null}
      <View style={s.content}>
        <Text style={s.title}>{movie.title}</Text>
        <Text style={s.sub}>{movie.release_date} • {movie.runtime ? `${movie.runtime} min` : ""}</Text>
        <Text style={s.rating}>⭐ {movie.vote_average} ({movie.vote_count} votos)</Text>
        <Text style={s.overviewTitle}>Sinopse</Text>
        <Text style={s.overview}>{movie.overview || "Sem sinopse disponível."}</Text>

        {movie.genres?.length ? (
          <>
            <Text style={s.overviewTitle}>Gêneros</Text>
            <Text>{movie.genres.map(g => g.name).join(", ")}</Text>
          </>
        ) : null}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  poster: { width: "100%", height: 500, resizeMode: "cover" },
  content: { padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 6 },
  sub: { color: "#666", marginBottom: 6 },
  rating: { marginBottom: 12 },
  overviewTitle: { fontWeight: "bold", marginTop: 8 },
  overview: { marginTop: 6, color: "#333", lineHeight: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
