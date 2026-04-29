import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SEEDS_DIR = path.resolve(__dirname, "seeds");

const seedFiles = [
  "seed-institution.ts",
  "seed-predefined-bins.ts",
  "seed-course-bins.ts",
  "seed-user.ts",
  "seed-courses.ts",
  "seed-rubric1.ts",
  "seed-rubric2.ts",
  "seed-rubric3.ts",
  "seed-rubric4.ts",
  "seed-rubric5.ts",
  "seed-rubric6.ts",
  "seed-rubric7.ts",
  "seed-responses.ts",
  // "seed-consensus.ts",
];

function run(file: string) {
  const filePath = path.join(SEEDS_DIR, file);
  console.log(`\nRunning ${file}...`);
  try {
    execSync(`tsx ${filePath}`, { stdio: "inherit" });
  } catch {
    console.error(`\n✗  Failed on ${file}`);
    process.exit(1);
  }
}

console.log("🌱 Starting full seed...\n");
const start = Date.now();

for (const file of seedFiles) {
  run(file);
}

const elapsed = ((Date.now() - start) / 1000).toFixed(1);
console.log(`\nAll seeds complete in ${elapsed}s`);
