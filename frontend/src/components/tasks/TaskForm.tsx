import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, type TaskFormData } from "../../lib/validations";
import type { Task } from "../../types";

interface TaskFormProps {
  defaultValues?: Partial<Task>;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel: () => void;
}

const STATUS_OPTIONS = [
  { value: "TODO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "DONE", label: "Done" },
] as const;

const PRIORITY_OPTIONS = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "URGENT", label: "Urgent" },
] as const;

const STATUS_ACTIVE: Record<string, string> = {
  TODO: "bg-blue-600 text-white border-blue-600",
  IN_PROGRESS: "bg-yellow-500 text-white border-yellow-500",
  DONE: "bg-green-500 text-white border-green-500",
};

const PRIORITY_ACTIVE: Record<string, string> = {
  LOW: "bg-gray-500 text-white border-gray-500",
  MEDIUM: "bg-yellow-500 text-white border-yellow-500",
  HIGH: "bg-orange-500 text-white border-orange-500",
  URGENT: "bg-red-500 text-white border-red-500",
};

export default function TaskForm({ defaultValues, onSubmit, onCancel }: TaskFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
      status: defaultValues?.status ?? "TODO",
      priority: defaultValues?.priority ?? "MEDIUM",
      dueDate: defaultValues?.dueDate
        ? new Date(defaultValues.dueDate).toISOString().split("T")[0]
        : "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Task Title <span className="text-red-500">*</span>
        </label>
        <input
          placeholder="Enter task title..."
          className={`w-full px-4 py-3 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 ${errors.title ? "border-red-400" : "border-gray-200"}`}
          {...register("title")}
        />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Description <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          rows={3}
          placeholder="Optional description..."
          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-gray-50 transition-all"
          {...register("description")}
        />
      </div>

      {/* Status toggle */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <div className="flex gap-2">
              {STATUS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => field.onChange(opt.value)}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-xl border-2 transition-all ${
                    field.value === opt.value
                      ? STATUS_ACTIVE[opt.value]
                      : "border-gray-200 text-gray-500 hover:border-gray-300 bg-white"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        />
      </div>

      {/* Priority toggle */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <div className="flex gap-2">
              {PRIORITY_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => field.onChange(opt.value)}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-xl border-2 transition-all ${
                    field.value === opt.value
                      ? PRIORITY_ACTIVE[opt.value]
                      : "border-gray-200 text-gray-500 hover:border-gray-300 bg-white"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        />
      </div>

      {/* Due Date */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Due Date</label>
        <input
          type="date"
          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all"
          {...register("dueDate")}
        />
        {errors.dueDate && <p className="mt-1 text-xs text-red-500">{errors.dueDate.message}</p>}
      </div>

      {/* Actions */}
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
          className="flex-1 py-3 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
        >
          {isSubmitting ? "Saving..." : defaultValues?.id ? "Save Changes" : "Create Task"}
        </button>
      </div>
    </form>
  );
}
