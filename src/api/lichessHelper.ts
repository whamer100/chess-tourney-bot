import axios from "axios"
import * as ndjsonParser from "ndjson-parse"

// base endpoints
const lichessEndpoint = "https://lichess.org"

// constructed endpoint urls
const lichessBroadcastEndpoint = `${lichessEndpoint}/api/broadcast`

export type BroadcastTour = {
    id: string,
    name: string,
    slug: string,
    desc: string,
    url: string
}
export type BroadcastRound = {
    id: string,
    name: string,
    slug: string,
    startsAt: Date,
    url: string,
    status: BroadcastStatus
}
export enum BroadcastStatus {
    NOT_STARTED,
    ONGOING,
    FINISHED
}
export const BroadcastStatusMsg = {
    0: "Not Started",
    1: "Ongoing",
    2: "Finished"
}

export type Broadcast = {
    tour: BroadcastTour,
    rounds: BroadcastRound[],
    status: string, // used to display the current round
    completed: boolean // flag to indicate all rounds completed
}

const buildBroadcast = (entry: JSON): Broadcast => {
    const tourBlob: JSON = entry["tour"]
    const tourRounds: JSON[] = entry["rounds"]

    const roundCount = tourRounds.length

    const tourID: string = tourBlob["id"]
    const tourName: string = tourBlob["name"]
    const tourSlug: string = tourBlob["slug"]
    const tourDesc: string = tourBlob["description"]
    const tourUrl: string = tourBlob["url"]

    const tour: BroadcastTour = {
        id: tourID,
        name: tourName,
        slug: tourSlug,
        desc: tourDesc,
        url: tourUrl
    }
    const rounds: BroadcastRound[] = []

    let i = 0;
    for (const round of tourRounds) {
        const roundID: string = round["id"]
        const roundName: string = round["name"]
        const roundSlug: string = round["slug"]
        const roundStartTime: Date = new Date(round["startsAt"])
        const roundURL: string = round["url"]
        const roundStatus: BroadcastStatus = ("finished" in round) ? BroadcastStatus.FINISHED
            : ("ongoing"  in round) ? BroadcastStatus.ONGOING
                : BroadcastStatus.NOT_STARTED

        if (roundStatus === BroadcastStatus.FINISHED) {
            i++
        }

        const tourRound: BroadcastRound = {
            id: roundID,
            name: roundName,
            slug: roundSlug,
            startsAt: roundStartTime,
            url: roundURL,
            status: roundStatus
        }
        rounds.push(tourRound)
    }

    const broadcast: Broadcast = {
        tour: tour,
        rounds: rounds,
        status: `${i}/${roundCount}`,
        completed: roundCount === i
    }
    return broadcast
}

export const getCurrentBroadcasts = async (count: number = 20): Promise<Broadcast[] | undefined> => {
    const nb: number = Math.min(Math.max(0, count), 100)
    const lichessBroadcastEndpointURL = `${lichessBroadcastEndpoint}?nb=${nb}`

    const resp = await axios.get(lichessBroadcastEndpointURL)
    if (resp.status !== 200) {
        return undefined
    }
    const entries: JSON[] = ndjsonParser(resp.data)
    const broadcasts: Broadcast[] = []

    for (const entry of entries) {
        const broadcast: Broadcast = buildBroadcast(entry)
        broadcasts.push(broadcast)
    }
    return broadcasts
}

export const getBroadcast = async (id: string): Promise<Broadcast | undefined> => {
    const resp = await axios.get(`${lichessEndpoint}/broadcast/-/${id}`)
    if (resp.status !== 200) {
        return undefined
    }
    return buildBroadcast(resp.data)
}
