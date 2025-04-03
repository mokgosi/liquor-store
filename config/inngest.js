import { Inngest } from "inngest"
import dbConnect from "./db"
import User from "@/models/User"

// create a client to send and receive events
export const inngest = new Inngest({ id: "stikflo-next" })

// inngest function to create user
export const syncUserCreate = inngest.createFunction(
    {
        id: 'sync-user-create-from-clerk',
    }, {
        event: 'clerk/user.created'
    },
    async (event) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: `${first_name} ${last_name}`,
            imageUrl: image_url
        }
        await dbConnect()
        await User.create(userData);
    }
)

// update user
export const syncyUserUpdate = inngest.createFunction(
    {
        id: 'sync-user-update-from-clerk',
    }, {
        event: 'clerk/user.updated'
    },
    async (event) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        
        await dbConnect()

        await User.findByIdAndUpdate(id, {
            email: email_addresses[0].email_address,
            name: `${first_name} ${last_name}`,
            imageUrl: image_url
        });
    }
)

// delete user
export const syncyUserDelete = inngest.createFunction(
    {
        id: 'sync-user-delete-from-clerk',
    }, {
        event: 'clerk/user.deleted'
    },
    async (event) => {
        const { id } = event.data
        
        await dbConnect()

        await User.findByIdAndDelete(id);
    }
)