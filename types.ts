export interface MemeContent {
  caption: string;
  imagePrompt: string;
  humorExplanation?: string;
}

export interface GeneratedMeme {
  id: string;
  content: MemeContent;
  imageUrl: string;
  timestamp: number;
}

export enum LoadingStage {
  IDLE = 'IDLE',
  GENERATING_JOKE = 'GENERATING_JOKE',
  GENERATING_IMAGE = 'GENERATING_IMAGE',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}