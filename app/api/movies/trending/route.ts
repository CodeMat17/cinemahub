import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeWindow = searchParams.get("timeWindow") || "week";
    const apiKey = process.env.TMDB_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "TMDB API key not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/trending/movie/${timeWindow}?api_key=${apiKey}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending movies" },
      { status: 500 }
    );
  }
}
