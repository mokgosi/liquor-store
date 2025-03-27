import { serve } from "inngest/next";
import { inngest, syncUserCreate, syncyUserDelete, syncyUserUpdate } from "@/config/inngest";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
     syncUserCreate,
     syncyUserUpdate,
     syncyUserDelete
  ],
});