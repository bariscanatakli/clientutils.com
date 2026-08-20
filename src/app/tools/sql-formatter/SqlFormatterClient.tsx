"use client";

import { useState, useMemo } from "react";
import { formatSQL, SqlFormatConfig } from "@/lib/tools/sql-formatter";
import { CopyButton } from "@/components/ui/CopyButton";

const INITIAL_SQL = `SELECT customer_id,COUNT(order_id) AS total_orders,SUM(order_total) AS total_spent FROM orders WHERE order_date>='2026-01-01' GROUP BY customer_id HAVING SUM(order_total)>1000 ORDER BY total_spent DESC;`;

export function SqlFormatterClient() {
  const [input, setInput] = useState(INITIAL_SQL);
  const [config, setConfig] = useState<SqlFormatConfig>({
    language: "sql",
    keywordCase: "upper",
    indentStyle: "standard",
    tabWidth: 2,
    linesBetweenQueries: 1
  });

  const formattedSql = useMemo(() => formatSQL(input, config), [input, config]);

  return (
    <div className="stagger-children max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">SQL Formatter</h1>
          <p className="text-sm text-muted mt-2">
            Format, beautify and standardize your SQL queries across multiple dialects.
          </p>
        </div>

        {/* Top toolbar for simple settings */}
        <div className="flex flex-wrap items-center gap-2">
          <select 
            value={config.language} 
            onChange={(e) => setConfig({ ...config, language: e.target.value as SqlFormatConfig["language"] })}
            className="text-xs bg-input border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          >
            <option value="sql">Standard SQL</option>
            <option value="postgresql">PostgreSQL</option>
            <option value="mysql">MySQL</option>
            <option value="mariadb">MariaDB</option>
            <option value="sqlite">SQLite</option>
            <option value="tsql">T-SQL (SQL Server)</option>
          </select>

          <select 
            value={config.keywordCase} 
            onChange={(e) => setConfig({ ...config, keywordCase: e.target.value as SqlFormatConfig["keywordCase"] })}
            className="text-xs bg-input border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          >
            <option value="upper">UPPERCASE Keywords</option>
            <option value="lower">lowercase keywords</option>
            <option value="preserve">Preserve Case</option>
          </select>
          
          <button 
            onClick={() => setInput("")} 
            className="text-xs font-semibold bg-card border border-border text-foreground px-4 py-2 rounded-lg hover:bg-card-hover active:scale-97 pressable transition-all"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:h-[600px]">
        {/* Input Pane */}
        <div className="flex flex-col border border-border rounded-xl bg-code-bg overflow-hidden h-[300px] lg:h-full">
          <div className="bg-sidebar border-b border-border px-4 py-2 flex items-center justify-between">
             <span className="text-xs font-mono text-muted">input.sql</span>
          </div>
          <textarea
             value={input}
             onChange={(e) => setInput(e.target.value)}
             className="flex-1 resize-none bg-transparent outline-none p-4 text-sm font-mono text-code-foreground whitespace-pre-wrap break-words leading-relaxed"
             spellCheck={false}
             placeholder="Paste your unformatted SQL here..."
          />
        </div>

        {/* Output Pane */}
        <div className="flex flex-col border border-border rounded-xl bg-code-bg overflow-hidden h-[300px] lg:h-full">
          <div className="bg-sidebar border-b border-border px-4 py-2 flex items-center justify-between">
             <span className="text-xs font-mono text-muted">formatted.sql</span>
             <CopyButton text={formattedSql} size="sm" label="Kopyala" />
          </div>
          <div className="flex-1 overflow-auto p-4">
             {formattedSql ? (
               <pre className="text-sm font-mono text-code-foreground">
                 {formattedSql}
               </pre>
             ) : (
               <div className="h-full flex items-center justify-center text-muted text-sm">
                 Waiting for SQL input...
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
