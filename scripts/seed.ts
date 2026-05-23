import "dotenv/config";

const BASE_URL = process.env.LMS_API_URL!;
const API_KEY = process.env.LMS_API_KEY!;

async function api<T>(path: string, method = "GET", body?: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const json = await res.json();
  if (!res.ok) {
    console.error("API error:", json);
    throw new Error(`${method} ${path} → ${res.status}`);
  }
  return ("data" in json ? json.data : json) as T;
}

async function seed() {
  console.log("🌱 Seeding LMS demo data...\n");

  // --- Kurz 1: Úvod do AI ---
  console.log("Creating course 1: Úvod do AI");
  const course1 = await api<{ id: string }>("/api/v1/courses", "POST", {
    title: "Úvod do AI",
    description: "Základy umelej inteligencie pre každého. Pochopte ako funguje AI, strojové učenie a veľké jazykové modely.",
  });
  console.log(`  ✓ Course: ${course1.id}`);

  const module1a = await api<{ id: string }>(`/api/v1/courses/${course1.id}/modules`, "POST", {
    title: "Základy AI",
    order: 1,
  });
  console.log(`  ✓ Module: ${module1a.id}`);

  const l1 = await api<{ id: string }>(`/api/v1/modules/${module1a.id}/lessons`, "POST", {
    title: "Čo je umelá inteligencia?",
    type: "video",
    order: 1,
    content: {
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      duration_sec: 596,
    },
  });
  console.log(`  ✓ Lesson (video): ${l1.id}`);

  const l2 = await api<{ id: string }>(`/api/v1/modules/${module1a.id}/lessons`, "POST", {
    title: "Ako funguje strojové učenie",
    type: "text",
    order: 2,
    content: {
      markdown: `# Strojové učenie

Strojové učenie je podoblasť umelej inteligencie, ktorá umožňuje systémom automaticky sa učiť a zlepšovať sa zo skúseností bez toho, aby boli explicitne naprogramované.

## Tri hlavné typy

**Supervised learning** — Model sa učí na označených dátach. Príklad: rozpoznávanie spamu v emailoch.

**Unsupervised learning** — Model hľadá vzory v neoznačených dátach. Príklad: segmentácia zákazníkov.

**Reinforcement learning** — Model sa učí cez odmeny a tresty. Príklad: hry ako šach alebo Go.

## Praktické využitie

Dnes AI poháňa odporúčacie systémy, prekladače, asistentov v zákazníckej podpore a mnoho ďalšieho. Každý deň interagujete s desiatkami AI systémov — od vyhľadávania až po navigáciu.`,
    },
  });
  console.log(`  ✓ Lesson (text): ${l2.id}`);

  const l3 = await api<{ id: string }>(`/api/v1/modules/${module1a.id}/lessons`, "POST", {
    title: "Kvíz: Základy AI",
    type: "quiz",
    order: 3,
    content: {
      pass_score: 60,
      questions: [
        {
          text: "Čo je supervised learning?",
          options: [
            { text: "Učenie bez označených dát" },
            { text: "Učenie na označených dátach s správnymi odpoveďami" },
            { text: "Učenie cez odmeny a tresty" },
            { text: "Kopírovanie ľudského mozgu" },
          ],
          correct_option_index: 1,
        },
        {
          text: "Ktorý typ ML sa používa pri odporúčacích systémoch?",
          options: [
            { text: "Reinforcement learning" },
            { text: "Unsupervised learning" },
            { text: "Supervised learning" },
            { text: "Žiadny z vyššie uvedených" },
          ],
          correct_option_index: 2,
        },
        {
          text: "Čo je GPT?",
          options: [
            { text: "Grafický procesor" },
            { text: "Typ databázy" },
            { text: "Veľký jazykový model" },
            { text: "Programovací jazyk" },
          ],
          correct_option_index: 2,
        },
      ],
    },
  });
  console.log(`  ✓ Lesson (quiz): ${l3.id}`);

  // --- Kurz 2: Pokročilý prompting ---
  console.log("\nCreating course 2: Pokročilý prompting");
  const course2 = await api<{ id: string }>("/api/v1/courses", "POST", {
    title: "Pokročilý prompting",
    description: "Naučte sa efektívne komunikovať s AI modelmi. Od základných promptov až po komplexné techniky ako chain-of-thought a few-shot learning.",
  });
  console.log(`  ✓ Course: ${course2.id}`);

  const module2a = await api<{ id: string }>(`/api/v1/courses/${course2.id}/modules`, "POST", {
    title: "Techniky promptingu",
    order: 1,
  });
  console.log(`  ✓ Module: ${module2a.id}`);

  const l4 = await api<{ id: string }>(`/api/v1/modules/${module2a.id}/lessons`, "POST", {
    title: "Zero-shot vs Few-shot prompting",
    type: "video",
    order: 1,
    content: {
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      duration_sec: 653,
    },
  });
  console.log(`  ✓ Lesson (video): ${l4.id}`);

  const l5 = await api<{ id: string }>(`/api/v1/modules/${module2a.id}/lessons`, "POST", {
    title: "Kvíz: Promptingové techniky",
    type: "quiz",
    order: 2,
    content: {
      pass_score: 50,
      questions: [
        {
          text: "Čo je zero-shot prompting?",
          options: [
            { text: "Používanie príkladov v prompte" },
            { text: "Pýtanie sa bez poskytnutia príkladov" },
            { text: "Opakované pýtanie toho istého" },
            { text: "Prompting s obrázkami" },
          ],
          correct_option_index: 1,
        },
        {
          text: "Čo je chain-of-thought prompting?",
          options: [
            { text: "Zreťazenie viacerých AI modelov" },
            { text: "Technika kde model vysvetlí svoj postup myslenia" },
            { text: "Automatické generovanie promptov" },
            { text: "Skracovanie promptov na minimum" },
          ],
          correct_option_index: 1,
        },
      ],
    },
  });
  console.log(`  ✓ Lesson (quiz): ${l5.id}`);

  console.log("\n✅ Seed complete!");
  console.log(`\nCourse IDs:`);
  console.log(`  Úvod do AI:         ${course1.id}`);
  console.log(`  Pokročilý prompting: ${course2.id}`);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
