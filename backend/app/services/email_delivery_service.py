"""Optional SMTP email delivery."""

import logging

import aiosmtplib
from email.message import EmailMessage

from app.core.config import get_settings

logger = logging.getLogger(__name__)


class EmailDeliveryService:
    """Sends transactional email when SMTP is configured; otherwise logs."""

    async def send(self, to_email: str, subject: str, body: str) -> None:
        settings = get_settings()
        if not settings.smtp_host:
            logger.info("Email (dev): to=%s subject=%s", to_email, subject)
            return
        message = EmailMessage()
        message["From"] = settings.smtp_from
        message["To"] = to_email
        message["Subject"] = subject
        message.set_content(body)
        await aiosmtplib.send(
            message,
            hostname=settings.smtp_host,
            port=settings.smtp_port,
            username=settings.smtp_user or None,
            password=settings.smtp_password or None,
            start_tls=True,
        )
