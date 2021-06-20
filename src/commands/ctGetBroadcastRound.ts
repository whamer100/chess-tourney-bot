import {ArgumentOptions, Command} from 'discord-akairo';
import {MessageEmbed} from "discord.js";
import {Broadcast, getBroadcast, getBroadcastFromStudy, getStudyPGN, parseStudyPGN, Study} from "../api/lichessHelper";
import {botMainColor} from "../constants";
import {pgnSerialize, pgnSerialized} from "../api/chessHelper";

const lichessEndpoint = "https://lichess.org"

class CTGetBroadcastRound extends Command {
    constructor() {
        super('round', {
            aliases: ['round'],
            args: [{
                id: "id",
                type: "string",
            }]
        });
    }

    description = ["[id]", "Returns a broadcast round."]

    async exec(message, args: ArgumentOptions) {
        if (args["id"] === null) {
            return message.channel.send("No RoundID provided.")
        }

        const studyRawPGN: string = await getStudyPGN(args["id"])

        if (studyRawPGN === undefined) {
            return message.channel.send("Invalid RoundID provided.")
        }

        const study: Study = parseStudyPGN(studyRawPGN)

        const serializedStudies: pgnSerialized[] = []
        for (const pgn of study.pgns) {
            serializedStudies.push(pgnSerialize(pgn))
        }

        const randomStudy: pgnSerialized = serializedStudies[0]

        const rawSite = randomStudy.header.site

        // console.log(rawSite) // if it gets this far, it properly serialized everything

        // if it works, it works
        const studyID: string = rawSite.split("study/")[1].split('/')[0]
        // console.log(studyID)
        const broadcast: Broadcast = await getBroadcastFromStudy(studyID)

        const roundURL: string = `${lichessEndpoint}/broadcast/-/-/${studyID}`

        const matchList: string[] = serializedStudies
            .filter((study) => study !== undefined)
            .map((study) => {
                // console.log(study)
                const studyWhite = study.header.white
                const studyBlack = study.header.black

                const matchID = study.header.site.split("/").pop()// last item is always the match id

                const whiteTitle = (studyWhite.title === null) ? "" : `${studyWhite.title} `
                const white = `${whiteTitle}${studyWhite.name}`
                const blackTitle = (studyBlack.title === null) ? "" : `${studyBlack.title} `
                const black = `${blackTitle}${studyBlack.name}`

                const result = study.header.result

                return `\`${matchID}\`: ${white} vs ${black} [${(result === '*') ? "ONGOING" : result}]`
            })

        const embed = new MessageEmbed()
            .setTitle(`${broadcast.tour.name} | Matches`)
            .setURL(roundURL)
            .setDescription(matchList.join("\n"))
            .setColor(botMainColor)

        return message.channel.send(embed);
    }
}

module.exports = CTGetBroadcastRound;