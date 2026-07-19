export type GradientType = "linear" | "radial" | "conic";

export interface ColorStop {
  id: string;
  color: string; // hex or rgba
  position: number; // 0 to 100
}

export interface GradientConfig {
  type: GradientType;
  angle: number; // for linear and conic
  shape: "circle" | "ellipse"; // for radial
  position: string; // for radial, e.g. "center", "top left"
  stops: ColorStop[];
}

export function generateGradientCSS(config: GradientConfig): string {
  const sortedStops = [...config.stops].sort((a, b) => a.position - b.position);
  const stopsStr = sortedStops.map(s => `${s.color} ${s.position}%`).join(", ");

  switch (config.type) {
    case "linear":
      return `linear-gradient(${config.angle}deg, ${stopsStr})`;
    case "radial":
      return `radial-gradient(${config.shape} at ${config.position}, ${stopsStr})`;
    case "conic":
      return `conic-gradient(from ${config.angle}deg, ${stopsStr})`;
    default:
      return "";
  }
}

export function generateTailwindClass(config: GradientConfig): string {
  // We only support simple 2 or 3 stop linear gradients for Tailwind output
  // to avoid overly complex arbitrary values
  if (config.type !== "linear") return "/* Tailwind sınıfları sadece basit linear-gradient için desteklenir */";

  let dirClass = "";
  // Map angles to standard tailwind directions approximately
  const ang = config.angle % 360;
  if (ang >= 337.5 || ang < 22.5) dirClass = "bg-gradient-to-t";
  else if (ang >= 22.5 && ang < 67.5) dirClass = "bg-gradient-to-tr";
  else if (ang >= 67.5 && ang < 112.5) dirClass = "bg-gradient-to-r";
  else if (ang >= 112.5 && ang < 157.5) dirClass = "bg-gradient-to-br";
  else if (ang >= 157.5 && ang < 202.5) dirClass = "bg-gradient-to-b";
  else if (ang >= 202.5 && ang < 247.5) dirClass = "bg-gradient-to-bl";
  else if (ang >= 247.5 && ang < 292.5) dirClass = "bg-gradient-to-l";
  else if (ang >= 292.5 && ang < 337.5) dirClass = "bg-gradient-to-tl";

  const sortedStops = [...config.stops].sort((a, b) => a.position - b.position);
  
  if (sortedStops.length === 2) {
    return `${dirClass} from-[${sortedStops[0].color}] to-[${sortedStops[1].color}]`;
  } else if (sortedStops.length === 3) {
    return `${dirClass} from-[${sortedStops[0].color}] via-[${sortedStops[1].color}] to-[${sortedStops[2].color}]`;
  } else {
     return "/* 2 veya 3 renkten fazlası için özel CSS kullanın */";
  }
}
