import api from "@/lib/api";
import {
  authData,
  ForgotPasswordData,
  LoginSchemaType,
} from "@/schemas/auth-schema";
import {
  createApiResponseSchema,
  defaultResponseSchema,
} from "@/schemas/response-schema";
import z from "zod";

const authResponseSchema = createApiResponseSchema(authData);

type AuthType = z.infer<typeof authResponseSchema>;

class AuthService {
  async login(data: LoginSchemaType): Promise<AuthType> {
    const response = await api.post("/auth/login", data);
    return authResponseSchema.parse(response.data);
  }

  async sendOtp(data: ForgotPasswordData) {
    const response = await api.post("/auth/send-otp-code", data);
    return defaultResponseSchema.parse(response.data);
  }
}

export default new AuthService();
