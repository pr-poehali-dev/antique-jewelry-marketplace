import os
import json
import psycopg2
from psycopg2.extras import RealDictCursor

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
}

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def json_response(data, status=200):
    return {
        'statusCode': status,
        'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
        'body': json.dumps(data, ensure_ascii=False, default=str)
    }

def check_admin(headers):
    password = headers.get('x-admin-password', '') or headers.get('X-Admin-Password', '')
    return password == os.environ.get('ADMIN_PASSWORD', '')


def handler(event: dict, context) -> dict:
    """API для управления категориями каталога"""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    headers = event.get('headers') or {}
    body = json.loads(event.get('body') or '{}')

    # GET — публичный список категорий
    if method == 'GET':
        conn = get_conn()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute('SELECT * FROM categories ORDER BY sort_order, id')
        cats = [dict(r) for r in cur.fetchall()]
        cur.close()
        conn.close()
        return json_response(cats)

    if not check_admin(headers):
        return json_response({'error': 'Неверный пароль'}, 403)

    # POST — создать категорию
    if method == 'POST':
        name = body.get('name', '').strip()
        if not name:
            return json_response({'error': 'Название обязательно'}, 400)
        conn = get_conn()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute('SELECT COALESCE(MAX(sort_order), 0) + 1 FROM categories')
        next_order = cur.fetchone()['coalesce']
        try:
            cur.execute(
                'INSERT INTO categories (name, sort_order) VALUES (%s, %s) RETURNING *',
                (name, next_order)
            )
            cat = dict(cur.fetchone())
            conn.commit()
        except Exception:
            conn.rollback()
            cur.close()
            conn.close()
            return json_response({'error': 'Категория уже существует'}, 409)
        cur.close()
        conn.close()
        return json_response(cat, 201)

    # PUT — переименовать категорию (обновляет name в products тоже)
    if method == 'PUT':
        cat_id = body.get('id')
        new_name = body.get('name', '').strip()
        if not new_name:
            return json_response({'error': 'Название обязательно'}, 400)
        conn = get_conn()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute('SELECT name FROM categories WHERE id=%s', (cat_id,))
        row = cur.fetchone()
        if not row:
            cur.close()
            conn.close()
            return json_response({'error': 'Категория не найдена'}, 404)
        old_name = row['name']
        try:
            cur.execute('UPDATE categories SET name=%s WHERE id=%s RETURNING *', (new_name, cat_id))
            cat = dict(cur.fetchone())
            cur.execute('UPDATE products SET category=%s WHERE category=%s', (new_name, old_name))
            conn.commit()
        except Exception:
            conn.rollback()
            cur.close()
            conn.close()
            return json_response({'error': 'Категория уже существует'}, 409)
        cur.close()
        conn.close()
        return json_response(cat)

    # DELETE — удалить категорию
    if method == 'DELETE':
        cat_id = body.get('id')
        conn = get_conn()
        cur = conn.cursor()
        cur.execute('DELETE FROM categories WHERE id=%s', (cat_id,))
        conn.commit()
        cur.close()
        conn.close()
        return json_response({'success': True})

    return json_response({'error': 'Метод не поддерживается'}, 405)
