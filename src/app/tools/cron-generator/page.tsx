import { permanentRedirect } from "next/navigation";

export default function CronGeneratorRedirect() {
  permanentRedirect("/tools/cron-parser");
}
