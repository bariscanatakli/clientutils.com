// Share Snippet type definitions

export interface ShareSnippet {
  id: string;
  tool: string;
  input: string;
  output: string;
  createdAt: number;
  expiresAt: number;
}

export interface ShareState {
  isSharing: boolean;
  shareUrl: string | null;
  error: string | null;
}
