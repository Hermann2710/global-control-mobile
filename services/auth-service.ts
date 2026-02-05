import api from "@/lib/api";
import {
  authData,
  ForgotPasswordData,
  LoginSchemaType,
  sendOtpData,
  VerifyOtptype,
} from "@/schemas/auth-schema";
import {
  createApiResponseSchema,
  defaultResponseSchema,
} from "@/schemas/response-schema";
import z from "zod";

const authResponseSchema = createApiResponseSchema(authData);

type AuthType = z.infer<typeof authResponseSchema>;

const otpResponseSchema = createApiResponseSchema(sendOtpData);

type OtpResponseType = z.infer<typeof otpResponseSchema>;

const verifyOtpResponseSchema = createApiResponseSchema(sendOtpData);

type VerifyOtpType = z.infer<typeof verifyOtpResponseSchema>;

class AuthService {
  async login(data: LoginSchemaType): Promise<AuthType> {
    const response = await api.post("/auth/login", data);
    return authResponseSchema.parse(response.data);
  }

  async sendOtp(data: ForgotPasswordData): Promise<OtpResponseType> {
    const response = await api.post("/auth/send-otp-code", data);
    return defaultResponseSchema.parse(response.data);
  }

  async verifyOtp(data: VerifyOtptype): Promise<VerifyOtpType> {
    const response = await api.post("/auth/verify-otp-code", data);
    return verifyOtpResponseSchema.parse(response.data);
  }

  async checkAuthentication(): Promise<AuthType> {
    const response = await api.get("/auth/check-authentication");
    return authResponseSchema.parse(response.data);
  }
}

export default new AuthService();
