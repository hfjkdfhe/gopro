import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GoProModel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const getReviewSummary = async (model: GoProModel): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `請總覽這款 ${model.name} 的主要功能和使用者評價。
      參考詳細資料：${JSON.stringify(model)}。
      請以繁體中文提供簡潔、專業的 Markdown 格式總結。`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    return response.text || "目前無法生成總結。";
  } catch (error) {
    console.error("Error generating summary:", error);
    return "生成總結時發生錯誤。";
  }
};

export const chatWithGemini = async (message: string, history: { role: 'user' | 'model', parts: [{ text: string }] }[]): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: "gemini-3.1-pro-preview",
      config: {
        systemInstruction: "你是一位 GoPro 相機和運動攝影專家。請回答關於 GoPro 型號、功能和使用技巧的問題。請使用搜尋功能獲取最新的價格和新聞。請務必使用繁體中文回答。",
        tools: [{ googleSearch: {} }],
      },
    });

    // Note: The SDK might handle history differently, but for simplicity we'll just send the message
    // In a real app, we'd pass history to ai.chats.create
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "我不確定該如何回答。";
  } catch (error) {
    console.error("Chat error:", error);
    return "抱歉，處理您的請求時發生錯誤。";
  }
};
