export interface PrototypeMeta {
  title: string;          // Display name, e.g. "Catalogo de Productos"
  module: string;         // Module name, e.g. "productos"
  slug: string;           // Unique identifier, e.g. "catalogo"
  route: string;          // Full route path, e.g. "/productos/catalogo"
  description: string;    // Short description for tooltip hover (per D-07, D-13)
  profiles: string[];     // Array of role strings: "dropshipper" | "proveedor" | "admin" (per D-09)
  owner: string;          // Email @dropi.co, e.g. "producto@dropi.co" (per D-10)
  dateAdded: string;      // ISO date string, e.g. "2026-05-05" (per D-11)
  thumbnail: string;      // Relative path to screenshot, e.g. "thumbnail.png" (per D-12)
}
