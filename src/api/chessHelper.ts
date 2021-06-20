import {Chess} from "chess.js"

export type pgnPlayer = {
    name: string,
    title: string | null,
    rating: number | null
}
export type pgnOpening = {
    eco: string | null,
    opening: string | null
}

export type pgnHeader = {
    //required
    event: string,
    site: string,
    white: pgnPlayer,
    black: pgnPlayer,
    result: string, // might make a type for this if needed
    //optional
    time: Date | null,
    variant: string | null,
    opening: pgnOpening | null,
    annotator: string | null,
    plyCount: string | null,
    timeControl: string | null,
    mode: string | null,
    fen: string | null
}

export type pgnSerialized = {
    pgn: string,
    fen: string,
    header: pgnHeader
}

type pgnLine = { // just for a bit of abstraction
    [key: string]: string
}

const requiredPgnKeys = ["event", "site", "white", "black", "result"]

export const pgnSerialize = (pgn: string): pgnSerialized | undefined => {
    // console.log(pgn)
    const chessState = new Chess()
    if (!chessState.load_pgn(pgn)) return undefined
    // console.log(chessState.ascii())
    const fen = chessState.fen()

    const pgnLines: string[] = pgn.split("\n")
    const pgnSections: pgnLine = {}
    pgnLines
        .filter(line => line.startsWith("["))
        .map(line => {
            const segment = line.substring(1, line.length - 1)
            const i = segment.indexOf(" ")
            const parts = [segment.substring(0, i), segment.substring(i + 1, line.length)]
            pgnSections[parts[0].toLowerCase()] = parts[1].substring(1, parts[1].length - 1)
        })

    // console.log(pgnSections)

    const keys: string[] = Object.keys(pgnSections)
    // console.log(keys)
    // console.log(requiredPgnKeys)
    const valid: boolean = requiredPgnKeys.every(item => keys.includes(item))// item in keys THIS DOES NOT WORK!!!!!!!!!
    // console.log(valid)
    if (!valid) return undefined;

    const white: pgnPlayer = {
        name: pgnSections["white"],
        title: pgnSections["whitetitle"] || null,
        rating: Number.parseInt(pgnSections["whiterating"]) || null,
    }
    const black: pgnPlayer = {
        name: pgnSections["black"],
        title: pgnSections["blacktitle"] || null,
        rating: Number.parseInt(pgnSections["blackrating"]) || null,
    }

    // console.log(white)
    // console.log(black)

    const opening: pgnOpening = {
        eco: pgnSections["eco"] || null,
        opening: pgnSections["opening"] || null
    }

    const serializedHeader: pgnHeader = {
        event: pgnSections["event"],
        site: pgnSections["site"],
        white: white,
        black: black,
        result: pgnSections["result"], // might make a type for this if needed
        //optional
        time: null,
        variant: pgnSections["site"] || null,
        opening: opening || null,
        annotator: pgnSections["site"] || null,
        plyCount: pgnSections["plycount"] || null,
        timeControl: pgnSections["timecontrol"] || null,
        mode: pgnSections["mode"] || null,
        fen: pgnSections["fen"] || null
    }

    const constructedPgnData: pgnSerialized = {
        pgn: pgn,
        fen: fen,
        header: serializedHeader
    }

    // console.log(constructedPgnData)

    return constructedPgnData
}