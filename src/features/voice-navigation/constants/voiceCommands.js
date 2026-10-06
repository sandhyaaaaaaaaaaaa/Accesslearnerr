export const VOICE_COMMANDS = [
  {
    patterns: [/go to dashboard/i, /open dashboard/i, /home/i],
    actionType: 'navigate',
    path: '/dashboard',
    voiceResponse: 'Opening dashboard',
  },
  {
    patterns: [/go to doubt/i, /open doubt/i, /ask a question/i, /ask question/i],
    actionType: 'navigate',
    path: '/doubts',
    voiceResponse: 'Opening doubts',
  },
  {
    patterns: [/go to quiz/i, /open quiz/i, /take a quiz/i],
    actionType: 'navigate',
    path: '/quiz',
    voiceResponse: 'Opening quiz',
  },
  {
    patterns: [/go to flashcard/i, /open flashcard/i, /study flashcard/i],
    actionType: 'navigate',
    path: '/flashcards',
    voiceResponse: 'Opening flashcards',
  },
  {
    patterns: [/go to setting/i, /open setting/i],
    actionType: 'navigate',
    path: '/settings',
    voiceResponse: 'Opening settings',
  },
  {
    patterns: [/go back/i, /previous page/i, /back/i],
    actionType: 'back',
    voiceResponse: 'Going back',
  },
  {
    patterns: [/go forward/i, /next page/i],
    actionType: 'forward',
    voiceResponse: 'Going forward',
  },
  {
    patterns: [/open gesture control/i, /go to gesture control/i],
    actionType: 'navigate',
    path: '/gesture-control',
    voiceResponse: 'Opening gesture control',
  },
  {
    patterns: [/open sign language/i, /go to sign language/i],
    actionType: 'navigate',
    path: '/sign-language',
    voiceResponse: 'Opening sign language mode',
  },
  {
    patterns: [/stop listening/i, /turn off voice/i, /disable voice/i, /stop voice control/i],
    actionType: 'stop',
    voiceResponse: 'Voice navigation deactivated',
  }
];
