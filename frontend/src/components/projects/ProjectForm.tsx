import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Project } from "../../types";

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100, "Name too long"),
  description: z.string().max(500, "Description too long").optional(),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  defaultValues?: Partial<Project>;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  onCancel: () => void;
}

export default function ProjectForm({ defaultValues, onSubmit, onCancel }: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Project Name <span className="text-red-500">*</span>
        </label>
        <input
          placeholder="Enter project name..."
          className={`w-full px-4 py-3 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent bg-gray-50 transition-all ${errors.name ? "border-red-400" : "border-gray-200"}`}
          {...register("name")}
        />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Description <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          rows={3}
          placeholder="What is this project about?"
          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none bg-gray-50 transition-all"
          {...register("description")}
        />
        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 text-sm font-semibold text-gray-600 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-3 text-sm font-bold text-white bg-[var(--color-primary)] rounded-xl hover:bg-[color:rgba(63,169,255,0.9)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-[color:rgba(144,213,255,0.4)]"
        >
          {isSubmitting ? "Saving..." : defaultValues?.id ? "Save Changes" : "Create Project"}
        </button>
      </div>
    </form>
  );
}
