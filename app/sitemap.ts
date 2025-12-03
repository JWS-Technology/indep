import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://indep.jwstechnologies.com";

  // List all your static routes here
  const routes = [
    "",
    "/events",
    "/schedule",
    "/register",
    "/results",
    "/gallery",
    "/contact",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly", // Homepage changes often, others less so
    priority: route === "" ? 1.0 : 0.8, // Homepage is most important
  }));
}
