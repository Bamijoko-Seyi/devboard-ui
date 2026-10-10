import api from "./client";

export async function listProjects() {
    const { data } = await api.get("/api/projects");
    return data;
}

export async function getProject(id) {
    const { data } = await api.get(`/api/projects/${id}`);
    return data;
}

export async function createProject(name, description) {
    const { data } = await api.post("/api/projects", { name, description });
    return data;
}

export async function updateProject(id, name, description) {
    const { data } = await api.put(`/api/projects/${id}`, { name, description });
    return data;
}

export async function deleteProject(id) {
    await api.delete(`/api/projects/${id}`);
}

export async function listProjectMembers(projectId) {
    const { data } = await api.get(`/api/projects/${projectId}/members`);
    return data;
}