import {ArgumentOptions, Command} from 'discord-akairo';
import {MessageEmbed} from "discord.js";
import {Broadcast, BroadcastStatusMsg, getBroadcast} from "../api/lichessHelper";
import {botMainColor} from "../constants";

class CTGetBroadcast extends Command {
    constructor() {
        super('broadcast', {
            aliases: ['broadcast'],
            args: [{
                id: "id",
                type: "string",
                prompt: true
            },{
                id: "list",
                type: "string"
            }]
        });
    }

    description = "Returns a broadcast."

    async exec(message, args: ArgumentOptions) {
        const broadcast: Broadcast = await getBroadcast(args["id"])

        const embed = new MessageEmbed()
            .setTitle(broadcast.tour.name)
            .setURL(broadcast.tour.url)
            .setDescription(broadcast.tour.desc)
            .addField("Current round", broadcast.status)
            .setColor(botMainColor)

        if (args["list"] === "list") {
            const roundsMap = broadcast.rounds.map((round) => {
                const status = BroadcastStatusMsg[round.status]
                return `${round.name}: \`${round.id}\` [${status}]`
            })
            embed.addField("Rounds", roundsMap.join("\n"))
        }

        return message.channel.send(embed);
    }
}

module.exports = CTGetBroadcast;