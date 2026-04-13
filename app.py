from flask import Flask, jsonify, request, send_from_directory
import os
import platform
import sys
import webbrowser
from threading import Timer
from flask_cors import CORS

# Configuração para encontrar arquivos estáticos após o empacotamento
if getattr(sys, 'frozen', False):
    template_folder = sys._MEIPASS
    static_folder = sys._MEIPASS
else:
    template_folder = os.path.dirname(os.path.abspath(__file__))
    static_folder = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__, static_folder=static_folder, template_folder=template_folder)
CORS(app)

def get_drives():
    if platform.system() == "Windows":
        import string
        from ctypes import windll
        drives = []
        bitmask = windll.kernel32.GetLogicalDrives()
        for letter in string.ascii_uppercase:
            if bitmask & 1:
                drives.append(f"{letter}:\\")
            bitmask >>= 1
        return drives
    else:
        return ["/"]

def get_folder_size(path):
    total = 0
    try:
        for entry in os.scandir(path):
            if entry.is_file():
                total += entry.stat().st_size
            elif entry.is_dir():
                total += get_folder_size(entry.path)
    except (PermissionError, OSError):
        pass
    return total

@app.route('/api/list', methods=['GET'])
def list_directory():
    path = request.args.get('path', '')
    calc_sizes = request.args.get('calc_sizes', 'false').lower() == 'true'
    
    if not path:
        return jsonify({
            "current_path": "",
            "items": [{"name": d, "is_dir": True, "path": d, "size": 0} for d in get_drives()]
        })

    try:
        items = []
        path = os.path.abspath(path)
        
        for entry in os.scandir(path):
            try:
                is_dir = entry.is_dir()
                size = 0
                if not is_dir:
                    size = entry.stat().st_size
                elif calc_sizes:
                    size = get_folder_size(entry.path)

                items.append({
                    "name": entry.name,
                    "is_dir": is_dir,
                    "path": entry.path,
                    "size": size
                })
            except PermissionError:
                continue
                
        items.sort(key=lambda x: (not x['is_dir'], x['name'].lower()))
        
        return jsonify({
            "current_path": path,
            "parent": os.path.dirname(path) if path not in get_drives() else "",
            "items": items
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/scan', methods=['GET'])
def scan_directory():
    path = request.args.get('path', '')
    if not path:
        return jsonify({"error": "Caminho não fornecido"}), 400
    
    try:
        path = os.path.abspath(path)
        total_size = 0
        file_count = 0
        children_summary = []
        
        for entry in os.scandir(path):
            try:
                is_dir = entry.is_dir()
                size = entry.stat().st_size if not is_dir else get_folder_size(entry.path)
                children_summary.append({
                    "name": entry.name,
                    "is_dir": is_dir,
                    "size": size
                })
                total_size += size
                if not is_dir: file_count += 1
            except (PermissionError, OSError):
                continue

        children_summary.sort(key=lambda x: x['size'], reverse=True)
        
        return jsonify({
            "path": path,
            "total_size": total_size,
            "file_count": file_count,
            "children": children_summary[:10]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/organize', methods=['POST'])
def organize_directory():
    data = request.json
    path = data.get('path', '')
    if not path:
        return jsonify({"error": "Caminho não fornecido"}), 400
    
    try:
        path = os.path.abspath(path)
        categories = {
            'Imagens': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
            'Documentos': ['.pdf', '.doc', '.docx', '.txt', '.xlsx', '.pptx'],
            'Videos': ['.mp4', '.mkv', '.avi', '.mov'],
            'Audio': ['.mp3', '.wav', '.flac', '.m4a'],
            'Compactados': ['.zip', '.rar', '.7z', '.tar', '.gz'],
            'Executaveis': ['.exe', '.msi', '.bat', '.sh']
        }
        
        moved_count = 0
        for entry in os.scandir(path):
            if entry.is_file():
                _, ext = os.path.splitext(entry.name.lower())
                target_folder = 'Outros'
                
                for cat, extensions in categories.items():
                    if ext in extensions:
                        target_folder = cat
                        break
                
                target_path = os.path.join(path, target_folder)
                if not os.path.exists(target_path):
                    os.makedirs(target_path)
                
                os.rename(entry.path, os.path.join(target_path, entry.name))
                moved_count += 1
                
        return jsonify({"message": f"Organizado com sucesso! {moved_count} arquivos movidos.", "moved": moved_count})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory(app.static_folder, path)

def open_browser():
    webbrowser.open_new('http://127.0.0.1:5000/')

if __name__ == '__main__':
    print("Iniciando Nova Explorer...")
    # Abre o navegador após 1.5 segundos
    Timer(1.5, open_browser).start()
    app.run(host='127.0.0.1', port=5000, debug=False)
