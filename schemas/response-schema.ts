import { z } from "zod";

export const createApiResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T
) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    code: z.number(),
    data: dataSchema,
  });

export type ApiResponseType<T extends z.ZodTypeAny> = z.infer<
  ReturnType<typeof createApiResponseSchema<T>>
>;

export const defaultResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  code: z.number(),
  data: z.any(),
});

export type DefaultResponseType = z.infer<typeof defaultResponseSchema>;
