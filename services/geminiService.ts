import { GoogleGenAI, Chat } from "@google/genai";

let chat: Chat | null = null;

const initializeChat = (): Chat => {
  if (chat) {
    return chat;
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

  const systemInstruction = `أنت "المحامي"، مستشار قانوني ذكي متخصص في الأنظمة والتشريعات السعودية.
دورك هو تبسيط المعلومات القانونية للمواطنين والمقيمين.
- استشهد دائمًا بالأنظمة السعودية الرسمية (مثل نظام العمل، نظام الشركات، الأحوال الشخصية).
- استخدم تنسيق Markdown بذكاء: استخدم الخط العريض (**نص**) للعناوين أو النقاط المهمة، والقوائم النقطية (-) للتعداد.
- كن مهذباً، محترفاً، ومختصراً.
- تنبيه هام: في نهاية كل استشارة معقدة، ذكّر المستخدم بأن هذه المعلومات للأغراض التثقيفية ولا تغني عن استشارة محامٍ مرخص أمام المحاكم.`;
  
  chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.4, // Lower temperature for more factual/consistent legal answers
      topK: 40,
    },
  });
  
  return chat;
};


export const sendMessageStream = async (
  message: string,
  onChunk: (chunk: string) => void
) => {
  try {
    const chatSession = initializeChat();
    const stream = await chatSession.sendMessageStream({ message });
    for await (const chunk of stream) {
      if (chunk.text) {
        onChunk(chunk.text);
      }
    }
  } catch (error) {
    console.error("Error getting stream from Gemini API:", error);
    onChunk("\n\n**عذراً، حدث خطأ في الاتصال.** يرجى التحقق من الإنترنت والمحاولة مرة أخرى.");
  }
};