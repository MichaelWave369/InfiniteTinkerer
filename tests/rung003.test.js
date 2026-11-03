import {test} from 'node:test';
import assert from 'node:assert/strict';
import {COIN_SLOTS,DEFAULT_COIN,normalizeCoinVault,getCoinSource,validCoinDataUrl} from '../coin-vault.js';
import {BACKUP_SCHEMA,createBackup,parseBackup,slotSummaries,nextTestSlot,sufficientSamples,metricsCsv,cleanState} from '../content-lab-plus.js';

test('coin vault defaults safely and recognizes two portrait slots',()=>{
 assert.deepEqual(COIN_SLOTS,['classic','fibonacci']);
 assert.equal(getCoinSource({active:'fibonacci',fibonacci:'invalid'}),DEFAULT_COIN);
 assert.equal(normalizeCoinVault({active:'classic',classic:'javascript:alert(1)'}).active,'default');
 assert.equal(validCoinDataUrl('data:image/webp;base64,'+'A'.repeat(200)),true);
 assert.equal(validCoinDataUrl('data:image/svg+xml;base64,'+'A'.repeat(200)),false);
});
test('backup roundtrip keeps real milestones and normalizes external data',()=>{
 const state={projectName:'The Quarter',done:[true,false,true],groups:[{id:'1',name:'Retro',url:'https://facebook.com/groups/a',rulesChecked:true}],
  drafts:[{id:'2',content:'Original idea',date:'2026-11-02'}],logs:[{slot:'Evening',views:2000,earnings:4,date:'2026-11-02'}]};
 const b=createBackup(state,{},'2026-11-02T20:00:00Z');
 assert.equal(b.schema,BACKUP_SCHEMA);
 const restored=parseBackup(JSON.stringify(b));
 assert.equal(restored.state.done.length,18);
 assert.equal(restored.state.done[2],true);
 assert.equal(restored.state.logs[0].views,2000);
 assert.equal(restored.state.groups[0].rulesChecked,true);
 assert.equal(restored.coins.active,'default');
});
test('bad backup cannot silently replace data',()=>{
 assert.throws(()=>parseBackup('{}'));
 assert.throws(()=>parseBackup('not JSON'));
 assert.throws(()=>parseBackup({schema:BACKUP_SCHEMA,data:{state:null,coins:null}}));
});
test('one malformed monetization entry does not spoil useful metrics',()=>{
 const rows=slotSummaries([
  {slot:'Morning',views:1000,earnings:2},{slot:'Morning',views:-10,earnings:2},
  {slot:'Evening',views:2000,earnings:8},{slot:'Unknown',views:2000,earnings:1}
 ]);
 assert.equal(rows[0].count,1);
 assert.equal(rows[0].rate,2);
 assert.equal(rows[1].rate,null);
 assert.equal(rows[2].rate,4);
 assert.equal(nextTestSlot([{slot:'Morning',views:10,earnings:.01}]),'Midday');
 assert.equal(sufficientSamples([]),false);
});
test('all three windows require enough samples before any comparison',()=>{
 const logs=['Morning','Midday','Evening'].flatMap(slot=>Array.from({length:3},()=>({slot,views:400,earnings:.4})));
 assert.equal(sufficientSamples(logs),true);
 assert.equal(nextTestSlot(logs),'Morning');
});
test('CSV quotes hostile inputs without formulas executing in spreadsheet cells',()=>{
 const csv=metricsCsv([{date:'2026-11-02',slot:'Morning',views:100,earnings:1.2,note:'hello, "world"'}]);
 assert.match(csv,/"hello, ""world"""/);
 assert.match(csv,/100/);
 const cleaned=cleanState({groups:[{url:'javascript:alert(1)'}]});
 assert.equal(cleaned.groups[0].url,'');
});
