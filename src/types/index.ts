export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'admin' | 'manager' | 'sales'
  createdAt: string
  updatedAt: string
}

export interface Contact {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  position?: string
  avatar?: string
  tags?: string[]
  status: 'active' | 'inactive' | 'lead'
  assignedTo?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Deal {
  id: string
  title: string
  value: number
  currency: string
  stage: DealStage
  probability: number
  contactId: string
  contact?: Contact
  assignedTo?: string
  assignedUser?: User
  description?: string
  expectedCloseDate?: string
  actualCloseDate?: string
  tags?: string[]
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface DealStage {
  id: string
  name: string
  position: number
  color: string
  isDefault?: boolean
}

export interface Activity {
  id: string
  title: string
  description?: string
  type: ActivityType
  status: 'scheduled' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  startDate: string
  endDate?: string
  contactId?: string
  contact?: Contact
  dealId?: string
  deal?: Deal
  assignedTo?: string
  assignedUser?: User
  location?: string
  attendees?: string[]
  reminders?: ActivityReminder[]
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface ActivityType {
  id: string
  name: string
  icon: string
  color: string
}

export interface ActivityReminder {
  id: string
  minutes: number
  type: 'email' | 'notification'
  sent: boolean
}

export interface DashboardStats {
  totalContacts: number
  totalDeals: number
  totalRevenue: number
  monthlyRevenue: number
  conversionRate: number
  averageDealValue: number
  activitiesThisWeek: number
  dealsClosedThisMonth: number
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string[]
    borderColor?: string
    borderWidth?: number
  }[]
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Auth types
export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
  refreshToken: string
}

// Filter and search types
export interface ContactFilters {
  search?: string
  status?: string
  assignedTo?: string
  company?: string
  tags?: string[]
}

export interface DealFilters {
  search?: string
  stage?: string
  assignedTo?: string
  minValue?: number
  maxValue?: number
  dateRange?: {
    start: string
    end: string
  }
}

export interface ActivityFilters {
  search?: string
  type?: string
  status?: string
  assignedTo?: string
  dateRange?: {
    start: string
    end: string
  }
}
