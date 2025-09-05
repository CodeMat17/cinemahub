import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const apiKey = process.env.TMDB_API_KEY;

    console.log("API Key exists:", !!apiKey);
    console.log("API Key length:", apiKey?.length || 0);

    if (!apiKey) {
      console.error("TMDB API key not configured");
      return NextResponse.json(
        {
          error:
            "TMDB API key not configured. Please add TMDB_API_KEY to your .env.local file",
        },
        { status: 500 }
      );
    }

    const tmdbUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}`;
    console.log("Making request to:", tmdbUrl.replace(apiKey, "***"));

    const response = await fetch(tmdbUrl, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("TMDB Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("TMDB API error response:", errorText);
      throw new Error(`TMDB API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return NextResponse.json(
      { error: "Failed to fetch popular movies" },
      { status: 500 }
    );
  }
}
