import os
import shutil
import zipfile
import json
import subprocess
import time
import sys

print("=== 1. Copying static files into standalone ===")
src_static = os.path.abspath('apps/web/.next/static')
dst_static = os.path.abspath('apps/web/.next/standalone/apps/web/.next/static')

if os.path.exists(dst_static):
    shutil.rmtree(dst_static)
shutil.copytree(src_static, dst_static)
print(f"Copied {src_static} -> {dst_static}")

# Copy public images as well
src_public = os.path.abspath('apps/web/public')
dst_public = os.path.abspath('apps/web/.next/standalone/apps/web/public')
if os.path.exists(src_public):
    if os.path.exists(dst_public):
        shutil.rmtree(dst_public)
    shutil.copytree(src_public, dst_public)
    print(f"Copied {src_public} -> {dst_public}")

print("\n=== 2. Creating deploy-static.zip for public_html/_next ===")
if os.path.exists('deploy-static.zip'):
    os.remove('deploy-static.zip')

with zipfile.ZipFile('deploy-static.zip', 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(src_static):
        for f in files:
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, os.path.dirname(src_static)) # static/...
            zipf.write(full_path, rel_path)

print(f"Created deploy-static.zip ({os.path.getsize('deploy-static.zip')} bytes)")

print("\n=== 3. Creating deploy-images.zip for public_html/images ===")
if os.path.exists('deploy-images.zip'):
    os.remove('deploy-images.zip')

images_dir = os.path.abspath('apps/web/public/images')
with zipfile.ZipFile('deploy-images.zip', 'w', zipfile.ZIP_DEFLATED) as zipf:
    for f in os.listdir(images_dir):
        if f.endswith('.webp'):
            full_path = os.path.join(images_dir, f)
            zipf.write(full_path, f)

print(f"Created deploy-images.zip ({os.path.getsize('deploy-images.zip')} bytes)")

print("\n=== 4. Creating deploy-update.zip (EXCLUDING data/ to protect all live orders) ===")
if os.path.exists('deploy-update.zip'):
    os.remove('deploy-update.zip')

standalone_web = os.path.abspath('apps/web/.next/standalone/apps/web')
with zipfile.ZipFile('deploy-update.zip', 'w', zipfile.ZIP_DEFLATED) as zipf:
    # 1. Add .next
    next_dir = os.path.join(standalone_web, '.next')
    for root, dirs, files in os.walk(next_dir):
        for f in files:
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, standalone_web)
            zipf.write(full_path, rel_path)
    
    # 2. Add server.js
    server_js = os.path.join(standalone_web, 'server.js')
    if os.path.exists(server_js):
        zipf.write(server_js, 'server.js')
        
    # 3. Add package.json
    pkg_json = os.path.join(standalone_web, 'package.json')
    if os.path.exists(pkg_json):
        zipf.write(pkg_json, 'package.json')

    # 4. Add .env
    env_file = os.path.join(standalone_web, '.env')
    if os.path.exists(env_file):
        zipf.write(env_file, '.env')

    # 5. Add public (with webp images)
    public_dir = os.path.join(standalone_web, 'public')
    if os.path.exists(public_dir):
        for root, dirs, files in os.walk(public_dir):
            for f in files:
                full_path = os.path.join(root, f)
                rel_path = os.path.relpath(full_path, standalone_web)
                zipf.write(full_path, rel_path)

    # NOTICE: data directory is INTENTIONALLY NOT INCLUDED.
    # The server's live data directory (/home/jawatama/jawatamart/apps/web/data)
    # remains 100% intact with all 23+ live orders!

print(f"Created deploy-update.zip ({os.path.getsize('deploy-update.zip')} bytes)")

print("\n=== 5. Uploading and deploying to cPanel ===")
with open('login.json', 'r') as f:
    login_data = json.load(f)
token = login_data['security_token']
print(f"Using cPanel token: {token}")

# A. Upload deploy-static.zip to /home/jawatama/public_html/_next
print("\n[A] Uploading deploy-static.zip to /home/jawatama/public_html/_next...")
upload_res = subprocess.run([
    'curl.exe', '-k', '-b', 'cookies.txt',
    f"https://151.158.44.214:2083{token}/execute/Fileman/upload_files",
    '-F', 'dir=/home/jawatama/public_html/_next',
    '-F', 'overwrite=1',
    '-F', 'file-1=@deploy-static.zip;filename=deploy-static.zip'
], capture_output=True)
print("Static upload response:", upload_res.stdout.decode('utf-8', errors='ignore')[:200])

print("[A] Extracting deploy-static.zip...")
extract_res = subprocess.run([
    'curl.exe', '-k', '-s', '-b', 'cookies.txt',
    f"https://151.158.44.214:2083{token}/json-api/cpanel?cpanel_jsonapi_user=jawatama&cpanel_jsonapi_apiversion=2&cpanel_jsonapi_module=Fileman&cpanel_jsonapi_func=fileop&op=extract&sourcefiles=public_html/_next/deploy-static.zip&destfiles=/home/jawatama/public_html/_next"
], capture_output=True)
print("Static extract response:", extract_res.stdout.decode('utf-8', errors='ignore')[:200])

print("[A] Deleting deploy-static.zip from server...")
subprocess.run([
    'curl.exe', '-k', '-s', '-b', 'cookies.txt',
    f"https://151.158.44.214:2083{token}/json-api/cpanel?cpanel_jsonapi_user=jawatama&cpanel_jsonapi_apiversion=2&cpanel_jsonapi_module=Fileman&cpanel_jsonapi_func=fileop&op=unlink&sourcefiles=public_html/_next/deploy-static.zip"
], capture_output=True)

# B. Upload deploy-images.zip to /home/jawatama/public_html/images
print("\n[B] Uploading deploy-images.zip to /home/jawatama/public_html/images...")
upload_img = subprocess.run([
    'curl.exe', '-k', '-b', 'cookies.txt',
    f"https://151.158.44.214:2083{token}/execute/Fileman/upload_files",
    '-F', 'dir=/home/jawatama/public_html/images',
    '-F', 'overwrite=1',
    '-F', 'file-1=@deploy-images.zip;filename=deploy-images.zip'
], capture_output=True)
print("Images upload response:", upload_img.stdout.decode('utf-8', errors='ignore')[:200])

print("[B] Extracting deploy-images.zip...")
extract_img = subprocess.run([
    'curl.exe', '-k', '-s', '-b', 'cookies.txt',
    f"https://151.158.44.214:2083{token}/json-api/cpanel?cpanel_jsonapi_user=jawatama&cpanel_jsonapi_apiversion=2&cpanel_jsonapi_module=Fileman&cpanel_jsonapi_func=fileop&op=extract&sourcefiles=public_html/images/deploy-images.zip&destfiles=/home/jawatama/public_html/images"
], capture_output=True)
print("Images extract response:", extract_img.stdout.decode('utf-8', errors='ignore')[:200])

print("[B] Deleting deploy-images.zip from server...")
subprocess.run([
    'curl.exe', '-k', '-s', '-b', 'cookies.txt',
    f"https://151.158.44.214:2083{token}/json-api/cpanel?cpanel_jsonapi_user=jawatama&cpanel_jsonapi_apiversion=2&cpanel_jsonapi_module=Fileman&cpanel_jsonapi_func=fileop&op=unlink&sourcefiles=public_html/images/deploy-images.zip"
], capture_output=True)

# C. Upload deploy-update.zip to /home/jawatama/jawatamart/apps/web
print("\n[C] Uploading deploy-update.zip to /home/jawatama/jawatamart/apps/web...")
upload_app = subprocess.run([
    'curl.exe', '-k', '-b', 'cookies.txt',
    f"https://151.158.44.214:2083{token}/execute/Fileman/upload_files",
    '-F', 'dir=/home/jawatama/jawatamart/apps/web',
    '-F', 'overwrite=1',
    '-F', 'file-1=@deploy-update.zip;filename=deploy-update.zip'
], capture_output=True)
print("App upload response:", upload_app.stdout.decode('utf-8', errors='ignore')[:200])

print("[C] Extracting deploy-update.zip...")
extract_app = subprocess.run([
    'curl.exe', '-k', '-s', '-b', 'cookies.txt',
    f"https://151.158.44.214:2083{token}/json-api/cpanel?cpanel_jsonapi_user=jawatama&cpanel_jsonapi_apiversion=2&cpanel_jsonapi_module=Fileman&cpanel_jsonapi_func=fileop&op=extract&sourcefiles=jawatamart/apps/web/deploy-update.zip&destfiles=/home/jawatama/jawatamart/apps/web"
], capture_output=True)
print("App extract response:", extract_app.stdout.decode('utf-8', errors='ignore')[:200])

print("[C] Deleting deploy-update.zip from server...")
subprocess.run([
    'curl.exe', '-k', '-s', '-b', 'cookies.txt',
    f"https://151.158.44.214:2083{token}/json-api/cpanel?cpanel_jsonapi_user=jawatama&cpanel_jsonapi_apiversion=2&cpanel_jsonapi_module=Fileman&cpanel_jsonapi_func=fileop&op=unlink&sourcefiles=jawatamart/apps/web/deploy-update.zip"
], capture_output=True)

# D. Restart passenger app
print("\n[D] Restarting Passenger Node.js app...")
ts = int(time.time())
restart_res = subprocess.run([
    'curl.exe', '-k', '-s', '-b', 'cookies.txt',
    f"https://151.158.44.214:2083{token}/execute/Fileman/save_file_content",
    '-d', f'dir=jawatamart/tmp&file=restart.txt&content=restart-{ts}'
], capture_output=True)
print("Restart response:", restart_res.stdout.decode('utf-8', errors='ignore')[:200])

print("\n=== Deployment Complete! Waiting 5s for Passenger reload... ===")
time.sleep(5)
