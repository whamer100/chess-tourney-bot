import {Command} from 'discord-akairo';
import {MessageEmbed, GuildMember, ImageURLOptions} from "discord.js";
import {commandCollection} from "../index";
import {botMainColor} from "../constants";
import {formatHelp} from "../utils";

class HelpCommand extends Command {
    constructor() {
        super('help', {
            aliases: ['help']
        });
    }

    description = "Shows this message."

    async exec(message) {
        const invoker: GuildMember = message.member
        const avatarOptions: ImageURLOptions = {
            format: "png",
            size: 32
        }

        const commandList: string[] = commandCollection.map(
            (mod) => formatHelp(mod)
        )
        // TODO: make this have pages and categories

        const embed = new MessageEmbed()
            .setFooter(invoker.displayName, invoker.user.avatarURL(avatarOptions))
            .addField("Commands", `[required] (optional)\n\n${commandList.join("\n")}`)
            .setColor(botMainColor)

        return message.reply(embed);
    }
}

module.exports = HelpCommand;