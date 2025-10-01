Of course, here is the English version of the `README.md` file.

---

# Practice API Server for Streaming (SSE) and Fetch

This is a simple Node.js Express server designed for practice purposes. It provides three main endpoints: one for **Server-Sent Events (SSE)** to simulate a streaming response (like an LLM), another SSE endpoint that runs in an **infinite loop**, and one for a standard RESTful JSON response.

The project is lightweight, has minimal dependencies, and is configured for easy deployment on platforms like [Render.com](https://render.com).

---

## ✨ Key Features

- **Streaming Endpoint (`/stream`)**: Mimics a Large Language Model (LLM) response by streaming a paragraph word by word using Server-Sent Events.
- **Looping Streaming Endpoint (`/stream-loop`)**: An infinite SSE stream that continuously sends words, perfect for testing long-running connections.
- **Standard JSON Endpoint (`/api/data`)**: Returns a complete, static JSON object, typical of a standard REST API.
- **CORS Enabled**: The `cors` middleware is enabled, allowing requests from any origin, making it easy to use with frontend projects.
- **Deployment Ready**: Includes a `package.json` with a `start` script, ready for deployment on services like Render.

---

## 🛠️ Technology Stack

- **Backend**: Node.js
- **Framework**: Express.js
- **Middleware**: `cors`

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) (which includes npm) installed on your machine.

### Local Installation

1.  **Clone the repository:**

    ```sh
    git clone <your-repository-url>
    cd <repository-folder-name>
    ```

2.  **Install dependencies:**

    ```sh
    npm install
    ```

3.  **Run the server:**

    ```sh
    npm start
    ```

The server will now be running at `http://localhost:3000`.

---

## ☁️ Deploying to Render.com

Deploying this API is straightforward.

1.  **Push to GitHub:** Create a new repository on GitHub and push your project files (`index.js` and `package.json`).

2.  **Create a Web Service on Render:**

    - Log in to your Render dashboard and click **New+** \> **Web Service**.
    - Connect your GitHub account and select your repository.
    - Render will automatically detect that it's a Node.js project. Use the following settings:
      - **Name**: Choose a unique name (e.g., `practice-streaming-api`).
      - **Runtime**: `Node` (should be auto-detected).
      - **Build Command**: `npm install` (should be the default).
      - **Start Command**: `npm start` (should be the default).

3.  **Deploy:** Click **Create Web Service**. Render will build and deploy your application. Once live, you'll get a public URL.

---

## 📡 API Endpoints

Here are the details of the available endpoints.

### 1\. Root

A simple welcome message to confirm the server is running.

- **URL**: `/`
- **Method**: `GET`
- **Success Response**:
  - **Code**: 200
  - **Content**: `Practice API server is running. Try accessing /stream, /api/data, or /stream-loop`

### 2\. Streaming Endpoint SSE (Auto-Finishing)

Streams a paragraph word by word and closes the connection when finished.

- **URL**: `/stream-sse`

- **Method**: `GET`

- **Content-Type**: `text/event-stream`

- **Response Stream Format**: Each message is a JSON string prefixed with `data:`. The stream ends when a message with `finish: true` is sent.

  **Example Chunk:**

  ```json
  data: {"content":"Large ","finish":false}
  ```

  **Final Chunk:**

  ```json
  data: {"content":null,"finish":true}
  ```

### 3\. Streaming Endpoint (Looping)

Streams words from a sentence continuously in an infinite loop.

- **URL**: `/stream-loop`

- **Method**: `GET`

- **Content-Type**: `text/event-stream`

- **Description**: This endpoint will **never stop** on its own. The connection will remain open until closed by the client. It's useful for testing the handling of long-lived SSE connections.

- **Response Stream Format**: Each message is plain text prefixed with `data:`.

  **Example Stream:**

  ```
  data: The

  data: quick

  data: brown

  ...
  ```

### 4\. Streaming Endpoint (NDJSON)

Streams a paragraph word by word, similar to the `/stream-sse` endpoint, but uses newline-delimited JSON objects (NDJSON) instead of Server-Sent Events.

- **URL**: `/stream-ndjson`
- **Method**: `GET`
- **Content-Type**: `application/x-ndjson`
- **Response Stream Format**: Each message is a JSON string prefixed with no additional information. The stream ends when a message with `finish: true` is sent.

  **Example Chunk:**

  ```
  {
  "content": "This",
  "finish": false
  }
  ```

### 5\. Static Data Endpoint

Returns a complete JSON object in a single response.

- **URL**: `/api/data`
- **Method**: `GET`
- **Success Response**:
  - **Code**: 200
  - **Content-Type**: `application/json`
  - **Content Example**:
    ```json
    {
      "id": "a1b2-c3d4-e5f6",
      "type": "static_response",
      "title": "Complete Static Data",
      "message": "This is a complete JSON response sent all at once...",
      "author": "Practice API",
      "metadata": { ... },
      "payload": [ ... ]
    }
    ```

---

## 💻 Client-Side Usage Examples

### Consuming the `/stream` Endpoint (SSE)

Use the `EventSource` API in JavaScript to handle the auto-finishing stream.

```html
<h3>Auto-Finishing Stream:</h3>
<div id="result-stream"></div>
<script>
  const resultStreamDiv = document.getElementById("result-stream");
  const eventSource = new EventSource(
    "https://YOUR-RENDER-URL.onrender.com/stream"
  );

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.finish) {
      resultStreamDiv.innerHTML += "<br><strong>-- Stream Finished --</strong>";
      eventSource.close();
    } else {
      resultStreamDiv.innerHTML += data.content;
    }
  };
</script>
```

### Consuming the `/stream-loop` Endpoint (Looping SSE)

For the continuous stream, you just need to append the data without checking for a finish condition.

```html
<h3>Infinite Looping Stream:</h3>
<div id="result-loop"></div>
<button onclick="stopLoop()">Stop Loop</button>
<script>
  const resultLoopDiv = document.getElementById("result-loop");
  const loopSource = new EventSource(
    "https://YOUR-RENDER-URL.onrender.com/stream-loop"
  );

  loopSource.onmessage = (event) => {
    // No need for JSON.parse as the response is plain text
    resultLoopDiv.innerHTML += event.data + " ";
  };

  function stopLoop() {
    loopSource.close();
    resultLoopDiv.innerHTML +=
      "<br><strong>-- Loop Connection Closed by Client --</strong>";
  }
</script>
```

---

## 📄 License

This project is licensed under the MIT License.
