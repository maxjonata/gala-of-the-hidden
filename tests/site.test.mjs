import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const html = await readFile('index.html', 'utf8');

test('the public page has a title, description and responsive viewport', () => {
  assert.match(html, /<title>Gala of the Hidden/);
  assert.match(html, /name="description"/);
  assert.match(html, /name="viewport"/);
});

test('all local page assets exist and use project-safe relative URLs', async () => {
  const refs = [...html.matchAll(/(?:href|src)="([^"#][^"]*)"/g)].map(([, ref]) => ref);
  for (const ref of refs.filter((value) => !value.startsWith('https://') && !value.startsWith('mailto:'))) {
    assert.ok(!ref.startsWith('/'), `root-relative URL breaks project Pages: ${ref}`);
    await access(ref.split(/[?#]/, 1)[0]);
  }
});

test('page content includes the game sections and Artificial Culture project link', () => {
  for (const id of ['projeto', 'jogo', 'npc', 'sistemas', 'producao', 'arquivo']) assert.match(html, new RegExp(`id="${id}"`));
  assert.match(html, /https:\/\/maxjonata\.github\.io\/Artificial-Culture\//);
});
