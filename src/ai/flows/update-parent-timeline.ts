'use server';

/**
 * @fileOverview An AI flow to update a parent's daily checklist based on natural language.
 *
 * - updateParentTimeline - A function that modifies the timeline based on a prompt.
 * - UpdateParentTimelineInput - The input type for the updateParentTimeline function.
 * - UpdateParentTimelineOutput - The return type for the updateParentTimeline function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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


export async function updateParentTimeline(input: UpdateParentTimelineInput): Promise<UpdateParentTimelineOutput> {
  return updateParentTimelineFlow(input);
}


const updateTimelinePrompt = ai.definePrompt({
    name: 'updateTimelinePrompt',
    input: { schema: UpdateParentTimelineInputSchema },
    output: { schema: UpdateParentTimelineOutputSchema },
    prompt: `You are an AI assistant helping a parent manage their baby's daily checklist.
The parent has provided a command to modify their current list of tasks.
Your job is to interpret the command and return the new, updated list of tasks.

Current tasks:
{{#each currentTasks}}
- {{text}} (id: {{id}}, completed: {{completed}})
{{/each}}

Parent's command: "{{prompt}}"

Instructions:
1.  Read the parent's command carefully.
2.  Modify the list of tasks based on the command.
    -   If adding a task, create a new task object. Use a new unique ID (e.g., the current timestamp or a random large number).
    -   If removing a task, delete it from the list.
    -   If updating a task (e.g., marking it as done), change the 'completed' status.
    -   If the command is unclear, return the original list of tasks without modification.
3.  The order of tasks can be changed if implied by the prompt (e.g., "move nap to after feeding").
4.  Return the entire new list of tasks in the 'updatedTasks' field of the JSON output. Do not add conversational text, just the structured JSON.

New list of tasks:
`
});


const updateParentTimelineFlow = ai.defineFlow(
    {
        name: 'updateParentTimelineFlow',
        inputSchema: UpdateParentTimelineInputSchema,
        outputSchema: UpdateParentTimelineOutputSchema
    },
    async (input) => {
        const { output } = await updateTimelinePrompt(input);
        return output!;
    }
);
