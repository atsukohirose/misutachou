export type PropertyStatus = 'pending' | 'published' | 'rejected'

export interface Property {
  id: string
  title: string
  description: string
  lat: number
  lng: number
  event_date: string
  image_url: string | null
  status: PropertyStatus
  created_by: string | null
  created_at: string
}

export interface PropertyComment {
  id: string
  property_id: string
  author_name: string
  body: string
  created_at: string
}

export interface BoardThread {
  id: string
  title: string
  created_at: string
}

export interface BoardReply {
  id: string
  thread_id: string
  author_name: string
  body: string
  created_at: string
}

export interface NewsItem {
  id: string
  type: 'news' | 'info'
  title: string
  body: string | null
  published_at: string
}
