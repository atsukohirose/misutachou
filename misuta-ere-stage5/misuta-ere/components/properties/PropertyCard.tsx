import Link from 'next/link'
import type { Property } from '@/lib/types'

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <Link
      href={`/properties/${property.id}`}
      className="flex gap-3 bg-white border border-neutral-200 rounded-sm p-3 hover:border-red-300 hover:bg-red-50/30 transition-colors"
    >
      <div className="w-20 h-20 flex-shrink-0 bg-neutral-100 rounded-sm overflow-hidden flex items-center justify-center">
        {property.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={property.image_url}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-neutral-300 text-xs">No Image</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-neutral-800 truncate">{property.title}</p>
        <p className="text-[11px] text-neutral-400 mb-1">{property.event_date}</p>
        <p className="text-xs text-neutral-500 line-clamp-2">{property.description}</p>
      </div>
    </Link>
  )
}
