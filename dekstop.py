import webview
import threading
import subprocess
import time
import os
import sys

def start_flask():
    subprocess.Popen(
        [sys.executable, "backend/app.py"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )

def start_vite():
    subprocess.Popen(
        ["npm", "run", "dev"],
        cwd="frontend",
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        shell=True
    )

def wait_for_frontend(port=5173):
    import socket
    while True:
        try:
            with socket.create_connection(("localhost", port), timeout=1):
                return
        except OSError:
            time.sleep(0.5)

if __name__ == '__main__':
    threading.Thread(target=start_flask, daemon=True).start()
    threading.Thread(target=start_vite, daemon=True).start()

    print("Ожидание запуска фронта...")
    wait_for_frontend()

    webview.create_window(
        title='Workers App',
        url='http://localhost:5173',
        width=1200,
        height=800,
        resizable=True
    )
    webview.start()
