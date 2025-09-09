import { getEquipmentTypeById } from '@/lib/equipment-types'

interface EquipmentTypeBadgeProps {
  equipmentId: string
  size?: 'sm' | 'md' | 'lg'
}

export default function EquipmentTypeBadge({ equipmentId, size = 'md' }: EquipmentTypeBadgeProps) {
  const equipment = getEquipmentTypeById(equipmentId)
  
  if (!equipment) return null

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  }

  return (
    <span className={`inline-flex items-center bg-primary-100 text-primary-800 rounded-full font-medium ${sizeClasses[size]}`}>
      <span className="mr-1">{equipment.icon}</span>
      {equipment.name}
    </span>
  )
}

interface EquipmentTypeListProps {
  equipmentIds: string[]
  size?: 'sm' | 'md' | 'lg'
  maxDisplay?: number
}

export function EquipmentTypeList({ equipmentIds, size = 'sm', maxDisplay = 3 }: EquipmentTypeListProps) {
  const displayIds = equipmentIds.slice(0, maxDisplay)
  const remainingCount = equipmentIds.length - maxDisplay

  return (
    <div className="flex flex-wrap gap-1">
      {displayIds.map((id) => (
        <EquipmentTypeBadge key={id} equipmentId={id} size={size} />
      ))}
      {remainingCount > 0 && (
        <span className={`inline-flex items-center bg-gray-100 text-gray-600 rounded-full font-medium ${size === 'sm' ? 'text-xs px-2 py-1' : size === 'md' ? 'text-sm px-3 py-1.5' : 'text-base px-4 py-2'}`}>
          +{remainingCount} more
        </span>
      )}
    </div>
  )
}
