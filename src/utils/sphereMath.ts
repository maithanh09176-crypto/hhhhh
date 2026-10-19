export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface ProjectedPoint {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  zIndex: number;
}

export interface WishItem {
  id: string;
  text: string;
  fullMessage?: string;
  emoji: string;
  colorScheme: 'cyan' | 'pink' | 'emerald' | 'gold' | 'rose';
}

export const ANH_THANH_WISHES: WishItem[] = [
  {
    id: '1',
    text: 'Chúc em 20/10 ngập tràn nụ cười',
    fullMessage: 'Chúc em ngày 20/10 luôn ngập tràn niềm vui, nụ cười rạng rỡ và một ngày thật nhiều điều bất ngờ hạnh phúc!',
    emoji: '🌸',
    colorScheme: 'pink',
  },
  {
    id: '2',
    text: 'Dù ở xa xôi, lòng Anh luôn bên em',
    fullMessage: 'Khoảng cách địa lý có thể xa, nhưng từng suy nghĩ và nhịp đập con tim Anh Thành lúc nào cũng hướng về em.',
    emoji: '✨',
    colorScheme: 'cyan',
  },
  {
    id: '3',
    text: 'Luôn rạng rỡ hồn nhiên nha em',
    fullMessage: 'Hãy luôn giữ nét hồn nhiên, đáng yêu và sự tươi tắn như lúc nào cũng là cô gái hạnh phúc nhất trần đời nhé.',
    emoji: '🥰',
    colorScheme: 'rose',
  },
  {
    id: '4',
    text: 'Bớt thức khuya, nhớ ăn uống đủ bữa',
    fullMessage: 'Anh không ở gần để nhắc em mỗi bữa, nên em nhớ tự thương mình, đừng bỏ bữa và đừng thức khuya xem điện thoại nhiều nha!',
    emoji: '🌙',
    colorScheme: 'emerald',
  },
  {
    id: '5',
    text: 'Mong sớm đến ngày được gặp nhau',
    fullMessage: 'Anh mong ngày gần nhất có thể chạy đến bên em, tự tay trao em một cái ôm ấm áp sau chuỗi ngày nhớ nhung.',
    emoji: '🛵',
    colorScheme: 'gold',
  },
  {
    id: '6',
    text: 'Em là điều dịu dàng nhất của anh',
    fullMessage: 'Trong thế giới ồn ào này, sự xuất hiện của em chính là điều dịu dàng và bình yên nhất trong lòng Anh Thành.',
    emoji: '💖',
    colorScheme: 'pink',
  },
  {
    id: '7',
    text: 'Phương xa luôn có anh dõi theo',
    fullMessage: 'Bất kể ngày nắng hay ngày mưa, ở phương xa này luôn có một người dõi theo, cổ vũ và lắng nghe em.',
    emoji: '💌',
    colorScheme: 'cyan',
  },
  {
    id: '8',
    text: 'Chúc em một đời an yên, hạnh phúc',
    fullMessage: 'Mong cuộc đời đối xử thật dịu dàng với em, mọi điều ước đều thành sự thật và bình an bên em mỗi sớm mai.',
    emoji: '🍀',
    colorScheme: 'emerald',
  },
  {
    id: '9',
    text: 'Gửi ngàn đóa hoa thơm ngát đến em',
    fullMessage: 'Gửi đến em ngàn đóa hoa hồng thắm từ tận đáy lòng, chúc em luôn xinh đẹp, kiêu sa như đóa hoa rực rỡ nhất.',
    emoji: '💐',
    colorScheme: 'rose',
  },
  {
    id: '10',
    text: 'Cảm ơn em đã đến bên đời anh',
    fullMessage: 'Cảm ơn em đã cho anh cơ hội được trò chuyện, được quan tâm và trao gửi những cảm xúc chân thành nhất.',
    emoji: '⭐',
    colorScheme: 'gold',
  },
  {
    id: '11',
    text: 'Đừng lo, luôn có Anh Thành ở đây',
    fullMessage: 'Bất cứ khi nào mệt mỏi hay cần một chỗ dựa tinh thần, hãy nhớ Anh Thành luôn sẵn sàng lắng nghe em mọi lúc.',
    emoji: '🛡️',
    colorScheme: 'cyan',
  },
  {
    id: '12',
    text: 'Em mãi là cô gái tuyệt vời nhất',
    fullMessage: 'Tự tin lên nha em, trong mắt Anh Thành, em lúc nào cũng là cô gái đặc biệt và tuyệt vời nhất!',
    emoji: '👑',
    colorScheme: 'pink',
  },
];

/**
 * Distributes N points evenly on a 3D sphere using Fibonacci golden spiral
 */
export function generateFibonacciSphere(count: number, radius: number): Point3D[] {
  if (count <= 0) return [];
  if (count === 1) return [{ x: 0, y: 0, z: radius }];

  const points: Point3D[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle (~2.3999 rad)

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2; // Goes from 1 to -1
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = phi * i;

    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;

    points.push({
      x: x * radius,
      y: y * radius,
      z: z * radius,
    });
  }

  return points;
}

/**
 * Rotates a 3D point around X and Y axes
 */
export function rotatePoint3D(point: Point3D, angleX: number, angleY: number): Point3D {
  // Rotate around Y axis
  const cosY = Math.cos(angleY);
  const sinY = Math.sin(angleY);
  const x1 = point.x * cosY + point.z * sinY;
  const z1 = -point.x * sinY + point.z * cosY;

  // Rotate around X axis
  const cosX = Math.cos(angleX);
  const sinX = Math.sin(angleX);
  const y2 = point.y * cosX - z1 * sinX;
  const z2 = point.y * sinX + z1 * cosX;

  return {
    x: x1,
    y: y2,
    z: z2,
  };
}

/**
 * Projects a 3D point onto a 2D screen with perspective and depth shading
 */
export function project3DTo2D(
  point: Point3D,
  radius: number,
  focalLength = 420
): ProjectedPoint {
  // point.z goes from -radius (far) to +radius (near)
  const zDistance = focalLength - point.z;
  const scale = Math.max(0.48, Math.min(1.28, focalLength / (zDistance || 1)));

  // Opacity: closest points are 1.0, furthest points are ~0.45
  const normalizedZ = (point.z + radius) / (2 * radius || 1);
  const opacity = Math.max(0.4, Math.min(1.0, 0.4 + normalizedZ * 0.6));

  // Z-index from 10 to 1000
  const zIndex = Math.floor(normalizedZ * 900) + 10;

  return {
    x: point.x * scale,
    y: point.y * scale,
    scale,
    opacity,
    zIndex,
  };
}

/**
 * Applies friction/damping to rotational velocity
 */
export function applyVelocityDamping(velocity: number, damping = 0.95): number {
  if (Math.abs(velocity) < 0.00005) return 0;
  return velocity * damping;
}
