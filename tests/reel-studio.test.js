import {test} from 'node:test';
import assert from 'node:assert/strict';
import {REEL_LENGTH,REEL_WIDTH,REEL_HEIGHT,cueAt,coinMotion,preferredMimeType} from '../reel-studio.js';

test('reel is portrait 9:16 and eight seconds long',()=>{
  assert.equal(REEL_WIDTH,540);assert.equal(REEL_HEIGHT,960);assert.equal(REEL_LENGTH,8);
});
test('all four episode arcs progress through the same four stages',()=>{
  for(const id of ['jukebox','payphone','kitchen','switchboard']){
    assert.equal(cueAt(id,0).phase,'insert');
    assert.equal(cueAt(id,2).phase,'activate');
    assert.equal(cueAt(id,5).phase,'retrieve');
    assert.equal(cueAt(id,7).phase,'end');
    assert.equal(typeof cueAt(id,2).text,'string');
  }
});
test('coin begins in hand, visits device, and returns home on string',()=>{
  const atStart=coinMotion(0),inside=coinMotion(2),returned=coinMotion(8);
  assert.equal(atStart.x,175);assert.equal(inside.x,359);
  assert.equal(returned.x,175);assert.equal(returned.radius,66);
  assert.ok(atStart.radius>inside.radius);
});
test('timeline clamps negative and excessive times',()=>{
  assert.deepEqual(coinMotion(-3),coinMotion(0));
  assert.deepEqual(coinMotion(20),coinMotion(8));
});
test('codec picker uses only browser-supported video MIME types',()=>{
  assert.equal(preferredMimeType(t=>t==='video/webm'),'video/webm');
  assert.equal(preferredMimeType(t=>t==='video/mp4'),'video/mp4');
  assert.equal(preferredMimeType(()=>false),null);
});
