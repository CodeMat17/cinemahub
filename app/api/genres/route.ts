import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.TMDB_API_KEY;

    console.log("Genres API - API Key exists:", !!apiKey);

    if (!apiKey) {
      console.error("TMDB API key not configured for genres");
      return NextResponse.json(
        {
          error:
            "TMDB API key not configured. Please add TMDB_API_KEY to your .env.local file",
        },
        { status: 500 }
      );
    }

    const tmdbUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`;
    console.log("Making genres request to:", tmdbUrl.replace(apiKey, "***"));

    const response = await fetch(tmdbUrl, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("TMDB Genres Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("TMDB Genres API error response:", errorText);
      throw new Error(`TMDB API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching genres:", error);
    return NextResponse.json(
      { error: "Failed to fetch genres" },
      { status: 500 }
    );
  }
}
