export type ExploreFilter = "recommendation" | "all" | "genre";

export type ExploreBook = {
  id: string;
  title: string;
  author: string;
  year?: number;
  coverImage?: string;
  openLibraryUrl: string;
};
