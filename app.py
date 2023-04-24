import os
from flask import Flask, request, jsonify, render_template
from genie import get_chatgpt_response

app = Flask(__name__)

current_model = "gpt-3.5-turbo"


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/chatgpt", methods=["POST"])
def chatgpt():
    messages = request.json.get("messages", [])
    if not messages:
        return jsonify({"error": "Missing messages"}), 400

    response_text = get_chatgpt_response(current_model, messages)

    return jsonify({"output": response_text})


@app.route("/static/main.js")
def serve_js():
    return app.send_static_file("main.js")


@app.route("/api/set_model", methods=["POST"])
def set_model():
    global current_model
    new_model = request.json.get("model", None)
    if new_model:
        current_model = new_model
        return jsonify({"status": "Model changed"}), 200
    return jsonify({"error": "No model specified"}), 400


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=6565)
