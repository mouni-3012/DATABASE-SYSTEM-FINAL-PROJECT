CREATE_TABLE_QUERY = """
CREATE TABLE IF NOT EXISTS tax_payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company TEXT NOT NULL,
    amount REAL NOT NULL,
    payment_date TEXT,
    status TEXT NOT NULL,
    due_date TEXT NOT NULL
);
"""

INSERT_PAYMENT_QUERY = """
INSERT INTO tax_payments (company, amount, payment_date, status, due_date)
VALUES (?, ?, ?, ?, ?);
"""

SELECT_ALL_PAYMENTS_QUERY = """
SELECT * FROM tax_payments;
"""

UPDATE_PAYMENT_QUERY = """
UPDATE tax_payments
SET company = ?, amount = ?, payment_date = ?, status = ?, due_date = ?
WHERE id = ?;
"""

DELETE_PAYMENT_QUERY = """
DELETE FROM tax_payments WHERE id = ?;
"""
SELECT_PAYMENT_BY_ID_QUERY = """
SELECT * FROM tax_payments WHERE id = ?;
"""
