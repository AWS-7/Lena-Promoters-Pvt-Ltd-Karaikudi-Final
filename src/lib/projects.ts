import { createClient } from "@supabase/supabase-js";
import type { Project } from "@/lib/types";
import { isImageUrlReachable } from "@/lib/validate-image";

function getServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes("placeholder")) return null;
  return createClient(url, key);
}

async function sanitizeProjectImage(project: Project): Promise<Project> {
  if (!project.image_url) return project;
  const ok = await isImageUrlReachable(project.image_url);
  if (ok) return project;
  return { ...project, image_url: "" };
}

export async function getProjectById(id: string): Promise<Project | null> {
  const supabase = getServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase.from("projects").select("*").eq("id", id).single();
  if (error || !data) return null;
  return sanitizeProjectImage(data as Project);
}

export async function getAllProjects(): Promise<Project[]> {
  const supabase = getServerClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  const projects = (data as Project[]) || [];
  return Promise.all(projects.map(sanitizeProjectImage));
}
