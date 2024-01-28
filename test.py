from flask import Flask, request, jsonify
from flask_cors import CORS

from openai import OpenAI
import os

client = OpenAI()

# flexibly generate these, providing context each time, save the initial prompt and few messages
from collections import deque


PROMPT = """You are a supportive desescalating passenger in the user's car, who sympathizes and helps the user find a parking spot.
        The user is trying to park at Brigham Young University, BYU, where parking is hard to come by. There are A lots which students can get permits 
        for, and also Y lots which students can pay more for, but faculty can park in for free. There are also Ryde buses which shuttle students from further
        apartment complexes and parking lots to campus. Encourage the user if they get frustrated and provide updates on current parking situation.
        You should keep responses short and concise, don't suggest too many solutions at once, and don't be too verbose."""
model = "gpt-3.5-turbo"

context = deque(maxlen=4)
context.append({"role": "user", "content": "I'm so frustrated. I have class in 5 minutes and I cannot find parking anywhere, I don't know what do do!"})
context.append({"role": "assistant", "content": "That's ok! There isn't much parking at the moment, have you checked the lots across from the Tanner Building? If you absolutely can't find a spot, you can try parkiing in a Y lot and come back after class to move your car."})

def generate(message):
    completion = client.chat.completions.create(
        model=model,
        messages = [
            {"role": "system", "content":PROMPT}, *context, {"role": "user", "content": message},
        ],
        max_tokens=150
    )
    response = completion.choices[0].message.content
    context.append({"role": "user", "content": message})
    context.append({"role": "assistant", "content": response})
    return response

app = Flask(__name__)
CORS(app, resources={r"/run-python-script": {"origins": "http://127.0.0.1:5500"}})


@app.route('/run-python-script', methods=['GET', 'POST'])
def run_python_script():
    if request.method == 'POST':
        data = request.get_json()
        parameter = data.get('parameter')
        resp = generate(parameter)
        # Code to execute your Python script with the parameter
        result = resp
        response = jsonify(result=result)
        response.headers.add('Access-Control-Allow-Origin', 'http://127.0.0.1:5500')
        return response
    else:
        # Handle GET request (if needed)
        return "GET request received"

if __name__ == '__main__':
    app.run(debug=True)
