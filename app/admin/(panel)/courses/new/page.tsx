import Link from "next/link";
import { createCourseAction } from "../../../actions";
import { Button } from "@/components/ui/button";

export default function NewCoursePage() {
  return (
    <div className="max-w-lg">
      <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-800">
        ← Späť na kurzy
      </Link>
      <h1 className="text-2xl font-semibold mt-4 mb-6">Nový kurz</h1>

      <form
        action={createCourseAction}
        className="bg-white border rounded-xl p-6 space-y-4"
      >
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1.5">
            Názov *
          </label>
          <input
            id="title"
            name="title"
            required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1.5">
            Popis
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-1.5">
            Stav
          </label>
          <select
            id="status"
            name="status"
            defaultValue="draft"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          >
            <option value="draft">Draft</option>
            <option value="published">Publikovaný</option>
          </select>
        </div>
        <Button type="submit">Vytvoriť kurz</Button>
      </form>
    </div>
  );
}
