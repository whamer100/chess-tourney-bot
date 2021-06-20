import { CommandHandler } from "discord-akairo";
import {boxContents, formatHelp} from "./utils";
import { BotClient } from "./index";

const logStartup = (client: BotClient) => {
    const stat = `Logged in as ${client.user.tag} [id:${client.user.id}]`;
    const commands = client.commandHandler.modules.map(
        (mod) => formatHelp(mod)
    );
    const out = boxContents("Started Up!", stat, commands.join("\n"));
    console.log(out);
};

const onReady = (client: BotClient) => {
    logStartup(client)
}

export const handleEvents = (client: BotClient) => {
    client.on("ready", () => onReady(client));
}
