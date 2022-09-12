## Information: ##

The project is divided to 2 parts, the front-end and the back-end.
There is one folder for each, under the main FastAPI-React main folder.

Backend:
The api.py file has all the APIs required in order to cover the needs of the project.

Frontend:
The frontend contains a src folder containing the index.js, the file that indicates what the static page is going to have.
A component folder is located in the same path, containing a Header and a Bank component. The first one contains the header 
and the bank component contains all the components to present, add and delete the bank details.

## Instructions: ##
Backend: 
There is a file main.py in the backend/app path. This file indicates the port that the backend is going to run.
So as soon as you redirect to that path, just run "python main.py" to fire up the uvicorn service under app/api.py.

Frontend:
Create a virtual env: python -m venv fastapi-react
Activate the virtual environment: venv\Scripts\activate.bat
Install the requirements: 	pip install -r requirements.txt

Redirect to frontend folder and run the command "npm run start". This will run the app in dev mode to view it in the browser.