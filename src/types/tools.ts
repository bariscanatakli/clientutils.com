// Tool type definitions for clientutils.com

export type ToolCategory =
  | "formatters"
  | "encoders"
  | "generators"
  | "converters"
  | "helpers"
  | "text"
  | "web";

export interface Tool {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  category: ToolCategory;
  path: string;
  seoKeyword: string;
  icon: string; // emoji for now, can be replaced with Lucide icons
  isNew?: boolean;
  isPopular?: boolean;
}

export interface ToolCategory_Meta {
  id: ToolCategory;
  name: string;
  nameEn: string;
  icon: string;
  description: string;
}

export interface CopyState {
  copied: boolean;
  text: string;
}
