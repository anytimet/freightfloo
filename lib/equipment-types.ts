export interface EquipmentType {
  id: string
  name: string
  description: string
  icon: string
  capacity: string
  suitableFor: string[]
}

export const EQUIPMENT_TYPES: EquipmentType[] = [
  {
    id: 'dry-van',
    name: 'Dry Van',
    description: 'Enclosed trailer for general freight',
    icon: '🚛',
    capacity: 'Up to 80,000 lbs',
    suitableFor: ['General Freight', 'Electronics', 'Furniture', 'Clothing', 'Food & Beverage']
  },
  {
    id: 'flatbed',
    name: 'Flatbed',
    description: 'Open trailer for oversized or heavy cargo',
    icon: '🚚',
    capacity: 'Up to 80,000 lbs',
    suitableFor: ['Construction Materials', 'Machinery', 'Steel', 'Lumber', 'Oversized Items']
  },
  {
    id: 'reefer',
    name: 'Refrigerated',
    description: 'Temperature-controlled trailer',
    icon: '❄️',
    capacity: 'Up to 80,000 lbs',
    suitableFor: ['Food & Beverage', 'Pharmaceuticals', 'Chemicals', 'Perishables']
  },
  {
    id: 'container',
    name: 'Container',
    description: 'Intermodal container transport',
    icon: '📦',
    capacity: 'Up to 80,000 lbs',
    suitableFor: ['General Freight', 'Electronics', 'Clothing', 'International Cargo']
  },
  {
    id: 'tanker',
    name: 'Tanker',
    description: 'Liquid or gas transport',
    icon: '🛢️',
    capacity: 'Up to 80,000 lbs',
    suitableFor: ['Chemicals', 'Fuel', 'Food Products', 'Hazardous Materials']
  },
  {
    id: 'car-carrier',
    name: 'Car Carrier',
    description: 'Specialized for vehicle transport',
    icon: '🚗',
    capacity: 'Up to 10 vehicles',
    suitableFor: ['Automotive', 'Vehicles', 'Motorcycles', 'Boats']
  },
  {
    id: 'lowboy',
    name: 'Lowboy',
    description: 'Low-profile trailer for heavy equipment',
    icon: '🏗️',
    capacity: 'Up to 80,000 lbs',
    suitableFor: ['Construction Equipment', 'Heavy Machinery', 'Oversized Items']
  },
  {
    id: 'step-deck',
    name: 'Step Deck',
    description: 'Two-level trailer for tall cargo',
    icon: '📐',
    capacity: 'Up to 80,000 lbs',
    suitableFor: ['Machinery', 'Construction Materials', 'Tall Equipment']
  },
  {
    id: 'hotshot',
    name: 'Hotshot',
    description: 'Smaller truck for urgent deliveries',
    icon: '⚡',
    capacity: 'Up to 26,000 lbs',
    suitableFor: ['Urgent Deliveries', 'Small Freight', 'Time-Sensitive Cargo']
  },
  {
    id: 'box-truck',
    name: 'Box Truck',
    description: 'Small to medium freight transport',
    icon: '📦',
    capacity: 'Up to 26,000 lbs',
    suitableFor: ['Local Deliveries', 'Small Freight', 'Furniture', 'Electronics']
  }
]

export function getEquipmentTypeById(id: string): EquipmentType | undefined {
  return EQUIPMENT_TYPES.find(type => type.id === id)
}

export function getEquipmentTypesByIds(ids: string[]): EquipmentType[] {
  return EQUIPMENT_TYPES.filter(type => ids.includes(type.id))
}

export function getSuitableEquipmentTypes(cargoType: string): EquipmentType[] {
  return EQUIPMENT_TYPES.filter(type => 
    type.suitableFor.some(suitable => 
      suitable.toLowerCase().includes(cargoType.toLowerCase()) ||
      cargoType.toLowerCase().includes(suitable.toLowerCase())
    )
  )
}
