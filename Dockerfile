FROM python:3.8-slim

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . .

ENV OPENAI_API_KEY ""

EXPOSE 6565

CMD gunicorn --bind 0.0.0.0:6565 app:app
