import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
};

// Добавляем структуру для хранения стартапов для сравнения
interface ComparisonState {
  startups: number[];
  founders: number[];
}

type ChatState = {
  messages: Message[];
  sessionId: string;
  isLoading: boolean;
  shouldScroll: boolean;
  comparison: ComparisonState;
  inputText: string; // Добавляем новое поле для хранения текста ввода
  
  // Действия
  addMessage: (content: string, role: "user" | "assistant", id?: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setShouldScroll: (shouldScroll: boolean) => void;
  clearMessages: () => void;
  setInputText: (text: string) => void; // Новая функция для установки текста в поле ввода
  
  // Функции для сравнения
  addToComparison: (type: "startups" | "founders", id: number) => void;
  removeFromComparison: (type: "startups" | "founders", id: number) => void;
  clearComparison: (type: "startups" | "founders") => void;
};

// Используем middleware persist для сохранения состояния в localStorage
export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [
        {
          id: "1",
          role: "assistant",
          content: "Hello! I'm an AI assistant for startup assessment. How can I help you today?",
          timestamp: new Date().toISOString(),
        },
      ],
      sessionId: uuidv4(),
      isLoading: false,
      shouldScroll: false,
      inputText: "", // Инициализируем пустой строкой
      comparison: {
        startups: [],
        founders: []
      },

      addMessage: (content, role, id) => set((state) => ({
        messages: [...state.messages, {
          id: id || uuidv4(),
          role,
          content,
          timestamp: new Date().toISOString(),
        }],
        shouldScroll: true,
      })),

      setIsLoading: (isLoading) => set({ isLoading }),

      setShouldScroll: (shouldScroll) => set({ shouldScroll }),

      // Новая функция для установки текста ввода
      setInputText: (text) => set({ inputText: text }),

      clearMessages: () => {
        // Полностью удаляем данные из localStorage
        localStorage.removeItem('ai-startup-chat-storage');
        
        // Сбрасываем состояние
        set(() => ({
          messages: [
            {
              id: "1",
              role: "assistant",
              content: "Hello! I'm an AI assistant for startup assessment. How can I help you today?",
              timestamp: new Date().toISOString(),
            },
          ],
          sessionId: uuidv4(), // Generate a new session ID
          shouldScroll: true, // Ensure the chat scrolls to the new message
          inputText: "", // Reset input text
          isLoading: false, // Ensure loading state is reset
          comparison: { // Сбрасываем и данные для сравнения
            startups: [],
            founders: []
          }
        }));
      },

      // Функции сравнения
      addToComparison: (type, id) => set((state) => {
        // Проверяем, не добавлен ли уже этот ID
        if (state.comparison[type].includes(id)) {
          return state;
        }
        
        return {
          comparison: {
            ...state.comparison,
            [type]: [...state.comparison[type], id]
          }
        };
      }),

      removeFromComparison: (type, id) => set((state) => ({
        comparison: {
          ...state.comparison,
          [type]: state.comparison[type].filter(item => item !== id)
        }
      })),

      clearComparison: (type) => set((state) => ({
        comparison: {
          ...state.comparison,
          [type]: []
        }
      })),
    }),
    {
      name: 'ai-startup-chat-storage', // имя в localStorage
      partialize: (state) => ({ 
        // Сохраняем только эти поля:
        messages: state.messages,
        sessionId: state.sessionId,
        comparison: state.comparison,
      }),
    }
  )
);
