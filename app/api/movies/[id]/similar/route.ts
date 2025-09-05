import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const movieId = params.id;
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const apiKey = process.env.TMDB_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "TMDB API key not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${apiKey}&page=${page}`,
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
    console.error("Error fetching similar movies:", error);
    return NextResponse.json(
      { error: "Failed to fetch similar movies" },
      { status: 500 }
    );
  }
}
