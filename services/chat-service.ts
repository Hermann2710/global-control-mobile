import api from "@/lib/api";
import { UserType } from "@/schemas/user-schema";

class ChatService {
    async getAllUsers(page: number=1, per_page: number=10) {
        const response = await api.get('/users', {
            params: {
                page,
                per_page
            }
        });
        return response.data;
    }
    
    async getConversations(userId: number | string) {
        const response = await api.get(`/chat/conversations/${userId}`);
        return response.data;
    }

    async getOrCreateConversation(sender: UserType, receiver: UserType) {
        const response = await api.post("/chat/create-conversation", {
            sender,
            receiver,
        });
        return response.data
    }

    async getConversationById(conversationId: string | number) {
        const response = await api.get(`/chat/conversation/${conversationId}`);
        return response.data;
    }

    async markAsRead(unreadIds: (string | number)[]) {
        const response = await api.patch(`/chat/update-read`, { unreadIds });
        return response.data;
    }

    async deleteMessage(messageId: string | number) {
        const response = await api.delete(`/chat/message/${messageId}`);
        return response.data;
    }

    async sendMessageWithFile(formData: FormData) {
        const response = await api.post(`/chat/send-with-file`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    }
}

export default new ChatService();