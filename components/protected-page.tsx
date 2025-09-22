"use client"

import type React from "react"

import { AuthGuard } from "./auth-guard"

interface ProtectedPageProps {
  children: React.ReactNode
}

export function ProtectedPage({ children }: ProtectedPageProps) {
  return <AuthGuard>{children}</AuthGuard>
}
