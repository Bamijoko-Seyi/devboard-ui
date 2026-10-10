import api from "./client";

export async function inviteUser(projectId, email) {
    const { data } = await api.post(`/api/projects/${projectId}/invitations`, { email });
    return data;
}

export async function listProjectInvitations(projectId) {
    const { data } = await api.get(`/api/projects/${projectId}/invitations`);
    return data;
}

export async function listMyPendingInvitations() {
    const { data } = await api.get("/api/invitations/pending");
    return data;
}

export async function acceptInvitation(id) {
    await api.post(`/api/invitations/${id}/accept`);
}

export async function declineInvitation(id) {
    await api.post(`/api/invitations/${id}/decline`);
}