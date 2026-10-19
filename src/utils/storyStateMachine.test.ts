import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getStoryText,
  getNextPhase,
  findActiveLyricCue,
  parseCustomConfig,
  calculateEscapePosition,
  STORY_SEQUENCE,
  DEFAULT_CONFIG,
} from './storyStateMachine.ts';

test('story progression sequence is sequential and complete', () => {
  assert.equal(STORY_SEQUENCE[0], 'sleep');
  assert.equal(STORY_SEQUENCE[STORY_SEQUENCE.length - 1], 'wishes_3d');
  assert.equal(getNextPhase('sleep'), 'wake');
  assert.equal(getNextPhase('wake'), 'order');
  assert.equal(getNextPhase('clover_intro'), 'clover_gift');
  assert.equal(getNextPhase('clover_gift'), 'question');
  assert.equal(getNextPhase('question'), 'accepted');
  assert.equal(getNextPhase('accepted'), 'wishes_3d');
  assert.equal(getNextPhase('wishes_3d'), 'wishes_3d');
});

test('getStoryText incorporates config values appropriately', () => {
  const customConfig = {
    recipientName: 'Bé Miu',
    senderName: 'Anh Thành',
    questionText: 'cho Anh Thành cơ hội chăm sóc em nha?',
    secretMessage: 'Thương em',
  };

  assert.equal(getStoryText('sleep', customConfig), 'này Bé Miu');
  assert.equal(getStoryText('wake', customConfig), 'tớ là Tiny');
  assert.equal(getStoryText('order', customConfig), 'Hôm nay tớ nhận lệnh từ Anh Thành là để...');
  assert.equal(getStoryText('blush', customConfig), 'ui cậu đẹp quá');
  assert.equal(getStoryText('oct20', customConfig), 'à thì cũng sắp 20/10 rồi');
  assert.equal(getStoryText('clover_gift', customConfig), 'nè cầm lấy đi');
  assert.equal(getStoryText('question', customConfig), 'liệu cậu có thể?');
  assert.equal(getStoryText('accepted', customConfig), 'Gửi trọn yêu thương từ phương xa! 💌💖');
});

test('findActiveLyricCue matches lyrics by song time', () => {
  assert.equal(findActiveLyricCue(0.5)?.text, 'chỉ biết nói cho em');
  assert.equal(findActiveLyricCue(2.0)?.text, 'nghe vậy thôi');
  assert.equal(findActiveLyricCue(4.0)?.text, 'vì đã lỡ yêu em rồi');
  assert.equal(findActiveLyricCue(-1), null);
});

test('parseCustomConfig parses URL query params cleanly', () => {
  const query = '?to=Em+B%C3%A9&from=Anh+Th%C3%A0nh&q=Cho+anh+c%C6%A1+h%E1%BB%99i';
  const config = parseCustomConfig(query);
  assert.equal(config.recipientName, 'Em Bé');
  assert.equal(config.senderName, 'Anh Thành');
  assert.equal(config.questionText, 'Cho anh cơ hội');
  assert.equal(config.secretMessage, DEFAULT_CONFIG.secretMessage);
});

test('calculateEscapePosition stays within boundaries', () => {
  for (let i = 0; i < 20; i++) {
    const pos = calculateEscapePosition(100, 40, 400, 300);
    assert.ok(pos.x >= 0 && pos.x <= 280, `x ${pos.x} should be within [0, 280]`);
    assert.ok(pos.y >= 0 && pos.y <= 240, `y ${pos.y} should be within [0, 240]`);
  }
});
