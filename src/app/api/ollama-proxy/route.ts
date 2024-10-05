// app/api/ollama-proxy/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { apiUrl, ...bodyData } = await request.json();

  if (!apiUrl) {
    return NextResponse.json({ error: "API URL is required" }, { status: 400 });
  }

  try {
    console.log(`Attempting to connect to Ollama API at: ${apiUrl}`);
    const ollameResponse = await fetch(`${apiUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    });

    if (!ollameResponse.ok) {
      throw new Error(
        `Ollama API responded with status: ${ollameResponse.status}`
      );
    }

    // Create a TransformStream to modify the stream
    const transformStream = new TransformStream({
      transform(chunk, controller) {
        // Pass through the chunk as-is
        controller.enqueue(chunk);
      },
    });

    // Pipe the response through our transform stream
    const stream = ollameResponse.body?.pipeThrough(transformStream);

    // Return a streaming response
    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error details:", error);
    return NextResponse.json(
      { error: `Failed to fetch from Ollama API` },
      { status: 500 }
    );
  }
}
