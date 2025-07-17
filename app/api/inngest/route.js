import { serve } from "inngest/next";
import { inngest, syncuserCreation, syncUserDeletion, syncUserUpdation } from "@/config/inngest";
import { helloWorld } from "../../../inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncuserCreation,
    syncUserUpdation,
    syncUserDeletion
  ],
});