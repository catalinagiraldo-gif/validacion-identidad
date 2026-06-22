export interface PrototypeMeta {
  title: string;
  module: string;
  slug: string;
  route: string;
  description: string;
  profiles: string[];
  owner: string;
  dateAdded: string;
  thumbnail: string;
  architecture: 'old' | 'new';
  folder?: string;
  absoluteRoute?: string;
  badge?: string;
}
