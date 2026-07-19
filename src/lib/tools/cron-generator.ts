import cronstrue from "cronstrue/i18n";
const parser = require("cron-parser");

export interface CronConfig {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

export interface CronGeneratorResult {
  expression: string;
  description: string;
  nextRuns: string[];
}

export function generateCron(config: CronConfig): CronGeneratorResult {
  const expr = `${config.minute} ${config.hour} ${config.dayOfMonth} ${config.month} ${config.dayOfWeek}`;
  
  try {
    const desc = cronstrue.toString(expr, { locale: "en" });
    const interval = parser.parseExpression(expr);
    
    const runs = [];
    for (let i = 0; i < 5; i++) {
      runs.push(interval.next().toString());
    }
    
    return {
      expression: expr,
      description: desc,
      nextRuns: runs
    };
  } catch {
    return {
      expression: expr,
      description: "Invalid expression. Check your parameters.",
      nextRuns: []
    };
  }
}
