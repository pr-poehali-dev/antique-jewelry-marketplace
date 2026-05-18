import os
import json
import urllib.request
import urllib.parse


def handler(event: dict, context) -> dict:
    """Отправка заказа в Telegram-бот владельца магазина"""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    body = json.loads(event.get('body', '{}'))

    name = body.get('name', '')
    phone = body.get('phone', '')
    email = body.get('email', '')
    delivery = body.get('delivery', '')
    address = body.get('address', '')
    comment = body.get('comment', '')
    items = body.get('items', [])
    total = body.get('total', 0)

    delivery_label = 'Курьером' if delivery == 'courier' else 'Самовывоз'

    items_text = ''
    for item in items:
        items_text += f"  • {item['name']} × {item['quantity']} — {item['price'] * item['quantity']:,} ₽\n"

    message = (
        f"🛍 *Новый заказ*\n\n"
        f"👤 *Клиент:* {name}\n"
        f"📞 *Телефон:* {phone}\n"
    )

    if email:
        message += f"📧 *Email:* {email}\n"

    message += (
        f"\n📦 *Доставка:* {delivery_label}\n"
    )

    if address:
        message += f"📍 *Адрес:* {address}\n"

    if comment:
        message += f"💬 *Комментарий:* {comment}\n"

    message += f"\n🛒 *Состав заказа:*\n{items_text}"
    message += f"\n💰 *Итого: {total:,} ₽*"

    bot_token = os.environ['TELEGRAM_BOT_TOKEN'].strip()
    chat_id = os.environ['TELEGRAM_CHAT_ID'].strip()

    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = json.dumps({
        'chat_id': chat_id,
        'text': message,
        'parse_mode': 'Markdown'
    }).encode('utf-8')

    req = urllib.request.Request(
        url,
        data=payload,
        headers={'Content-Type': 'application/json'},
        method='POST'
    )

    try:
        with urllib.request.urlopen(req) as resp:
            result = json.loads(resp.read())
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': False, 'telegram_error': error_body})
        }

    if not result.get('ok'):
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Telegram API error', 'detail': result})
        }

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True})
    }