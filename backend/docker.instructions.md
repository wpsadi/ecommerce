# Deployment Instructions


## Docker Deployment
For running the backend locally, follow these steps: \
1. Ensure you have [Docker](https://www.docker.com/) installed on your machine.
2. Clone the repository to your local machine.
3. Navigate to the `backend` directory in your terminal.
4. Create a `.env` file in the `backend` directory and populate it with the necessary environment variables. You can refer to the `.env.example` file for guidance.
5. Build the Docker image using the following command:
   ```bash
   docker build -t ecommerce-backend .
   ```
5. Run the following command to build and start the Docker containers:
   ```bash
    docker run \
    --network="host" \
    --env-file .env.development \
    -p 8000:8000 \
    ecommerce-backend
    ```

   