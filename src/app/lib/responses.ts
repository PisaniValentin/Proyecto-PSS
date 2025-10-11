import { NextResponse } from 'next/server'

export function successResponse(data: any, message?: string) {
    return NextResponse.json({ success: true, message, data })
}

export function errorResponse(message: string, status: number = 400, errors?: any) {
    return NextResponse.json({ success: false, message, errors }, { status })
}