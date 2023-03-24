import cors from 'cors';
import express from "express";
import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { z } from "zod";

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({}); // no context
type Context = inferAsyncReturnType<typeof createContext>;
const t = initTRPC.context<Context>().create();

const router = t.router;
const publicProcedure = t.procedure;

interface ChatMessage {
  user: string;
  message: string;
}

const messages: ChatMessage[] = [
  {
    user: "John",
    message: "Hello",
  },
  {
    user: "Jane",
    message: "Hi",
  },
  {
    user: "Karl",
    message: "How are you?",
  },
];

interface User {
  id: string;
  name: string;
}
const userList: User[] = [
  {
    id: "1",
    name: "KATT",
  },
];
const appRouter = router({
  userById: publicProcedure
    .input((val: unknown) => {
      if (typeof val === "string") return val;
      throw new Error(`Invalid input: ${typeof val}`);
    })
    .query((req) => {
      const input = req.input;
      const user = userList.find((it) => it.id === input);
      return user;
    }),
  userCreate: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation((req) => {
      const id = `${Math.random()}`;
      const user: User = {
        id,
        name: req.input.name,
      };
      userList.push(user);
      return user;
    }),
  getMessages: publicProcedure.input(z.number().default(10)).query((req) => {
    return messages.slice(-req.input);
  }),
  addMessage: publicProcedure
    .input(
      z.object({
        user: z.string(),
        message: z.string(),
      })
    )
    .mutation((req) => {
      messages.push(req.input);
      return req.input;
    }),
});

export type AppRouter = typeof appRouter;

export const serverPort = 8080;
const app = express();

app.use(cors());
app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

app.get("/", (req, res) => {
  res.send("Hello from api-server");
});

app.listen(serverPort, () => {
  console.log(`api-server listening at http://localhost:${serverPort}`);
});
