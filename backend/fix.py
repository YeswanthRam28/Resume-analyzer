from database import get_session
from models import ResumeSession, RecruiterSession

db = next(get_session())
sessions1 = db.query(ResumeSession).all()
sessions2 = db.query(RecruiterSession).all()
count = 0

for s in sessions1 + sessions2:
    if not s.file_name or 'yeswanth' not in s.file_name.lower():
        s.user_id = None
        count += 1

db.commit()
print(f'Removed user_id from {count} sessions')
