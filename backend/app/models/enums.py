import enum

class UserRole(str, enum.Enum):
    mahasiswa = "mahasiswa"
    staff = "staff"
    admin = "admin"

class FaqStatus(str, enum.Enum):
    draft = "draft"
    published = "published"
    archived = "archived"

class TicketStatus(str, enum.Enum):
    open = "Open"
    in_progress = "In Progress"
    resolved = "Resolved"

class TicketPriority(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"