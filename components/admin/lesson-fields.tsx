"use client";

import { useState } from "react";

const QUIZ_TEMPLATE = `{
  "pass_score": 60,
  "questions": [
    {
      "text": "Otázka 1?",
      "options": [{ "text": "A" }, { "text": "B" }],
      "correct_option_index": 0
    }
  ]
}`;

export function LessonFields({
  type,
  defaultUrl = "",
  defaultMarkdown = "",
  defaultQuizJson = QUIZ_TEMPLATE,
}: {
  type: string;
  defaultUrl?: string;
  defaultMarkdown?: string;
  defaultQuizJson?: string;
}) {
  const [lessonType, setLessonType] = useState(type);

  return (
    <>
      <div>
        <label className="block text-sm font-medium mb-1.5">Typ lekcie</label>
        <select
          name="type"
          value={lessonType}
          onChange={(e) => setLessonType(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
        >
          <option value="video">Video</option>
          <option value="text">Text (markdown)</option>
          <option value="quiz">Kvíz (JSON)</option>
        </select>
      </div>

      {lessonType === "video" && (
        <div>
          <label className="block text-sm font-medium mb-1.5">Video URL</label>
          <input
            name="url"
            type="url"
            defaultValue={defaultUrl}
            placeholder="https://..."
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            required
          />
        </div>
      )}

      {lessonType === "text" && (
        <div>
          <label className="block text-sm font-medium mb-1.5">Markdown</label>
          <textarea
            name="markdown"
            rows={8}
            defaultValue={defaultMarkdown}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono text-xs"
            required
          />
        </div>
      )}

      {lessonType === "quiz" && (
        <div>
          <label className="block text-sm font-medium mb-1.5">Kvíz JSON</label>
          <textarea
            name="quiz_json"
            rows={12}
            defaultValue={defaultQuizJson}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono text-xs"
            required
          />
        </div>
      )}
    </>
  );
}
