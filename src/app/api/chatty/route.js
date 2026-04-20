import { NextResponse } from "next/server";
import { getChatResponse } from "@/server/chattyAI";

export const POST = async (request) => {
    try {
        const body = await request.json();
        const roomId = body?.roomId;
        const message = body?.message;

        if (!roomId || typeof message !== "string") {
            return NextResponse.json(
                { error: "Invalid request payload." },
                { status: 400 }
            );
        }

        const text = await getChatResponse(roomId, message);
        return NextResponse.json({ text });
    } catch (error) {
        console.error("Chatty API error:", error?.message || error);
        return NextResponse.json(
            { error: "Failed to get a response from Chatty." },
            { status: 500 }
        );
    }
};
