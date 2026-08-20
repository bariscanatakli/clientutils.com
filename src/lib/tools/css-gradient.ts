export type GradientType = "linear" | "radial" | "conic";
export type TailwindVersion = "v4" | "v3";

export interface ColorStop {
  id: string;
  color: string;
  position: number;
}

export interface GradientConfig {
  type: GradientType;
  angle: number;
  shape: "circle" | "ellipse";
  position: string;
  stops: ColorStop[];
}

function normalizedAngle(angle: number): number {
  return ((Math.round(angle) % 360) + 360) % 360;
}

function sortedStops(config: GradientConfig): ColorStop[] {
  return [...config.stops].sort((first, second) => first.position - second.position);
}

export function generateGradientCSS(config: GradientConfig): string {
  const stops = sortedStops(config).map((stop) => `${stop.color} ${stop.position}%`).join(", ");
  if (config.type === "linear") return `linear-gradient(${normalizedAngle(config.angle)}deg, ${stops})`;
  if (config.type === "radial") return `radial-gradient(${config.shape} at ${config.position}, ${stops})`;
  return `conic-gradient(from ${normalizedAngle(config.angle)}deg, ${stops})`;
}

function arbitraryBackground(config: GradientConfig): string {
  return `bg-[${generateGradientCSS(config).replace(/ /g, "_")}]`;
}

function stopUtilities(config: GradientConfig): string {
  const stops = sortedStops(config);
  const first = stops[0];
  const last = stops[stops.length - 1];
  const classes = [`from-[${first.color}]`, `from-[${first.position}%]`];
  if (stops.length === 3) classes.push(`via-[${stops[1].color}]`, `via-[${stops[1].position}%]`);
  classes.push(`to-[${last.color}]`, `to-[${last.position}%]`);
  return classes.join(" ");
}

export function generateTailwindClass(config: GradientConfig, version: TailwindVersion): string {
  if (version === "v3" || config.stops.length > 3) return arbitraryBackground(config);

  let background: string;
  if (config.type === "linear") background = `bg-linear-${normalizedAngle(config.angle)}`;
  else if (config.type === "radial") background = `bg-radial-[${config.shape}_at_${config.position.replace(/ /g, "_")}]`;
  else background = `bg-conic-${normalizedAngle(config.angle)}`;
  return `${background} ${stopUtilities(config)}`;
}

export function generateHtmlExample(config: GradientConfig, version: TailwindVersion): string {
  return `<div class="h-64 w-full rounded-xl ${generateTailwindClass(config, version)}"></div>`;
}
