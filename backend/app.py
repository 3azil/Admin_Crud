from flask import Flask, request, jsonify
from flask_cors import CORS
from models import get_all_workers, add_worker, update_worker, delete_worker
import logging
import re

app = Flask(__name__)

cors = CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

app.config['DEBUG'] = True
app.logger.setLevel(logging.DEBUG)

@app.route('/api/workers', methods=['GET'])
def get_workers():
    try:
        workers = get_all_workers()
        return jsonify(workers), 200
    except Exception as e:
        app.logger.error(f"Ошибка при получении работников: {e}")
        return jsonify({"error": "Ошибка при получении работников"}), 500

@app.route('/api/workers', methods=['POST'])
def create_worker():
    try:
        data = request.json

        required_fields = ['name', 'email', 'rate']
        for field in required_fields:
            if field not in data or data[field] == '':
                return jsonify({'error': f'Поле {field} обязательно'}), 400

        email_pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
        if not re.match(email_pattern, data['email']):
            return jsonify({'error': 'Неверный формат email'}), 400

        existing_emails = [worker['email'] for worker in get_all_workers()]
        if data['email'] in existing_emails:
            return jsonify({'error': 'Email уже существует'}), 400

        try:
            rate = int(data['rate'])
            if rate < 0 or rate > 100:
                return jsonify({'error': 'Рейтинг (rate) должен быть от 0 до 100'}), 400
        except ValueError:
            return jsonify({'error': 'Рейтинг (rate) должен быть числом'}), 400

        new_worker = add_worker(data)
        return jsonify(new_worker), 201

    except Exception as e:
        app.logger.error(f"Ошибка при добавлении работника: {e}")
        return jsonify({"error": "Ошибка при добавлении работника"}), 500

@app.route('/api/workers/<int:worker_id>', methods=['PUT'])
def modify_worker(worker_id):
    try:
        data = request.json
        updated_worker = update_worker(worker_id, data)
        return jsonify(updated_worker), 200
    except Exception as e:
        app.logger.error(f"Ошибка при обновлении работника {worker_id}: {e}")
        return jsonify({"error": "Ошибка при обновлении работника"}), 500

@app.route('/api/workers/<int:worker_id>', methods=['DELETE'])
def remove_worker(worker_id):
    try:
        delete_worker(worker_id)
        return '', 204
    except Exception as e:
        app.logger.error(f"Ошибка при удалении работника {worker_id}: {e}")
        return jsonify({"error": "Ошибка при удалении работника"}), 500

if __name__ == '__main__':
    app.run(debug=True)
