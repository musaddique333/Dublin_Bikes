export FLASK_ENVIRONMENT=Production
# or
export FLASK_ENVIRONMENT=Debug

echo $FLASK_ENVIRONMENT


echo $FLASK_ENVIRONMENT

DUBLIN_BIKES/
│
├── data/
│   ├── availability_data/
│   ├── stations_data/
│   └── weather_data/
├── keys/
├── website/
│   ├── static/
│   │   ├── css/
│   │   │   ├── home.css
│   │   │   └── index.css
│   │   ├── img/
│   │   │   └── background_images/
│   │   │       └── background.webp
│   │   └── js/
│   │       └── home.js
│   ├── templates/
│   │   ├── layouts/
│   │   │   └── base.html
│   │   ├── home.html
│   │   └── index.html
│   ├── __init__.py
│   ├── fetcher.py
│   ├── models.py
│   ├── routes.py
│   └── scrapper.py
├── .gitignore
├── app.py
├── conda_packages.txt
├── config.py
├── environment.yml
├── README.md
├── requirements.txt
├── test.ipynb
└── test.py
