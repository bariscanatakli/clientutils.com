import type { Metadata } from "next";
import { buildPageMeta } from "@/lib/constants/seo";
import { ColorConverterClient } from "./ColorConverterClient";

export const metadata: Metadata = buildPageMeta({
  title: "Color Converter (HEX, RGB, HSL)",
  description:
    "Convert colors instantly between HEX, RGB, and HSL formats. Features live visual preview and one-click copying for developers and designers.",
  path: "/tools/color-converter",
});

export default function ColorConverterPage() {
  return (
    <>
      <ColorConverterClient />

      {/* SEO & Context Content */}
      <div className="mt-16 mx-auto max-w-5xl pt-8 border-t border-border prose prose-sm dark:prose-invert">
        <h2 className="text-lg font-semibold text-foreground mb-4">Understanding Color Models</h2>
        
        <h3 className="text-md font-semibold text-foreground mb-3 mt-6">HEX (Hexadecimal)</h3>
        <p className="text-muted leading-relaxed mb-4">
          HEX is a 6-digit, 24-bit, hexadecimal number that represents Red, Green, and Blue. It is the most common format used in web design and CSS.
          For example, <code>#FF0000</code> represents pure red.
        </p>

        <h3 className="text-md font-semibold text-foreground mb-3 mt-6">RGB (Red, Green, Blue)</h3>
        <p className="text-muted leading-relaxed mb-4">
          RGB is an additive color model based on the three primary colors of light. Each value ranges from 0 to 255. 
          When all three are 0, you get black; when all three are 255, you get white.
        </p>

        <h3 className="text-md font-semibold text-foreground mb-3 mt-6">HSL (Hue, Saturation, Lightness)</h3>
        <p className="text-muted leading-relaxed mb-4">
          HSL is often preferred by designers because it is more intuitive to human perception.
        </p>
        <ul className="space-y-2 text-muted list-none pl-0">
          <li><strong>Hue:</strong> A degree on the color wheel from 0 to 360 (0 is red, 120 is green, 240 is blue).</li>
          <li><strong>Saturation:</strong> A percentage value (0% means a shade of gray, 100% is the full color).</li>
          <li><strong>Lightness:</strong> A percentage value (0% is black, 50% is neither light nor dark, 100% is white).</li>
        </ul>
      </div>
    </>
  );
}
