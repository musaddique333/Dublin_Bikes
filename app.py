from website import createApp
from website.scrapper import init_scheduler, shutdown_scheduler
from flask import send_from_directory
import os

app = createApp()
init_scheduler(app)

@app.route('/shutdown', methods=['GET','POST'])
def shutdown():
    shutdown_scheduler(app)
    return "Scheduler shut down successfully", 200

@app.route('/favicon.ico')
def favicon():
    favicon_path = os.path.join(app.root_path, 'static', 'img', 'icons', 'favicon.ico')
    return send_from_directory(os.path.dirname(favicon_path), os.path.basename(favicon_path), mimetype='image/vnd.microsoft.icon')

if __name__ == '__main__':
    app.run()