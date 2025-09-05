import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const genreId = searchParams.get("genreId");
    const page = searchParams.get("page") || "1";
    const apiKey = process.env.TMDB_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "TMDB API key not configured" },
        { status: 500 }
      );
    }

    if (!genreId) {
      return NextResponse.json(
        { error: "Genre ID parameter is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&page=${page}&sort_by=popularity.desc`,
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
    console.error("Error fetching movies by genre:", error);
    return NextResponse.json(
      { error: "Failed to fetch movies by genre" },
      { status: 500 }
    );
  }
}
