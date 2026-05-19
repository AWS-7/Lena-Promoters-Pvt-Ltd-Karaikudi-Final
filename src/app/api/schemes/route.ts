import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  return createClient(supabaseUrl, supabaseServiceKey);
}

// GET all schemes (public)
export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("schemes")
      .select("*")
      .eq("active", true)
      .order("order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch schemes", error);
      return NextResponse.json({ error: "Failed to fetch schemes" }, { status: 500 });
    }

    return NextResponse.json({ schemes: data });
  } catch (error) {
    console.error("Error fetching schemes", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST new scheme (admin only)
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const body = await request.json();
    const { data, error } = await supabase
      .from("schemes")
      .insert(body)
      .select()
      .single();

    if (error) {
      console.error("Failed to create scheme", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("Scheme created", { id: data.id, title: data.title });
    return NextResponse.json({ scheme: data }, { status: 201 });
  } catch (error) {
    console.error("Error creating scheme", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT update scheme (admin only)
export async function PUT(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const { id, ...updates } = await request.json();
    const { data, error } = await supabase
      .from("schemes")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Failed to update scheme", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("Scheme updated", { id, title: data.title });
    return NextResponse.json({ scheme: data });
  } catch (error) {
    console.error("Error updating scheme", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE scheme (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("schemes")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Failed to delete scheme", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("Scheme deleted", { id });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting scheme", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
