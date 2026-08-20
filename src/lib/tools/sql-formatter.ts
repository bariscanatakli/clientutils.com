import { format } from "sql-formatter";

export interface SqlFormatConfig {
  language: "sql" | "postgresql" | "mysql" | "mariadb" | "sqlite" | "tsql";
  keywordCase: "upper" | "lower" | "preserve";
  indentStyle: "standard" | "tabularLeft" | "tabularRight";
  tabWidth: number;
  linesBetweenQueries: number;
}

export function formatSQL(query: string, config: SqlFormatConfig): string {
  if (!query.trim()) return "";
  
  try {
    return format(query, {
      language: config.language,
      keywordCase: config.keywordCase,
      indentStyle: config.indentStyle,
      tabWidth: config.tabWidth,
      linesBetweenQueries: config.linesBetweenQueries,
    });
  } catch {
    // If it fails to parse/format, we just return original to prevent crashing
    return query;
  }
}
