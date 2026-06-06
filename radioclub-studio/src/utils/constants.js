export const ROLE_TEACHER = 'teacher'
export const ROLE_ANCHOR = 'anchor'
export const ROLE_EQUIPMENT_ADMIN = 'equipment_admin'

export const ROLE_MAP = {
  [ROLE_TEACHER]: '指导老师',
  [ROLE_ANCHOR]: '学生主播',
  [ROLE_EQUIPMENT_ADMIN]: '设备管理员',
}

export const MANUSCRIPT_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  REJECTED: 'rejected',
}

export const MANUSCRIPT_STATUS_MAP = {
  draft: { text: '草稿', color: 'default' },
  submitted: { text: '已提交', color: 'warning' },
  approved: { text: '已通过', color: 'success' },
  rejected: { text: '已驳回', color: 'error' },
}

export const EQUIPMENT_STATUS = {
  AVAILABLE: 'available',
  BORROWED: 'borrowed',
  MAINTENANCE: 'maintenance',
}

export const EQUIPMENT_STATUS_MAP = {
  available: { text: '可用', color: 'success' },
  borrowed: { text: '借出中', color: 'processing' },
  maintenance: { text: '维护中', color: 'warning' },
}

export const BORROW_STATUS = {
  BORROWED: 'borrowed',
  RETURNED: 'returned',
  OVERDUE: 'overdue',
}

export const BORROW_STATUS_MAP = {
  borrowed: { text: '借用中', color: 'processing' },
  returned: { text: '已归还', color: 'success' },
  overdue: { text: '已逾期', color: 'error' },
}

export const NOTICE_STATUS = {
  PENDING: 'pending',
  BROADCASTED: 'broadcasted',
  CANCELLED: 'cancelled',
}

export const NOTICE_STATUS_MAP = {
  pending: { text: '待播出', color: 'warning' },
  broadcasted: { text: '已播出', color: 'success' },
  cancelled: { text: '已取消', color: 'default' },
}

export const formatDateTime = (date) => {
  if (!date) return '-'
  const d = new Date(date)
  const pad = (n) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export const formatDate = (date) => {
  if (!date) return '-'
  const d = new Date(date)
  const pad = (n) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
