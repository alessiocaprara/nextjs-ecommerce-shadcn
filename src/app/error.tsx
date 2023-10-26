"use client";

import { useEffect } from "react";

interface ErrorPageProps {
    error: Error & { digest?: string },
    reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {

    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <>
            <div>Something went wrong. Please refresh the page.</div>
            <div>Please customize this page considering you have access to error prop and reset function.</div>
        </>
    )

}