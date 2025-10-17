import { executeCwdCommand } from "@api/services/commands.service";
import { Hono } from "hono";

const commands = new Hono()
  .post("/:name/open-folder", (ctx) => {
    const { name } = ctx.req.param();

    executeCwdCommand(name, "open");

    return ctx.json({ message: "Folder opened" }, 202);
  })
  .post("/:name/open-ide", (ctx) => {
    const { name } = ctx.req.param();

    executeCwdCommand(name, "code");

    return ctx.json({ message: "IDE opened" }, 202);
  });

export { commands };
