import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app.database.session import engine, Base
from app.models.user import User
from app.models.category import Category
from app.models.faq import FAQ
from app.models.ticket import Ticket
from app.models.ticket_note import TicketNote
from app.models.attachment import Attachment
from app.models.discussion import Discussion, DiscussionReply

print("Dropping all tables...")
Base.metadata.drop_all(bind=engine)
print("All tables dropped successfully.")

print("Creating all tables...")
Base.metadata.create_all(bind=engine)
print("All tables created successfully.")