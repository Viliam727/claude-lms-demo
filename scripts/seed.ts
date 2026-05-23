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

  // ─── Kurz: Claude API — Buduj AI aplikácie ───────────────────────────────

  console.log("Creating course: Claude API — Buduj AI aplikácie");
  const course = await api<{ id: string }>("/api/v1/courses", "POST", {
    title: "Claude API — Buduj AI aplikácie",
    description: "Naučte sa integrovať Claude API do vlastných aplikácií. Od prvého API volania až po produkčné nasadenie — vrátane tool use, streamingu a prompt cachingu.",
  });
  console.log(`  ✓ Course: ${course.id}`);

  // ─── Modul 1: Prvé kroky ──────────────────────────────────────────────────

  const mod1 = await api<{ id: string }>(`/api/v1/courses/${course.id}/modules`, "POST", {
    title: "Prvé kroky s Claude API",
    order: 1,
  });

  await api(`/api/v1/modules/${mod1.id}/lessons`, "POST", {
    title: "Čo je Claude API a prečo ho používať",
    type: "text",
    order: 1,
    content: {
      markdown: `# Čo je Claude API

Claude API je rozhranie od spoločnosti Anthropic, ktoré ti umožňuje integrovať schopnosti veľkého jazykového modelu Claude priamo do vlastných aplikácií, nástrojov alebo automatizácií.

## Prečo Claude API?

**Flexibilita** — Na rozdiel od chat rozhrania claude.ai máš plnú kontrolu nad správaním modelu. Môžeš nastaviť systémové pokyny, kontext, formát odpovede, teplotu aj maximálny počet tokenov.

**Integrácia** — API sa dá zavolať z akéhokoľvek jazyka (Python, TypeScript, Go, Rust...) a zabudovať do ľubovoľnej infraštruktúry.

**Škálovateľnosť** — Anthropic prevádzkuje infraštruktúru, ty sa staráš len o logiku aplikácie.

## Typické use-cases

- **Zákaznícka podpora** — chatbot, ktorý pozná tvoje produkty a vie odpovedať na otázky
- **Spracovanie dokumentov** — sumarizácia, extrakcia štruktúrovaných dát, klasifikácia
- **Generovanie obsahu** — drafty, preklady, prepisy
- **Kódový asistent** — review, generovanie testov, dokumentácia
- **Agenti** — Claude volá nástroje, spúšťa funkcie, pracuje autonomne na úlohách

## Čo budeš po tomto kurze vedieť

Po dokončení kurzu budeš schopný/á:

1. Zavolať Claude API z TypeScript/Python kódu
2. Navrhovať system prompty pre konkrétne use-cases
3. Spravovať multi-turn konverzácie
4. Vybrať správny model pre danú úlohu
5. Implementovať streaming, tool use a prompt caching
6. Bezpečne nasadiť aplikáciu do produkcie`,
    },
  });

  await api(`/api/v1/modules/${mod1.id}/lessons`, "POST", {
    title: "Nastavenie prostredia a API kľúč",
    type: "text",
    order: 2,
    content: {
      markdown: `# Nastavenie prostredia

Pred prvým volaním potrebuješ tri veci: účet na Anthropic Console, API kľúč a nainštalovaný SDK.

## 1. Získaj API kľúč

1. Choď na [console.anthropic.com](https://console.anthropic.com)
2. Registruj sa alebo prihlás
3. V sekcii **API Keys** klikni na **Create Key**
4. Skopíruj kľúč — zobrazí sa len raz

## 2. Nastav premenné prostredia

Nikdy nedávaj API kľúč priamo do kódu. Ulož ho do súboru \`.env\`:

\`\`\`bash
# .env
ANTHROPIC_API_KEY=sk-ant-api03-...
\`\`\`

Pridaj \`.env\` do \`.gitignore\`:

\`\`\`bash
echo ".env" >> .gitignore
\`\`\`

## 3. Nainštaluj SDK

**TypeScript / Node.js:**
\`\`\`bash
npm install @anthropic-ai/sdk
\`\`\`

**Python:**
\`\`\`bash
pip install anthropic
\`\`\`

## 4. Overiť inštaláciu

\`\`\`typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic(); // automaticky načíta ANTHROPIC_API_KEY z env

console.log("SDK inicializovaný:", !!client);
\`\`\`

## Limity a fakturácia

Nový účet dostane kredit zadarmo na testovanie. Spotreba sa fakturuje podľa počtu **tokenov** — vstupných aj výstupných. Aktuálne ceny nájdeš na [anthropic.com/pricing](https://anthropic.com/pricing).`,
    },
  });

  await api(`/api/v1/modules/${mod1.id}/lessons`, "POST", {
    title: "Prvý API call — Hello Claude",
    type: "text",
    order: 3,
    content: {
      markdown: `# Prvý API call

Teraz zavoláme Claude API prvýkrát. Ukážeme si minimálny príklad a vysvetlíme každý parameter.

## TypeScript

\`\`\`typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const message = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: "Vysvetli mi v dvoch vetách čo je REST API.",
    },
  ],
});

console.log(message.content[0].type === "text"
  ? message.content[0].text
  : message.content
);
\`\`\`

## Python

\`\`\`python
import anthropic

client = anthropic.Anthropic()

message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Vysvetli mi v dvoch vetách čo je REST API."}
    ],
)

print(message.content[0].text)
\`\`\`

## Čo každý parameter znamená

| Parameter | Popis |
|-----------|-------|
| \`model\` | Ktorý Claude model použiť (viac v module 3) |
| \`max_tokens\` | Maximálny počet tokenov v odpovedi |
| \`messages\` | Pole správ konverzácie — rola + obsah |

## Štruktúra odpovede

\`\`\`json
{
  "id": "msg_01XFDUDYJgAACzvnptvVoYEL",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "REST API je rozhranie..."
    }
  ],
  "model": "claude-sonnet-4-5",
  "stop_reason": "end_turn",
  "usage": {
    "input_tokens": 20,
    "output_tokens": 48
  }
}
\`\`\`

Obsah je pole — môže obsahovať text aj tool_use bloky. Vždy skontroluj \`content[0].type\` pred prístupom k \`.text\`.`,
    },
  });

  await api(`/api/v1/modules/${mod1.id}/lessons`, "POST", {
    title: "Kvíz: Základy API",
    type: "quiz",
    order: 4,
    content: {
      pass_score: 60,
      questions: [
        {
          text: "Kde sa ukladá API kľúč v bezpečnom projekte?",
          options: [
            { text: "Priamo v zdrojovom kóde" },
            { text: "V súbore .env mimo version control" },
            { text: "V komentári v kóde" },
            { text: "V názve súboru" },
          ],
          correct_option_index: 1,
        },
        {
          text: "Čo určuje parameter max_tokens?",
          options: [
            { text: "Maximálnu dĺžku vstupnej správy" },
            { text: "Maximálny počet tokenov v odpovedi modelu" },
            { text: "Počet API volaní za minútu" },
            { text: "Veľkosť modelu" },
          ],
          correct_option_index: 1,
        },
        {
          text: "Prečo je content v odpovedi pole a nie string?",
          options: [
            { text: "Je to chyba v API dizajne" },
            { text: "Odpoveď môže obsahovať aj text aj tool_use bloky" },
            { text: "Kvôli spätnej kompatibilite" },
            { text: "Pole je vždy rýchlejšie ako string" },
          ],
          correct_option_index: 1,
        },
      ],
    },
  });
  console.log(`  ✓ Modul 1: 4 lekcie`);

  // ─── Modul 2: Messages API ────────────────────────────────────────────────

  const mod2 = await api<{ id: string }>(`/api/v1/courses/${course.id}/modules`, "POST", {
    title: "Messages API do hĺbky",
    order: 2,
  });

  await api(`/api/v1/modules/${mod2.id}/lessons`, "POST", {
    title: "Štruktúra správy — role a content",
    type: "text",
    order: 1,
    content: {
      markdown: `# Štruktúra správy

Messages API je postavené na jednoduchom modeli: pole správ, kde každá správa má **rolu** a **obsah**.

## Role

\`\`\`typescript
type Role = "user" | "assistant";
\`\`\`

- **user** — správy od používateľa alebo tvojej aplikácie
- **assistant** — odpovede Clauda (alebo predvyplnená odpoveď, ak chceš riadiť formát)

## Typy obsahu

Obsah správy môže byť jednoduchý string:

\`\`\`typescript
{ role: "user", content: "Ahoj Claude!" }
\`\`\`

Alebo pole content blokov (pre multimodálne vstupy):

\`\`\`typescript
{
  role: "user",
  content: [
    { type: "text", text: "Čo je na tomto obrázku?" },
    {
      type: "image",
      source: {
        type: "base64",
        media_type: "image/jpeg",
        data: "<base64 data>",
      },
    },
  ],
}
\`\`\`

## Pravidlá konverzácie

1. Pole správ musí začínať správou s rolou \`user\`
2. Role sa musia striedať: user → assistant → user → ...
3. Nesmú byť dve správy rovnakej roly za sebou
4. System prompt sa zadáva **mimo** poľa messages (cez parameter \`system\`)

## Prefill odpovede

Môžeš predvyplniť začiatok Claudovej odpovede — hodí sa na vynútenie formátu:

\`\`\`typescript
messages: [
  { role: "user", content: "Daj mi JSON s menami 3 miest." },
  { role: "assistant", content: "[" }, // Claude dokončí od tohto bodu
]
\`\`\``,
    },
  });

  await api(`/api/v1/modules/${mod2.id}/lessons`, "POST", {
    title: "System prompty — ako dať AI osobnosť a pokyny",
    type: "text",
    order: 2,
    content: {
      markdown: `# System prompty

System prompt je inštrukcia, ktorá formuje správanie Clauda pre celú konverzáciu. Nastavuje sa mimo poľa messages.

## Základná syntax

\`\`\`typescript
const message = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  system: "Si slovenský jazykový asistent. Odpovedáš vždy po slovensky, stručne a vecne.",
  messages: [
    { role: "user", content: "What is the capital of France?" },
  ],
});
// Odpovie: "Hlavné mesto Francúzska je Paríž."
\`\`\`

## Čo dať do system promptu

**Rola a osobnosť:**
\`\`\`
Si expert na kybernetickú bezpečnosť s 15 rokmi praxe.
Vysvetľuješ technické koncepty jasne, bez zbytočného žargónu.
\`\`\`

**Formát výstupu:**
\`\`\`
Vždy odpovedaj v JSON formáte:
{"answer": "...", "confidence": "high|medium|low", "sources": [...]}
\`\`\`

**Hranice a obmedzenia:**
\`\`\`
Odpovedaj len na otázky týkajúce sa nášho produktu.
Ak otázka nesúvisí, zdvorilo presmeruj používateľa.
\`\`\`

**Kontext a dáta:**
\`\`\`
Máš prístup k nasledovnému katalógu produktov:
[tu vložíš dáta]
\`\`\`

## Tipy pre dobrý system prompt

- **Buď konkrétny** — "Odpovedaj v 2-3 vetách" je lepšie ako "Buď stručný"
- **Uvádzaj príklady** — few-shot v system prompte výrazne zlepší konzistentnosť
- **Testuj edge cases** — čo urobí Claude keď dostane neočakávaný vstup?
- **Verzionuj prompty** — uschovaj si históriu, zmeny môžu mať nečakané dopady`,
    },
  });

  await api(`/api/v1/modules/${mod2.id}/lessons`, "POST", {
    title: "Multi-turn konverzácie",
    type: "text",
    order: 3,
    content: {
      markdown: `# Multi-turn konverzácie

Claude API je **bezstavové** — každé volanie je nezávislé. Kontext konverzácie musíš spravovať sám tak, že pri každom volaní posielaš celú históriu správ.

## Vzor pre konverzačnú slučku

\`\`\`typescript
import Anthropic from "@anthropic-ai/sdk";
import * as readline from "readline";

const client = new Anthropic();
const history: { role: "user" | "assistant"; content: string }[] = [];

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask(prompt: string): Promise<string> {
  return new Promise((resolve) => rl.question(prompt, resolve));
}

async function chat() {
  console.log('Chatbot spustený. Napíš "exit" pre ukončenie.\\n');

  while (true) {
    const userInput = await ask("Ty: ");
    if (userInput === "exit") break;

    history.push({ role: "user", content: userInput });

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: "Si priateľský asistent. Pamätáš si kontext celej konverzácie.",
      messages: history,
    });

    const assistantText =
      response.content[0].type === "text" ? response.content[0].text : "";

    history.push({ role: "assistant", content: assistantText });
    console.log(\`Claude: \${assistantText}\\n\`);
  }

  rl.close();
}

chat();
\`\`\`

## Správa veľkosti kontextu

Každý model má limit kontextu (context window). Keď história narastie, máš niekoľko možností:

| Stratégia | Popis | Kedy použiť |
|-----------|-------|-------------|
| Sliding window | Vyhoď najstaršie správy | Jednoduchý chatbot |
| Sumarizácia | Claude sumarizuje staré správy | Dlhé konverzácie |
| Prompt caching | Cachovanie opakujúceho sa kontextu | Produkcia (ušetrí náklady) |

## Upozornenie na token limit

\`\`\`typescript
// Pred volaním skontroluj odhadovaný počet tokenov
const estimatedTokens = JSON.stringify(history).length / 4; // hrubý odhad
if (estimatedTokens > 150_000) {
  // skráť históriu alebo sumarizuj
}
\`\`\``,
    },
  });

  await api(`/api/v1/modules/${mod2.id}/lessons`, "POST", {
    title: "Kvíz: Messages API",
    type: "quiz",
    order: 4,
    content: {
      pass_score: 60,
      questions: [
        {
          text: "Kde sa nastavuje system prompt v Messages API?",
          options: [
            { text: "Ako prvá správa v poli messages s rolou 'system'" },
            { text: "Ako samostatný parameter mimo poľa messages" },
            { text: "V hlavičke HTTP požiadavky" },
            { text: "Priamo v modeli pri inicializácii" },
          ],
          correct_option_index: 1,
        },
        {
          text: "Prečo musíš pri každom API volaní posielať celú históriu správ?",
          options: [
            { text: "Je to chyba — Claude si pamätá kontext automaticky" },
            { text: "Claude API je bezstavové — každé volanie je nezávislé" },
            { text: "Kvôli bezpečnosti sa história neukladá" },
            { text: "Iba prvé volanie potrebuje históriu" },
          ],
          correct_option_index: 1,
        },
        {
          text: "Čo je prefill odpovede (assistant prefill)?",
          options: [
            { text: "Predvyplnenie vstupnej správy používateľa" },
            { text: "Predvyplnenie začiatku Claudovej odpovede na vynútenie formátu" },
            { text: "Automatické doplnenie system promptu" },
            { text: "Záložná odpoveď pri chybe API" },
          ],
          correct_option_index: 1,
        },
      ],
    },
  });
  console.log(`  ✓ Modul 2: 4 lekcie`);

  // ─── Modul 3: Modely a parametry ─────────────────────────────────────────

  const mod3 = await api<{ id: string }>(`/api/v1/courses/${course.id}/modules`, "POST", {
    title: "Modely a parametry",
    order: 3,
  });

  await api(`/api/v1/modules/${mod3.id}/lessons`, "POST", {
    title: "Claude Opus, Sonnet, Haiku — kedy čo použiť",
    type: "text",
    order: 1,
    content: {
      markdown: `# Rodina modelov Claude

Anthropic vydáva modely v troch úrovniach, ktoré sa líšia výkonom, rýchlosťou a cenou.

## Prehľad modelov (Claude 4.x)

| Model | ID | Silné stránky | Cena |
|-------|-----|--------------|------|
| Claude Opus 4 | claude-opus-4-5 | Najvyšší výkon, komplexné úlohy | Najvyššia |
| Claude Sonnet 4 | claude-sonnet-4-5 | Výkon/cena optimum | Stredná |
| Claude Haiku 4 | claude-haiku-4-5 | Najrýchlejší, najlacnejší | Najnižšia |

## Kedy použiť ktorý model

### Haiku — pre jednoduché, rýchle úlohy
\`\`\`typescript
// Klasifikácia, extrakcia, jednoduché transformácie
model: "claude-haiku-4-5"
\`\`\`
- Klasifikácia sentimentu, taggovanie
- Extrakcia štruktúrovaných dát z textu
- Jednoduché preklady
- Odpovede v real-time (chatbot s nízkymi nárokmi)

### Sonnet — pre väčšinu produkčných použití
\`\`\`typescript
// Dobrý pomer výkon/cena pre väčšinu use-cases
model: "claude-sonnet-4-5"
\`\`\`
- Zákaznícka podpora, konverzačné aplikácie
- Sumarizácia, analýza dokumentov
- Generovanie kódu (bežné úlohy)
- Štandardné agentné úlohy

### Opus — pre náročné úlohy
\`\`\`typescript
// Keď potrebuješ maximum
model: "claude-opus-4-5"
\`\`\`
- Komplexné reasoning a analýza
- Vedecké alebo technické úlohy
- Generovanie kódu pre komplexné systémy
- Situácie kde každá chyba je nákladná

## Praktické odporúčanie

Začni so Sonnetom. Ak je výkon nedostatočný → Opus. Ak je cena príliš vysoká a úloha je jednoduchá → Haiku.

\`\`\`typescript
// Vždy používaj konštantu, nie string literal
const MODEL = process.env.CLAUDE_MODEL ?? "claude-sonnet-4-5";
\`\`\``,
    },
  });

  await api(`/api/v1/modules/${mod3.id}/lessons`, "POST", {
    title: "Temperature, max_tokens a ďalšie parametre",
    type: "text",
    order: 2,
    content: {
      markdown: `# Parametre volania

Okrem \`model\` a \`messages\` máš k dispozícii niekoľko parametrov, ktorými riadíš správanie modelu.

## max_tokens (povinný)

Maximálny počet tokenov v odpovedi. Model sa zastaví keď dosiahne tento limit alebo prirodzený koniec odpovede.

\`\`\`typescript
max_tokens: 1024   // bežná odpoveď
max_tokens: 4096   // dlhší dokument
max_tokens: 16000  // veľmi dlhý výstup (napr. celý súbor)
\`\`\`

Nastav ho na rozumnú hodnotu — platíš za výstupné tokeny.

## temperature

Riadi náhodnosť/kreativitu odpovede. Rozsah 0–1.

\`\`\`typescript
temperature: 0     // deterministický, konzistentný — vhodný pre extrakciu, klasifikáciu
temperature: 0.3   // mierne variabilný — dobrý default
temperature: 1     // maximálna kreativita — brainstorming, kreatívne písanie
\`\`\`

**Dôležité:** Pre úlohy kde potrebuješ reprodukovateľnosť (testovanie, extrakcia dát) nastav \`temperature: 0\`.

## top_p a top_k

Alternatívne metódy riadenia náhodnosti. Zvyčajne stačí len temperature — top_p a top_k nemeň bez dobrého dôvodu.

## stop_sequences

Zoznam stringov, pri ktorých Claude zastaví generovanie:

\`\`\`typescript
stop_sequences: ["</answer>", "\\n\\nHuman:"]
\`\`\`

Hodí sa keď chceš presne ohraničiť výstup, napríklad pri extrakcii XML tagov.

## Príklad: deterministická extrakcia

\`\`\`typescript
const result = await client.messages.create({
  model: "claude-haiku-4-5",
  max_tokens: 256,
  temperature: 0,
  system: "Extrahuj meno a email z textu. Odpovedaj len JSON: {\\"name\\": \\"...\\", \\"email\\": \\"...\\"}",
  messages: [
    { role: "user", content: "Kontakt: Ján Novák, jan.novak@firma.sk" }
  ],
});
\`\`\``,
    },
  });

  await api(`/api/v1/modules/${mod3.id}/lessons`, "POST", {
    title: "Streaming odpovedí v praxi",
    type: "text",
    order: 3,
    content: {
      markdown: `# Streaming odpovedí

Streaming umožňuje zobrazovať odpoveď tokeny po tokene, hneď ako ich model generuje — bez čakania na celú odpoveď. Výrazne zlepšuje UX pri dlhších odpovediach.

## Kedy použiť streaming

- Chatbot rozhrania (používateľ vidí odpoveď "ako sa píše")
- Dlhé generovanie (dokumenty, kód)
- Kedykoľvek latencia vadí používateľskému zážitku

## TypeScript — stream s SDK

\`\`\`typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const stream = await client.messages.stream({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  messages: [
    { role: "user", content: "Napíš mi krátku báseň o programovaní." }
  ],
});

// Spracovanie tokenov priebežne
for await (const chunk of stream) {
  if (
    chunk.type === "content_block_delta" &&
    chunk.delta.type === "text_delta"
  ) {
    process.stdout.write(chunk.delta.text);
  }
}

// Finálna správa (obsahuje usage stats)
const finalMessage = await stream.getFinalMessage();
console.log("\\n\\nTokeny:", finalMessage.usage);
\`\`\`

## Next.js API Route so streamingom

\`\`\`typescript
// app/api/chat/route.ts
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(req: Request) {
  const { message } = await req.json();

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    messages: [{ role: "user", content: message }],
  });

  // Prekonvertuj na ReadableStream pre Response
  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          controller.enqueue(new TextEncoder().encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readableStream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
\`\`\`

## Na strane klienta (React)

\`\`\`typescript
async function sendMessage(text: string) {
  const res = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({ message: text }),
  });

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let result = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result += decoder.decode(value);
    setResponse(result); // React state — re-renderuje postupne
  }
}
\`\`\``,
    },
  });

  await api(`/api/v1/modules/${mod3.id}/lessons`, "POST", {
    title: "Kvíz: Modely a parametry",
    type: "quiz",
    order: 4,
    content: {
      pass_score: 60,
      questions: [
        {
          text: "Ktorý model je najvhodnejší pre jednoduchú klasifikáciu sentimentu v produkčnej aplikácii s tisíckami volaní denne?",
          options: [
            { text: "Claude Opus — najvyšší výkon zaručí presnosť" },
            { text: "Claude Haiku — rýchly a lacný pre jednoduché úlohy" },
            { text: "Vždy treba Sonnet ako kompromis" },
            { text: "Na klasifikáciu API nepoužívaj, len lokálne modely" },
          ],
          correct_option_index: 1,
        },
        {
          text: "Akú hodnotu temperature nastav pri extrakcii štruktúrovaných dát z textu?",
          options: [
            { text: "1 — maximálna kreativita zlepší výsledky" },
            { text: "0.7 — zlatý stred" },
            { text: "0 — deterministický výstup pre konzistentnosť" },
            { text: "Na temperature nezáleží pri extrakcii" },
          ],
          correct_option_index: 2,
        },
        {
          text: "Prečo streaming zlepšuje používateľský zážitok?",
          options: [
            { text: "Zrýchľuje samotné generovanie modelu" },
            { text: "Znižuje cenu API volaní" },
            { text: "Používateľ vidí odpoveď priebežne bez čakania na celý výstup" },
            { text: "Umožňuje volať API bez autentifikácie" },
          ],
          correct_option_index: 2,
        },
      ],
    },
  });
  console.log(`  ✓ Modul 3: 4 lekcie`);

  // ─── Modul 4: Produkčné nasadenie ────────────────────────────────────────

  const mod4 = await api<{ id: string }>(`/api/v1/courses/${course.id}/modules`, "POST", {
    title: "Produkčné nasadenie",
    order: 4,
  });

  await api(`/api/v1/modules/${mod4.id}/lessons`, "POST", {
    title: "Tool use — Claude volá tvoje funkcie",
    type: "text",
    order: 1,
    content: {
      markdown: `# Tool Use

Tool use (function calling) umožňuje Claudovi volať funkcie, ktoré mu definuješ. Claude sa rozhodne kedy a s akými argumentmi nástroj zavolá — ty vykonáš skutočný kód a výsledok pošleš späť.

## Ako to funguje

1. Definuješ nástroje (JSON schema)
2. Pošleš správu Claudovi
3. Claude vráti \`tool_use\` blok s názvom nástroja a argumentmi
4. Ty vykonáš nástroj a pošleš výsledok späť
5. Claude vygeneruje finálnu odpoveď

## Príklad: vyhľadávač počasia

\`\`\`typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

// 1. Definuj nástroje
const tools: Anthropic.Tool[] = [
  {
    name: "get_weather",
    description: "Vráti aktuálne počasie pre zadané mesto",
    input_schema: {
      type: "object" as const,
      properties: {
        city: { type: "string", description: "Názov mesta" },
        units: {
          type: "string",
          enum: ["celsius", "fahrenheit"],
          description: "Jednotky teploty",
        },
      },
      required: ["city"],
    },
  },
];

// 2. Prvé volanie — Claude sa rozhodne použiť nástroj
const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools,
  messages: [{ role: "user", content: "Aké je počasie v Bratislave?" }],
});

// 3. Spracuj tool_use bloky
if (response.stop_reason === "tool_use") {
  const toolUseBlock = response.content.find((b) => b.type === "tool_use");
  if (toolUseBlock?.type === "tool_use") {
    const args = toolUseBlock.input as { city: string; units?: string };

    // 4. Vykonaj skutočný kód (tu simulujeme)
    const weatherData = { temperature: 18, condition: "Oblačno", humidity: 72 };

    // 5. Pošli výsledok späť
    const finalResponse = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      tools,
      messages: [
        { role: "user", content: "Aké je počasie v Bratislave?" },
        { role: "assistant", content: response.content },
        {
          role: "user",
          content: [
            {
              type: "tool_result",
              tool_use_id: toolUseBlock.id,
              content: JSON.stringify(weatherData),
            },
          ],
        },
      ],
    });

    console.log(finalResponse.content[0].type === "text"
      ? finalResponse.content[0].text
      : "");
  }
}
\`\`\`

## Tipy pre tool use

- **Popis je kľúčový** — Claude rozhoduje o použití nástroja na základe \`description\`. Buď konkrétny.
- **Validuj vstupy** — Claude môže vygenerovať neočakávané hodnoty, vždy validuj pred vykonaním
- **Parallel tool use** — Claude môže volať viac nástrojov naraz, spracuj všetky \`tool_use\` bloky`,
    },
  });

  await api(`/api/v1/modules/${mod4.id}/lessons`, "POST", {
    title: "Prompt caching — rýchlosť a úspora nákladov",
    type: "text",
    order: 2,
    content: {
      markdown: `# Prompt Caching

Prompt caching umožňuje Anthropicu uložiť časť promptu do cache a pri opakovaných volaniach ju znovu použiť. Výsledok: **až 90% nižšia cena** a **až 85% nižšia latencia** pre cachovateľnú časť.

## Kedy sa oplatí

- Dlhý system prompt, ktorý sa nemení (katalóg produktov, dokumentácia, pravidlá)
- Spracovanie toho istého dokumentu s rôznymi otázkami
- Few-shot príklady v system prompte

## Ako aktivovať caching

Pridaj \`cache_control\` na koniec bloku, ktorý chceš cachovať:

\`\`\`typescript
const message = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  system: [
    {
      type: "text",
      text: \`Si zákaznícky asistent pre e-shop. Tu je celý katalóg produktov:

[...10 000 slov katalógu...]\`,
      cache_control: { type: "ephemeral" }, // cachuj tento blok
    },
  ],
  messages: [{ role: "user", content: "Máte červené tenisky v size 42?" }],
});
\`\`\`

## Ako funguje cache

- Cache má TTL **5 minút** — ak zavoláš API do 5 minút s rovnakým prefixom, použije sa cache
- Cachovanie stojí 25% viac pri **zápise** do cache (prvé volanie)
- Cachovanie stojí 90% menej pri **čítaní** z cache (ďalšie volania)
- Minimálna veľkosť pre caching: 1024 tokenov

## Sledovanie cache hitov

\`\`\`typescript
console.log(message.usage);
// {
//   input_tokens: 12,          // tokeny nezacachované
//   cache_read_input_tokens: 9823,  // tokeny prečítané z cache
//   cache_creation_input_tokens: 0, // tokeny zapísané do cache
//   output_tokens: 156
// }
\`\`\`

## Úspora v praxi

Ak máš 5000 tokenov v system prompte a robíš 1000 volaní denne:

| Bez cachingu | S cachingom |
|---|---|
| 1000 × 5000 = 5M vstupných tokenov | ~5000 (zápis) + 999 × 500 = ~504K tokenov |
| Plná cena | ~90% úspora |`,
    },
  });

  await api(`/api/v1/modules/${mod4.id}/lessons`, "POST", {
    title: "Error handling, rate limits a best practices",
    type: "text",
    order: 3,
    content: {
      markdown: `# Error Handling a Rate Limits

Produkčná aplikácia musí správne zvládať chyby a limity. Anthropic API vracia štandardné HTTP chyby so štruktúrovaným telom.

## Typy chýb

| HTTP kód | Typ | Príčina |
|----------|-----|---------|
| 400 | invalid_request_error | Zlý formát požiadavky |
| 401 | authentication_error | Neplatný API kľúč |
| 403 | permission_error | Nemáš prístup k modelu |
| 429 | rate_limit_error | Prekročený limit volaní |
| 529 | overloaded_error | Anthropic servery sú preťažené |

## Retry s exponential backoff

\`\`\`typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  maxRetries: 3, // SDK automaticky retryuje 429 a 529
});
\`\`\`

SDK to robí za teba — ale pre vlastnú logiku:

\`\`\`typescript
async function callWithRetry(
  fn: () => Promise<unknown>,
  maxRetries = 3
): Promise<unknown> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (err instanceof Anthropic.RateLimitError && attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      throw err;
    }
  }
}
\`\`\`

## Rate Limits

Limity sú na úrovni **organizácie** a sú definované v tokenoch za minútu (TPM) aj požiadavkách za minútu (RPM).

- Sleduj hlavičky \`x-ratelimit-remaining-requests\` a \`x-ratelimit-remaining-tokens\`
- Pre vysoký objem použij **Batches API** — až 50% zľava, 24h okno na spracovanie

## Bezpečnostné best practices

\`\`\`typescript
// ✅ Správne — API kľúč z env
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ❌ Nikdy takto — kľúč v kóde
const client = new Anthropic({ apiKey: "sk-ant-api03-hardcoded" });
\`\`\`

- Nikdy neposielaj API kľúč na frontend
- Vždy volaj API cez backend/server
- Loguj chyby, nie obsah správ (môžu obsahovať citlivé dáta)
- Nastav rozumné \`max_tokens\` — chráni pred neočakávane dlhými a drahými odpoveďami`,
    },
  });

  await api(`/api/v1/modules/${mod4.id}/lessons`, "POST", {
    title: "Záverečný kvíz",
    type: "quiz",
    order: 4,
    content: {
      pass_score: 70,
      questions: [
        {
          text: "Ako Claude signalizuje, že chce zavolať nástroj (tool)?",
          options: [
            { text: "Vráti HTTP 202 Accepted" },
            { text: "V odpovedi je stop_reason: 'tool_use' a content obsahuje tool_use blok" },
            { text: "Zavolá webhook priamo" },
            { text: "Pošle špeciálnu hlavičku X-Tool-Call" },
          ],
          correct_option_index: 1,
        },
        {
          text: "Aká je minimálna veľkosť promptu pre aktiváciu prompt cachingu?",
          options: [
            { text: "256 tokenov" },
            { text: "512 tokenov" },
            { text: "1024 tokenov" },
            { text: "Neexistuje minimum" },
          ],
          correct_option_index: 2,
        },
        {
          text: "Čo robí SDK automaticky pri chybe 429 (rate limit)?",
          options: [
            { text: "Prepne na lacnejší model" },
            { text: "Retryuje s exponential backoff (ak je maxRetries > 0)" },
            { text: "Hodí chybu ihneď bez opakovania" },
            { text: "Čaká presne 60 sekúnd" },
          ],
          correct_option_index: 1,
        },
        {
          text: "Kde NIKDY nesmie byť API kľúč?",
          options: [
            { text: "V environment variables na serveri" },
            { text: "V secrets manageri (napr. Cloudflare Secrets)" },
            { text: "Na frontende / v JS kóde stiahnutom do prehliadača" },
            { text: "V CI/CD environment variables" },
          ],
          correct_option_index: 2,
        },
      ],
    },
  });
  console.log(`  ✓ Modul 4: 4 lekcie`);

  console.log(`\n✅ Seed complete!`);
  console.log(`\nCourse ID: ${course.id}`);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
