const PAL = { k: '#0b1c30', w: '#ffffff', y: '#f59e0b', Y: '#ffe7a3', b: '#2d6197', B: '#92c1fe', r: '#ef4444', p: '#ff9388', g: '#10b981', n: '#b98558', N: '#e8c9a0', o: '#fb923c' }

const TARSEE = [
  '..nn....nn..', '.npn....npn.', '.nnnnnnnnnn.', 'nnnnnnnnnnnn', 'nwwwwnnwwwwn', 'nwkkwnnwkkwn',
  'nwkkwnnwkkwn', 'nnwwnnnnwwnn', 'nnnNNNNNNnnn', 'nnnNNkkNNnnn', '.nnNNNNNNnn.', '..nn....nn..',
]
export const TARSEE_LAYERS = [{ g: TARSEE, x: 2, y: 3 }]
const on = (g, x, y) => [...TARSEE_LAYERS, { g, x, y }]

export const BADGE_LAYERS = {
  b_jeepney: on(['ybbybbybbyyy', 'yykkyyyykkyy'], 2, 14),
  b_sampaguita: on(['.w....w.', 'wYw..wYw', '.w.ww.w.'], 4, 0),
  b_parol: on(['...yy...', 'yyyyyyyy', '.yyrryy.'], 4, 0),
  b_bangka: on(['nn........nn', 'nnnnnnnnnnnn'], 2, 14),
  b_sinulog: on(['r.o.g.b.', 'rryyggbb', 'oooooooo'], 4, 0),
  b_bayani: on(['y..yy..y', 'yy.yy.yy', 'yyyrryyy'], 4, 0),
}

export default function Pixel({ layers = TARSEE_LAYERS, size = 64, gray = false, className = '' }) {
  const rects = []
  layers.forEach(({ g, x, y }) => g.forEach((row, j) => [...row].forEach((c, i) => {
    if (PAL[c]) rects.push(<rect key={rects.length} x={x + i} y={y + j} width="1" height="1" fill={PAL[c]} />)
  })))
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} shapeRendering="crispEdges" className={className} style={gray ? { filter: 'grayscale(1) brightness(.6) opacity(.55)' } : undefined}>
      {rects}
    </svg>
  )
}
