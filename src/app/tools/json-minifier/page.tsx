import { permanentRedirect } from "next/navigation";

export default function JsonMinifierRedirect() {
  permanentRedirect("/tools/json-formatter");
}
