export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'manager' | 'sales'
  created_at: string
  updated_at: string
}

export interface Contact {
  id: string
  name: string
  email: string
  phone: string
  company: string
  position: string
  status: 'lead' | 'prospect' | 'customer'
  notes: string
  avatar?: string
  created_at: string
  updated_at: string
}

export interface Deal {
  id: string
  name: string
  value: number
  contact_id: string
  contact?: Contact
  stage: 'prospecting' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost'
  close_date: string
  probability: number
  notes: string
  created_at: string
  updated_at: string
}

export interface Activity {
  id: string
  title: string
  type: 'call' | 'email' | 'meeting' | 'task' | 'demo'
  contact_id?: string
  contact?: Contact
  deal_id?: string
  deal?: Deal
  date: string
  status: 'scheduled' | 'completed' | 'cancelled'
  description: string
  created_at: string
  updated_at: string
}

export interface DashboardMetrics {
  totalContacts: number
  totalDeals: number
  totalRevenue: number
  totalActivities: number
  revenueGrowth: number
  contactsGrowth: number
  activitiesGrowth: number
  dealsGrowth: number
}

export interface PipelineData {
  stage: string
  count: number
  value: number
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface ApiError {
  message: string
  code?: string | number
  details?: any
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
  expiresIn: number
}

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface ContactFormData {
  name: string
  email: string
  phone: string
  company: string
  position: string
  status: Contact['status']
  notes: string
}

export interface DealFormData {
  name: string
  value: number
  contact_id: string
  stage: Deal['stage']
  close_date: string
  probability: number
  notes: string
}

export interface ActivityFormData {
  title: string
  type: Activity['type']
  contact_id?: string
  deal_id?: string
  date: string
  status: Activity['status']
  description: string
}

export interface FilterOptions {
  search?: string
  status?: string
  type?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  page?: number
  perPage?: number
}

export interface NotificationOptions {
  title: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

export interface ModalOptions {
  title: string
  component?: any
  props?: Record<string, any>
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closable?: boolean
}

export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  formatter?: (value: any) => string
}