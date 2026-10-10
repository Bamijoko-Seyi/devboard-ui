import api from "./client";

export async function listTasks(projectId) {
    const { data } = await api.get(`/api/projects/${projectId}/tasks`);
    return data;
}

export async function createTask(projectId, payload) {
    const { data } = await api.post(`/api/projects/${projectId}/tasks`, payload);
    return data;
}

export async function updateTask(projectId, taskId, payload) {
    const { data } = await api.put(`/api/projects/${projectId}/tasks/${taskId}`, payload);
    return data;
}

export async function deleteTask(projectId, taskId) {
    await api.delete(`/api/projects/${projectId}/tasks/${taskId}`);
}