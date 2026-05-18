class FaqService:
    def __init__(self):
        # data sementara (mock data) biar frontend bisa langsung nembak API
        self.mock_faqs = [
            {
                "id": 1,
                "question": "Bagaimana cara reset password IPB Mobile?",
                "answer": "Silakan hubungi helpdesk atau gunakan fitur lupa password di aplikasi.",
                "status": "published",
                "category_id": 1,
                "view_count": 150
            },
            {
                "id": 2,
                "question": "Kapan jadwal pengisian KRS semester ini?",
                "answer": "Jadwal KRS dapat dilihat pada kalender akademik di SIMAK.",
                "status": "published",
                "category_id": 2,
                "view_count": 320
            }
        ]

    def list_public(self, category_id: int | None, search: str | None, skip: int, limit: int):
        # nanti pas pake PostgreSQL, logikanya diganti di sini
        # for now, langsung return data palsu di atas
        return self.mock_faqs

    def popular(self):
        return self.mock_faqs

    def bump_popular(self, faq_id: int):
        return True

    def list_admin(self, category_id, status, search, skip, limit):
        return self.mock_faqs

    def create(self, role, payload):
        # biarin pass dulu
        pass

    def update(self, role, faq_id, payload):
        pass
