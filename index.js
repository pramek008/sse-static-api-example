import express from "express";
import cors from "cors";

const app = express();
// Use PORT from environment variable or default to 3000
const PORT = process.env.PORT || 3000;

// Middleware for Cross-Origin Resource Sharing (CORS)
app.use(cors());

// ----------------------------------------------------
// 1. STREAMING ENDPOINT (SERVER-SENT EVENTS / SSE)
// Ideal for simulating LLM response streaming
// ----------------------------------------------------
app.get("/stream", (req, res) => {
  // Set headers for Server-Sent Events
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders(); // Send headers immediately

  const longParagraph =
    "Large Language Models, often abbreviated as LLMs, are a type of artificial intelligence model trained on vast amounts of text data. They are designed to understand, generate, and respond to human language in a coherent and contextually relevant manner. This streaming demonstration mimics how an LLM might deliver its response token by token, providing a more interactive user experience rather than waiting for the entire output to be generated. Each word you see is a separate chunk of data sent from the server. This technique is crucial for applications that require real-time feedback, such as chatbots and live content generation.";
  const words = longParagraph.split(" ");

  let index = 0;
  const interval = setInterval(() => {
    if (index < words.length) {
      // Send a chunk of data in JSON format
      const chunk = {
        content: words[index] + " ", // Add space for better client-side rendering
        finish: false,
      };
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      index++;
    } else {
      // Send the final message indicating the stream is complete
      const endChunk = {
        content: null,
        finish: true,
      };
      res.write(`data: ${JSON.stringify(endChunk)}\n\n`);

      // Stop the interval and end the connection
      clearInterval(interval);
      res.end();
    }
  }, 100); // Shorter interval for a more fluid "typing" effect (150ms)

  // Handle client disconnect
  req.on("close", () => {
    clearInterval(interval);
    res.end();
    console.log("Client closed the connection.");
  });
});

// ----------------------------------------------------
// 2. STANDARD FETCH ENDPOINT (NON-STREAMING)
// ----------------------------------------------------
app.get("/api/data", (req, res) => {
  const data = {
    id: "a1b2-c3d4-e5f6",
    type: "static_response",
    title: "Complete Static Data",
    message:
      "This is a complete JSON response sent all at once. It's useful for scenarios where the client needs all the data before rendering, unlike a streaming approach which is better for progressive data loading.",
    author: "Practice API",
    metadata: {
      timestamp: new Date().toISOString(),
      source: "server-generated",
    },
    payload: [
      { point: 1, value: "First item" },
      { point: 2, value: "Second item" },
      { point: 3, value: "Third item" },
    ],
  };

  // Send the full JSON response
  res.json(data);
});

// ----------------------------------------------------
// 3. LOOPING STREAMING ENDPOINT
// ----------------------------------------------------
app.get("/stream-loop", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  const longParagraph =
    "The quick brown fox jumped over the lazy dog. The sun was shining brightly in the clear blue sky. A gentle breeze rustled the leaves of the trees as the birds sang their sweet melodies. In the distance, the sound of children's laughter echoed through the air.";
  const words = longParagraph.split(" ");
  let i = 0;

  setInterval(() => {
    res.write(`data: ${words[i % words.length]}\n\n`);
    i++;
  }, 200);
});

// Root endpoint for health check or welcome message
app.get("/", (req, res) => {
  res.send(
    "Practice API server is running. Try accessing /stream or /api/data"
  );
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
