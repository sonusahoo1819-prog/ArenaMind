const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface Incident {
  id: string;
  title: string;
  description: string;
  type: 'MEDICAL' | 'SECURITY' | 'SOS' | 'MAINTENANCE' | 'CROWD' | 'OTHER';
  status: 'REPORTED' | 'DISPATCHED' | 'RESOLVED' | 'CANCELLED';
  location: {
    lat?: number;
    lng?: number;
    zoneId: string;
    level?: string;
  };
  reporterId?: string;
  createdAt: string;
}

export const securityService = {
  async reportIncident(title: string, description: string, type: string, location: any, token: string): Promise<Incident> {
    const response = await fetch(`${API_URL}/security/incident`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description, type, location }),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to submit incident');
    }
    return response.json();
  },

  async triggerSOS(location: any, token: string): Promise<Incident> {
    const response = await fetch(`${API_URL}/security/sos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ location }),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to trigger SOS');
    }
    return response.json();
  },

  async getIncidents(token: string): Promise<Incident[]> {
    const response = await fetch(`${API_URL}/security/incidents`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to fetch incidents');
    }
    return response.json();
  },

  async updateIncidentStatus(id: string, status: string, token: string): Promise<Incident> {
    const response = await fetch(`${API_URL}/security/incident/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to update status');
    }
    return response.json();
  },
};
