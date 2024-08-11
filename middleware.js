import { NextResponse } from "next/server";
import axios from "axios";

export async function middleware(request) {
    try {
        const response = await axios.get('http://148.113.194.169:5000/check');
        const authenticated = response.data.authenticated;
        console.log(authenticated)
        if (!authenticated) {
            return NextResponse.redirect(new URL('/auth/signin', request.url));
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Error fetching authentication status:", error);
        return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
}


export const config = {
    matcher: ['/']
}