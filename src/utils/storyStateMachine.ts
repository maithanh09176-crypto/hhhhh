export type StoryPhase =
  | 'sleep'         // 0: này em
  | 'wake'          // 1: tớ là Tiny
  | 'order'         // 2: Hôm nay tớ nhận lệnh từ Anh Thành là để...
  | 'blush'         // 3: ui cậu đẹp quá
  | 'oct20'         // 4: à thì cũng sắp 20/10 rồi
  | 'want'          // 5: nên là tớ muốn
  | 'health'        // 6: chúc cậu thật nhiều sức khỏe
  | 'beauty'        // 7: chúc cậu thật xinh đẹp
  | 'smile'         // 8: và chúc cậu luôn giữ nụ cười trên môi
  | 'clover_intro'  // 9: tớ tặng cậu ngọn cỏ 4 lá này
  | 'clover_gift'   // 10: nè cầm lấy đi
  | 'question'      // 11: liệu em có thể?
  | 'accepted'      // 12: Trang cuối: Lời chúc từ Anh Thành
  | 'wishes_3d';    // 13: Sau trang này: Hiệu ứng 3D Floating Text ngân hà lời chúc

export interface StoryConfig {
  recipientName: string;
  senderName: string;
  questionText: string;
  secretMessage: string;
}

export const DEFAULT_CONFIG: StoryConfig = {
  recipientName: 'em',
  senderName: 'Anh Thành',
  questionText: 'cho Anh Thành cơ hội được chăm sóc, quan tâm em mỗi ngày dù ở xa không?',
  secretMessage: `Tuy khoảng cách giữa chúng mình có xa xôi, hôm nay anh không thể ở bên cạnh hay tự tay trao tặng em một bó hoa thật đẹp... Nhưng anh muốn em biết rằng, trong lòng anh, em luôn là điều dịu dàng và đặc biệt nhất.

Chúc em ngày 20/10 ngập tràn niềm vui, luôn cười thật tươi và luôn bình an. Hãy luôn nhớ rằng ở phương xa này luôn có Anh Thành dõi theo, quan tâm và thương em rất nhiều nhé! 🥰💖`,
};

export const STORY_SEQUENCE: StoryPhase[] = [
  'sleep',
  'wake',
  'order',
  'blush',
  'oct20',
  'want',
  'health',
  'beauty',
  'smile',
  'clover_intro',
  'clover_gift',
  'question',
  'accepted',
  'wishes_3d',
];

export function getStoryText(phase: StoryPhase, config: StoryConfig = DEFAULT_CONFIG): string {
  switch (phase) {
    case 'sleep':
      return `này ${config.recipientName || 'em'}`;
    case 'wake':
      return 'tớ là Tiny';
    case 'order':
      return `Hôm nay tớ nhận lệnh từ ${config.senderName || 'Anh Thành'} là để...`;
    case 'blush':
      return 'ui cậu đẹp quá';
    case 'oct20':
      return 'à thì cũng sắp 20/10 rồi';
    case 'want':
      return 'nên là tớ muốn';
    case 'health':
      return 'chúc cậu thật nhiều sức khỏe';
    case 'beauty':
      return 'chúc cậu thật xinh đẹp';
    case 'smile':
      return 'và chúc cậu luôn giữ nụ cười trên môi';
    case 'clover_intro':
      return 'tớ tặng cậu ngọn cỏ 4 lá này';
    case 'clover_gift':
      return 'nè cầm lấy đi';
    case 'question':
      return 'liệu cậu có thể?';
    case 'accepted':
      return 'Gửi trọn yêu thương từ phương xa! 💌💖';
    case 'wishes_3d':
      return `những lời chúc từ ${config.senderName || 'Anh Thành'} gửi đến ${config.recipientName || 'em'}`;
  }
}

export function getNextPhase(current: StoryPhase): StoryPhase {
  const currentIndex = STORY_SEQUENCE.indexOf(current);
  if (currentIndex < 0 || currentIndex >= STORY_SEQUENCE.length - 1) {
    return current;
  }
  return STORY_SEQUENCE[currentIndex + 1];
}

export interface LyricCue {
  time: number;
  text: string;
}

export const DEFAULT_LYRIC_CUES: LyricCue[] = [
  { time: 0.0, text: 'chỉ biết nói cho em' },
  { time: 1.7, text: 'nghe vậy thôi' },
  { time: 3.4, text: 'vì đã lỡ yêu em rồi' },
  { time: 6.3, text: 'chẳng dám hứa xa xôi' },
  { time: 9.7, text: 'người ta nói chẳng ai hiểu' },
  { time: 13.1, text: 'về hai tiếng thương yêu' },
  { time: 16.0, text: 'chẳng phải cứ bên nhau' },
  { time: 18.1, text: 'làm nhau khổ đau là tình yêu?' },
  { time: 22.8, text: 'nhiều khi rất yêu nhau mà' },
  { time: 26.0, text: 'phải đứng ở rất xa' },
  { time: 29.4, text: 'nhìn em hạnh phúc bên ai chẳng phải mình' },
  { time: 33.4, text: 'vì mình có làm được đâu' },
  { time: 35.7, text: 'nhường ai khác bên em là' },
  { time: 38.5, text: 'nhường đi hết tất cả' },
  { time: 42.0, text: 'yêu em chẳng khiến em được vui' },
  { time: 44.9, text: 'thế nên anh phải xa' },
  { time: 48.7, text: 'càng yêu chỉ thêm thất vọng' },
  { time: 51.8, text: 'càng tan nát cõi lòng' },
  { time: 55.0, text: 'không được như mong' },
];

export function findActiveLyricCue(currentTime: number, cues: LyricCue[] = DEFAULT_LYRIC_CUES): LyricCue | null {
  if (currentTime < 0 || cues.length === 0) return null;
  let activeCue: LyricCue | null = null;
  for (let i = 0; i < cues.length; i++) {
    if (currentTime >= cues[i].time) {
      activeCue = cues[i];
    } else {
      break;
    }
  }
  return activeCue;
}

export function parseCustomConfig(search: string): StoryConfig {
  const params = new URLSearchParams(search);
  return {
    recipientName: params.get('to') || params.get('name') || DEFAULT_CONFIG.recipientName,
    senderName: params.get('from') || params.get('sender') || DEFAULT_CONFIG.senderName,
    questionText: params.get('q') || params.get('question') || DEFAULT_CONFIG.questionText,
    secretMessage: params.get('msg') || params.get('message') || DEFAULT_CONFIG.secretMessage,
  };
}

export function calculateEscapePosition(
  buttonWidth = 140,
  buttonHeight = 48,
  containerWidth = 360,
  containerHeight = 200
): { x: number; y: number } {
  const maxX = Math.max(20, containerWidth - buttonWidth - 20);
  const maxY = Math.max(20, containerHeight - buttonHeight - 20);
  const x = Math.floor(Math.random() * maxX);
  const y = Math.floor(Math.random() * maxY);
  return { x, y };
}
