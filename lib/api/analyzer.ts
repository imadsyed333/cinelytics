import { analyzerResponseSchema } from "../schemas/analyzer"

const SERVER_URL = "http://localhost:8000"

export const fetchAnalysis = async (title: string, budget: number, box_office: number, franchise: boolean) => {
    const res = await fetch(
        `${SERVER_URL}/analyze`, 
        {
            method: "POST",
            body: JSON.stringify({
                title,
                budget,
                box_office,
                franchise
            }),
        },
    )
    if (!res.ok) {
        throw new Error(`Analyzer error: ${res.status}`)
    }
    const json = await res.json()

    const parsed = analyzerResponseSchema.safeParse(json)

    if (!parsed.success) {
        console.error(parsed.error)
        throw new Error("Invalid analyzer response")
    }

    return parsed.data
}