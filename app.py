from website import createApp
from website.scrapper import init_scheduler, shutdown_scheduler

app = createApp()
# init_scheduler(app)

# @app.route('/shutdown', methods=['GET','POST'])
# def shutdown():
#     shutdown_scheduler(app)
#     return "Scheduler shut down successfully", 200


if __name__ == '__main__':
    app.run()