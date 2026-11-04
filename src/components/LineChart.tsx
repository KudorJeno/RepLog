import { Fragment, useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Line, Polyline, Text as SvgText } from 'react-native-svg';
import { useTheme } from '@/state/theme';

export interface Point {
  x: number; // timestamp
  y: number;
}

const HEIGHT = 180;
const PAD = { l: 40, r: 12, t: 12, b: 24 };

export function LineChart({ points, formatY, formatX }: { points: Point[]; formatY: (v: number) => string; formatX: (ms: number) => string }) {
  const { colors } = useTheme();
  const [width, setWidth] = useState(0);

  const ys = points.map((p) => p.y);
  const xs = points.map((p) => p.x);
  let minY = Math.min(...ys);
  let maxY = Math.max(...ys);
  if (minY === maxY) {
    minY = minY * 0.9;
    maxY = maxY * 1.1 || 1;
  }
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const plotW = Math.max(width - PAD.l - PAD.r, 1);
  const plotH = HEIGHT - PAD.t - PAD.b;
  const px = (x: number) => PAD.l + (maxX === minX ? plotW / 2 : ((x - minX) / (maxX - minX)) * plotW);
  const py = (y: number) => PAD.t + plotH - ((y - minY) / (maxY - minY)) * plotH;

  return (
    <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)} style={{ height: HEIGHT }}>
      {width > 0 && (
        <Svg width={width} height={HEIGHT}>
          {[minY, (minY + maxY) / 2, maxY].map((v, i) => (
            <Fragment key={i}>
              <Line x1={PAD.l} x2={width - PAD.r} y1={py(v)} y2={py(v)} stroke={colors.border} strokeWidth={1} />
              <SvgText x={PAD.l - 6} y={py(v) + 4} fontSize={10} fill={colors.textMuted} textAnchor="end">
                {formatY(v)}
              </SvgText>
            </Fragment>
          ))}
          <Polyline
            points={points.map((p) => `${px(p.x)},${py(p.y)}`).join(' ')}
            fill="none"
            stroke={colors.primary}
            strokeWidth={2.5}
          />
          {points.map((p, i) => (
            <Circle key={i} cx={px(p.x)} cy={py(p.y)} r={3.5} fill={colors.primary} />
          ))}
          <SvgText x={PAD.l} y={HEIGHT - 6} fontSize={10} fill={colors.textMuted} textAnchor="start">
            {formatX(minX)}
          </SvgText>
          <SvgText x={width - PAD.r} y={HEIGHT - 6} fontSize={10} fill={colors.textMuted} textAnchor="end">
            {formatX(maxX)}
          </SvgText>
        </Svg>
      )}
    </View>
  );
}
