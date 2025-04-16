import { retrievePopularPodcasts } from "../services/internal/podcastService.js";

export default function PodcastController(app) {
  const getPopularPodcasts = async (req, res) => {
    const results = await retrievePopularPodcasts();
    res.json(results);
  };
  app.get("/api/podcasts/popular", getPopularPodcasts);
}
