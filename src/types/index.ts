export interface Contact {
  id: string
  name: string
  email: string
  phone: string
  company: string
  position: string
  status: ContactStatus
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export type ContactStatus = 'lead' | 'prospect' | 'customer'

export interface Deal {
  id: string
  title: string
  description?: string
  value: number
  probability: number
  stage: DealStage
  contactId: string
  contact?: Contact
  expectedCloseDate?: Date
  createdAt: Date
  updatedAt: Date
}

export type DealStage = 'prospecting' | 'qualified' | 'proposal' | 'negotiation' | 'closed'

export interface Activity {
  id: string
  title: string
  description?: string
  type: ActivityType
  status: ActivityStatus
  dueDate: Date
  contactId?: string
  dealId?: string
  contact?: Contact
  deal?: Deal
  createdAt: Date
  updatedAt: Date
}

export type ActivityType = 'call' | 'email' | 'meeting' | 'task' | 'demo'
export type ActivityStatus = 'scheduled' | 'completed' | 'cancelled' | 'overdue'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface DashboardMetrics {
  totalContacts: number
  totalDeals: number
  totalRevenue: number
  totalActivities: number
  pipelineValue: number
  conversionRate: number
}

export interface ApiResponse<T> {
  data: T
  message?: string
  error?: string
}