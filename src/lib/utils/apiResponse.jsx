// lib/apiResponse.js

import { NextResponse } from "next/server";

/**
 * Send a successful API response
 * @param {string} message - message to send to client
 * @param {number} status - HTTP status code (default 200)
 * @param {any} data - optional data payload
 */
export function successResponse(message, status = 200, data = null) {
  return NextResponse.json(
    {
      success: true,
      message: message,
      data: data,
    },
    { status: status }
  );
}

/**
 * Send an error API response
 * @param {string} message - error message
 * @param {number} status - HTTP status code (default 400)
 */
export function errorResponse(message, status = 400) {
  return NextResponse.json(
    {
      success: false,
      message: message,
    },
    { status: status }
  );
}
