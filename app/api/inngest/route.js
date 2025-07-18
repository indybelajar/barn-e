import { serve } from "inngest/next";
import { inngest, syncuserCreation, syncUserDeletion, syncUserUpdation } from "../../../config/inngest";
// test 
export const { GET, POST, PUT, } = serve({
  client: inngest,
  functions: [
    syncuserCreation,
    syncUserUpdation,
    syncUserDeletion
  ],
});



