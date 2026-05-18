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
    """API для управления товарами каталога антиквариата"""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    path = event.get('path', '/')
    headers = event.get('headers') or {}
    body = json.loads(event.get('body') or '{}')

    # GET /  — список всех товаров (публичный)
    if method == 'GET':
        conn = get_conn()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute('SELECT * FROM products ORDER BY id')
        products = [dict(r) for r in cur.fetchall()]
        cur.close()
        conn.close()
        return json_response(products)

    # Все остальные методы — только для админа
    if not check_admin(headers):
        return json_response({'error': 'Неверный пароль'}, 403)

    # POST / — создать товар
    if method == 'POST':
        conn = get_conn()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute(
            'INSERT INTO products (name, price, image, category, era, description) VALUES (%s, %s, %s, %s, %s, %s) RETURNING *',
            (body['name'], body['price'], body.get('image', ''), body.get('category', ''), body.get('era', ''), body.get('description', ''))
        )
        product = dict(cur.fetchone())
        conn.commit()
        cur.close()
        conn.close()
        return json_response(product, 201)

    # PUT / — обновить товар
    if method == 'PUT':
        product_id = body.get('id')
        conn = get_conn()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute(
            'UPDATE products SET name=%s, price=%s, image=%s, category=%s, era=%s, description=%s WHERE id=%s RETURNING *',
            (body['name'], body['price'], body.get('image', ''), body.get('category', ''), body.get('era', ''), body.get('description', ''), product_id)
        )
        product = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        if not product:
            return json_response({'error': 'Товар не найден'}, 404)
        return json_response(dict(product))

    # DELETE / — удалить товар
    if method == 'DELETE':
        product_id = body.get('id')
        conn = get_conn()
        cur = conn.cursor()
        cur.execute('DELETE FROM products WHERE id=%s', (product_id,))
        conn.commit()
        cur.close()
        conn.close()
        return json_response({'success': True})

    return json_response({'error': 'Метод не поддерживается'}, 405)
