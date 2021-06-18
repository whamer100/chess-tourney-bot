import {GuildMember} from "discord.js"
import {chain} from "ramda";
import * as crypto from "crypto"
import R = require("ramda");

export const boxContents = (...texts: string[]) => { // borrowed from another bot, thanks xetera o/
    const getLines = (text: string) => text.split("\n").map((line) => line.length);
    const splitTexts = chain(getLines);
    const maxLength = Math.max(...splitTexts(texts));
    const [head, ...tail] = texts;

    const spacer = "-".repeat(maxLength);
    return tail.reduce((all, text) => [...all, text, spacer], [spacer, head, spacer]).join("\n");
};

export const isOwner = (id: string): boolean => (process.env.OWNERS || "136644132117413888")
    .split(",")
    .some(R.equals(id));


export const isMod = (member: GuildMember): boolean =>
    member.hasPermission("KICK_MEMBERS") || isOwner(member.id)

/**
 * Ensures a string has an appropriate length
 * Returns undefined if a string is null
 * @param s Source string
 * @param limit Threshold for when a new line should be created (does not limit the line to exactly this value!)
 */
export const wrapString = (s: string, limit: number = 24): string => {
    // TODO: Refactor this to not use while loops
    if (s === null) {
        return undefined
    }
    const res = []
    const items = s.split(" ")
    const count = items.length
    let acc = 0
    let i = 0
    while (acc < s.length) {
        if (i >= count) break;
        let a = ""
        while (a.length < limit) {
            const t = items[i++]
            if (t === undefined) break;
            a = [a, t]
                .join(" ")
                .trim()
        }
        acc += a.length
        res.push(a)
    }
    return res.join("\n")
}


export type PromiseOrder<T> = { i: number, v: T; }

export const PromiseAllOrder = async <T>(P: Promise<PromiseOrder<T>>[]): Promise<T[]> => {
    const nP = new Array(P.length)
    const PP = await Promise.all(P)
    PP.forEach((value => {
        const index = value.i
        nP[index] = value.v
    }))
    return nP
}


export const md5 = (source: string) => {
    return crypto.createHash('md5').update(source)
}
