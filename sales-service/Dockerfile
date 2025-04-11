FROM python:3.10

WORKDIR /microservice

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5500

CMD ["flask", "run", "--host=0.0.0.0", "--port=5500"]