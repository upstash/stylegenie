# Use the official Python image from the Docker Hub
FROM python:3.11.7-slim

ENV PYTHONUNBUFFERED True

ENV LANG=C.UTF-8

ENV PYTHONIOENCODING=utf-8

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install the required Python packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire current directory into the container at /app
COPY . .

# Expose port 80 to the outside world
EXPOSE 80

# Run the FastAPI application with uvicorn when the container launches
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
