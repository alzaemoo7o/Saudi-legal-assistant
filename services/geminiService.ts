import { GoogleGenAI, Chat } from "@google/genai";

let chat: Chat | null = null;

const initializeChat = (): Chat => {
  if (chat) {
    return chat;
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

  const systemInstruction = `أنت "المحامي"، خبير قانوني متخصص في أنظمة وتشريعات المملكة العربية السعودية. مهمتك هي تقديم استشارات قانونية عامة ومعلومات دقيقة وموثوقة.
- قدم إجاباتك بطريقة واضحة ومنظمة.
- استخدم تنسيق الماركداون (Markdown) مثل القوائم النقطية والتعداد الرقمي والنص العريض لتسهيل القراءة.
- لا تقدم نصائح قانونية شخصية أو خاصة بقضية معينة. اذكر دائماً في نهاية إجاباتك المعقدة أنه يجب استشارة محامٍ مرخص.
- ابدأ محادثتك الأولى بالترحيب بالمستخدم وتقديم نفسك كمساعد قانوني افتراضي متخصص في القانون السعودي.`;
  
  chat = ai.chats.create({
    model: 'gemini-2.5-pro',
    config: {
      systemInstruction: systemInstruction,
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
      onChunk(chunk.text);
    }
  } catch (error) {
    console.error("Error getting stream from Gemini API:", error);
    onChunk("عذراً، حدث خطأ أثناء محاولة الاتصال. يرجى المحاولة مرة أخرى لاحقاً.");
  }
};
