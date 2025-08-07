
import {z} from 'zod';

const TaskSchema = z.object({
  id: z.number(),
  text: z.string(),
  completed: z.boolean(),
});

export const UpdateParentTimelineInputSchema = z.object({
  prompt: z.string().describe('The natural language command from the parent.'),
  currentTasks: z.array(TaskSchema).describe('The current list of tasks in the checklist.'),
});
export type UpdateParentTimelineInput = z.infer<typeof UpdateParentTimelineInputSchema>;

export const UpdateParentTimelineOutputSchema = z.object({
  updatedTasks: z.array(TaskSchema).describe('The modified list of tasks.'),
});
export type UpdateParentTimelineOutput = z.infer<typeof UpdateParentTimelineOutputSchema>;
