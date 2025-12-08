/**
 * API Route: Delete FCM Token
 * 
 * This endpoint deletes an FCM device token from your database.
 * Should be called when user logs out or disables notifications.
 * 
 * Method: DELETE
 * Body: { token: string }
 */

import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

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
    // await prisma.fcmToken.delete({
    //   where: { token },
    // });

    // For now, just log the deletion (REMOVE THIS IN PRODUCTION)
    console.log("FCM Token deletion requested:", {
      token: token.substring(0, 20) + "...", // Log only first 20 chars for security
    });

    // Simulate successful deletion
    return NextResponse.json({
      success: true,
      message: "FCM token deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting FCM token:", error);
    return NextResponse.json(
      {
        error: "Failed to delete FCM token",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

