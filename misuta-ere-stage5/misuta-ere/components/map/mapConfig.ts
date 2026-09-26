import type { LatLngBoundsExpression } from 'leaflet'

/**
 * 架空の町のイラストマップ（public/map/misuta-town.png）を座標平面として扱うための設定。
 * TownMap（表示用）と PropertyPickerMap（投稿フォームのピン設置用）で共有する。
 *
 * 画像を差し替える場合は MAP_IMAGE_SIZE を実ピクセルサイズに合わせること。
 */
export const MAP_IMAGE_URL = '/map/misuta-town.png'
export const MAP_IMAGE_SIZE: [number, number] = [1400, 2000] // [height, width] in px
export const MAP_BOUNDS: LatLngBoundsExpression = [
  [0, 0],
  MAP_IMAGE_SIZE,
]
