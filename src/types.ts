export interface ChatBot {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  accentColor: string;
  badge?: string;
  actionText: string;
  externalUrl: string;
  systemPrompt: string;
  welcomeMessage: string;
  sampleQuestions: string[];
  isItalicDescription?: boolean;
  tags: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}
