import {ArgumentOptions, Command} from 'discord-akairo';
import {MessageEmbed} from "discord.js";
import {Broadcast, getCurrentBroadcasts} from "../api/lichessHelper";
import {botMainColor} from "../constants";

class CTListBroadcasts extends Command {
    constructor() {
        super('broadcasts', {
            aliases: ['broadcasts'],
            args: [{
                id: "nb",
                type: "number",
                default: 20
            }]
        });
    }

    description = "Returns a list of broadcasts. [Up to 20]"

    async exec(message, args: ArgumentOptions) {
        const broadcasts: Broadcast[] = await getCurrentBroadcasts(args["nb"])
        const broadcastMap: string[] = broadcasts
            .filter((broadcast) => {
                return !broadcast.completed;
            })
            .map((broadcast) => {
                return `${broadcast.tour.name} - ${broadcast.tour.id} [${broadcast.status}]`
            })
        const embed = new MessageEmbed()
            .setTitle("Current lichess broadcasts")
            .setDescription(broadcastMap.join("\n"))
            .setColor(botMainColor)

        return message.channel.send(embed);
    }
}

module.exports = CTListBroadcasts;