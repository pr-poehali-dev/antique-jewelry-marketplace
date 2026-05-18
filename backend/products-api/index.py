import os
import json
import psycopg2
from psycopg2.extras import RealDictCursor


CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
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
    headers = event.get('headers') or {}
    body = json.loads(event.get('body') or '{}')

    # GET — список всех товаров (публичный), сортировка по sort_order
    if method == 'GET':
        conn = get_conn()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute('SELECT * FROM products ORDER BY sort_order, id')
        products = [dict(r) for r in cur.fetchall()]
        cur.close()
        conn.close()
        return json_response(products)

    # Все остальные методы — только для админа
    if not check_admin(headers):
        return json_response({'error': 'Неверный пароль'}, 403)

    # POST — создать товар
    if method == 'POST':
        images = body.get('images', [])
        main_image = images[0] if images else body.get('image', '')
        conn = get_conn()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute('SELECT COALESCE(MAX(sort_order), 0) + 1 FROM products')
        next_order = cur.fetchone()['coalesce']
        cur.execute(
            'INSERT INTO products (name, price, image, category, era, description, sort_order, images, video_url) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING *',
            (body['name'], body['price'], main_image, body.get('category', ''), body.get('era', ''), body.get('description', ''), next_order, images, body.get('video_url', ''))
        )
        product = dict(cur.fetchone())
        conn.commit()
        cur.close()
        conn.close()
        return json_response(product, 201)

    # PUT — обновить товар
    if method == 'PUT':
        product_id = body.get('id')
        images = body.get('images', [])
        main_image = images[0] if images else body.get('image', '')
        conn = get_conn()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute(
            'UPDATE products SET name=%s, price=%s, image=%s, category=%s, era=%s, description=%s, images=%s, video_url=%s WHERE id=%s RETURNING *',
            (body['name'], body['price'], main_image, body.get('category', ''), body.get('era', ''), body.get('description', ''), images, body.get('video_url', ''), product_id)
        )
        product = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        if not product:
            return json_response({'error': 'Товар не найден'}, 404)
        return json_response(dict(product))

    # PATCH — обновить порядок (принимает список [{id, sort_order}])
    if method == 'PATCH':
        order_list = body.get('order', [])
        conn = get_conn()
        cur = conn.cursor()
        for item in order_list:
            cur.execute('UPDATE products SET sort_order=%s WHERE id=%s', (item['sort_order'], item['id']))
        conn.commit()
        cur.close()
        conn.close()
        return json_response({'success': True})

    # DELETE — удалить товар
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