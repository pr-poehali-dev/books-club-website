import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    '''
    Принимает предложения книг месяца от читателей (POST) и отдаёт список предложений (GET)
    '''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    }

    dsn = os.environ['DATABASE_URL']
    schema = os.environ['MAIN_DB_SCHEMA']

    conn = psycopg2.connect(dsn)
    try:
        cur = conn.cursor()

        if method == 'GET':
            cur.execute(
                f"SELECT id, title, author, comment, created_at FROM {schema}.book_suggestions ORDER BY created_at DESC"
            )
            rows = cur.fetchall()
            suggestions = [
                {
                    'id': r[0],
                    'title': r[1],
                    'author': r[2],
                    'comment': r[3],
                    'created_at': r[4].isoformat()
                }
                for r in rows
            ]
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'suggestions': suggestions})
            }

        if method == 'POST':
            body = json.loads(event.get('body') or '{}')
            title = (body.get('title') or '').strip()
            author = (body.get('author') or '').strip()
            comment = (body.get('comment') or '').strip()

            if not title:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Название книги обязательно'})
                }

            cur.execute(
                f"INSERT INTO {schema}.book_suggestions (title, author, comment) VALUES (%s, %s, %s) RETURNING id, created_at",
                (title, author or None, comment or None)
            )
            row = cur.fetchone()
            conn.commit()

            return {
                'statusCode': 201,
                'headers': headers,
                'body': json.dumps({
                    'id': row[0],
                    'title': title,
                    'author': author,
                    'comment': comment,
                    'created_at': row[1].isoformat()
                })
            }

        return {
            'statusCode': 405,
            'headers': headers,
            'body': json.dumps({'error': 'Метод не поддерживается'})
        }
    finally:
        conn.close()
