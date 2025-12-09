/**
 * API Route: Save FCM Token
 * 
 * This endpoint saves the FCM device token to your database.
 * The token is used to send push notifications to specific devices.
 * 
 * Method: POST
 * Body: { token: string, userId?: string, timestamp: string }
 */

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, userId, timestamp } = body;

    // Validate required fields
    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    // TODO: Implement your database logic here
    // Example with Prisma:
    // 
    // const fcmToken = await prisma.fcmToken.upsert({
    //   where: { token },
    //   update: {
    //     userId,
    //     updatedAt: new Date(timestamp),
    //   },
    //   create: {
    //     token,
    //     userId,
    //     createdAt: new Date(timestamp),
    //   },
    // });

    // For now, just log the token (REMOVE THIS IN PRODUCTION)
    console.log("FCM Token received:", {
      token: token.substring(0, 20) + "...", // Log only first 20 chars for security
      userId,
      timestamp,
    });

    // Simulate successful save
    return NextResponse.json({
      success: true,
      message: "FCM token saved successfully",
      data: {
        token: token.substring(0, 20) + "...",
        userId,
      },
    });
  } catch (error) {
    console.error("Error saving FCM token:", error);
    return NextResponse.json(
      {
        error: "Failed to save FCM token",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}




