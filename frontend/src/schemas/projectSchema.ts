import {z} from 'zod';

export const projectSchema = z.object({
    id: z.number().optional(),
    title: z.string().min(1, 'Krever tittel'),
    description: z.string().min(1, 'Krever beskrivelse'),
    createdAt: z.string().optional(),
    publishedAt: z.string().optional(),
    public: z.boolean().optional(),
    status: z.enum(['draft', 'published']).optional(),
    tags: z.array(z.string()).optional(),
});