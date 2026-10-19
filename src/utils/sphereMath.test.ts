import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateFibonacciSphere,
  rotatePoint3D,
  project3DTo2D,
  applyVelocityDamping,
  ANH_THANH_WISHES,
} from './sphereMath.ts';

test('generateFibonacciSphere creates exact number of points bounded by radius', () => {
  const radius = 180;
  const points = generateFibonacciSphere(12, radius);
  assert.equal(points.length, 12);

  points.forEach((p) => {
    const dist = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
    assert.ok(Math.abs(dist - radius) < 0.001, `Point distance ${dist} must equal radius ${radius}`);
  });
});

test('rotatePoint3D preserves vector length', () => {
  const p = { x: 50, y: 80, z: 120 };
  const origLen = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);

  const rotated = rotatePoint3D(p, 0.45, -0.78);
  const newLen = Math.sqrt(rotated.x * rotated.x + rotated.y * rotated.y + rotated.z * rotated.z);

  assert.ok(Math.abs(origLen - newLen) < 0.001, 'Rotation must preserve vector magnitude');
});

test('project3DTo2D gives higher scale and opacity to nearer points', () => {
  const radius = 150;
  const nearPoint = { x: 0, y: 0, z: 140 }; // Near viewer
  const farPoint = { x: 0, y: 0, z: -140 }; // Far away

  const nearProj = project3DTo2D(nearPoint, radius);
  const farProj = project3DTo2D(farPoint, radius);

  assert.ok(nearProj.scale > farProj.scale, 'Near point must have larger scale than far point');
  assert.ok(nearProj.opacity > farProj.opacity, 'Near point must have higher opacity than far point');
  assert.ok(nearProj.zIndex > farProj.zIndex, 'Near point must have higher zIndex than far point');
});

test('applyVelocityDamping gracefully decays velocity to zero', () => {
  let v = 0.05;
  for (let i = 0; i < 200; i++) {
    v = applyVelocityDamping(v, 0.95);
  }
  assert.equal(v, 0);
});

test('ANH_THANH_WISHES contains meaningful long-distance wishes', () => {
  assert.ok(ANH_THANH_WISHES.length >= 8);
  assert.ok(ANH_THANH_WISHES.some((w) => w.text.includes('Anh Thành')));
});
