import api from './client';
import type { AuthResponse } from '../types';

export async function signup(username:string, email :string, password: string) {
    const {data} = await api.post<AuthResponse>('/api/auth/signup', {username, email, password});
    return data;   
}

export async function login(email :string, password: string) {
    const {data} = await api.post<AuthResponse>('/api/auth/login', {email, password});
    return data;   
}


export async function me() {
    const {data} = await api.post<AuthResponse>('/api/auth/me');
    return data;   
}


