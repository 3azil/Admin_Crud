import psycopg2
from psycopg2 import sql


DB_PARAMS = {
    'host': 'localhost',
    'database': 'admin_db',
    'user': 'postgres',
    'password': '20032003',
    'port': 5432 
}

def get_all_workers():
    try:
        conn = psycopg2.connect(**DB_PARAMS)
        c = conn.cursor()
        c.execute('SELECT * FROM workers_tb')
        rows = c.fetchall()
        conn.close()

        if not rows:
            print("Таблица пустая или данных нет.")
        else:
            print("Существующие данные:")
            for row in rows:
                print(row)

        return [dict(id=row[0], name=row[1], email=row[2], job=row[3], rate=row[4], isactive=bool(row[5])) for row in rows]
    
    except Exception as e:
        print(f"Ошибка при получении данных: {e}")

def add_worker(data):
    try:
        conn = psycopg2.connect(**DB_PARAMS)
        c = conn.cursor()
        c.execute('''
            INSERT INTO workers_tb (name, email, job, rate, isactive) 
            VALUES (%s, %s, %s, %s, %s) RETURNING id
        ''', (data['name'], data['email'], data['job'], data['rate'], data['isactive']))
        worker_id = c.fetchone()[0]
        conn.commit()
        conn.close()
        data['id'] = worker_id
        return data

    except Exception as e:
        print(f"Ошибка при добавлении работника: {e}")

def update_worker(worker_id, data):
    required_fields = ['name', 'email', 'job', 'rate', 'isactive']

    for field in required_fields:
        if field not in data:
            raise ValueError(f"Отсутствует обязательное поле: {field}")

    try:
        conn = psycopg2.connect(**DB_PARAMS)
        c = conn.cursor()
        c.execute('''
            UPDATE workers_tb
            SET name = %s, email = %s, job = %s, rate = %s, isactive = %s
            WHERE id = %s
        ''', (data['name'], data['email'], data['job'], data['rate'], data['isactive'], worker_id))
        conn.commit()
        conn.close()
        data['id'] = worker_id
        return data

    except Exception as e:
        print(f"Ошибка при обновлении работника: {e}")

def delete_worker(worker_id):
    try:
        conn = psycopg2.connect(**DB_PARAMS)
        c = conn.cursor()
        c.execute('DELETE FROM workers_tb WHERE id = %s', (worker_id,))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Ошибка при удалении работника: {e}")

