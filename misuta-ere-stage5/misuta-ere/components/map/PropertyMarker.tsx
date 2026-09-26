import L from 'leaflet'
import type { PropertyStatus } from '@/lib/types'

/**
 * 事故物件マーカー用のカスタムアイコンを生成する。
 * ステータスに応じて色味を変える（published は濃色、それ以外は基本非表示だが将来の拡張用に用意）。
 */
export function createPropertyIcon(status: PropertyStatus = 'published') {
  const color = status === 'published' ? '#7f1d1d' : '#9ca3af'

  return L.divIcon({
    className: 'misuta-property-marker',
    html: `
      <div style="
        width: 22px;
        height: 22px;
        background: ${color};
        border: 2px solid #ffffff;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 1px 3px rgba(0,0,0,0.5);
      "></div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 22],
    popupAnchor: [0, -22],
  })
}
