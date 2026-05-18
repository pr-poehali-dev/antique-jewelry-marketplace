import os
import json
import base64
import uuid
import boto3

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
}

def handler(event: dict, context) -> dict:
    """Загрузка фотографии товара в S3-хранилище"""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    password = (event.get('headers') or {}).get('x-admin-password', '')
    if password != os.environ.get('ADMIN_PASSWORD', ''):
        return {'statusCode': 403, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Неверный пароль'})}

    body = json.loads(event.get('body', '{}'))
    file_data = body.get('file')
    filename = body.get('filename', 'image.jpg')

    if not file_data:
        return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Нет файла'})}

    if ',' in file_data:
        content_type_part, file_data = file_data.split(',', 1)
        content_type = content_type_part.split(':')[1].split(';')[0] if ':' in content_type_part else 'image/jpeg'
    else:
        content_type = 'image/jpeg'

    image_bytes = base64.b64decode(file_data)

    ext = filename.rsplit('.', 1)[-1].lower() if '.' in filename else 'jpg'
    key = f"products/{uuid.uuid4()}.{ext}"

    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )

    s3.put_object(
        Bucket='files',
        Key=key,
        Body=image_bytes,
        ContentType=content_type,
    )

    cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/files/{key}"

    return {
        'statusCode': 200,
        'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
        'body': json.dumps({'url': cdn_url})
    }
