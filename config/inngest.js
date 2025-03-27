import { Inngest } from "inngest"
import dbConnect from "./db"
import User from "@/models/user"

// create a client to send and receive events
export const inngest = new Inngest({ id: "stikflo-next" })

// inngest function to create user
export const syncUserCreate = inngest.createFunction(
    {
        id: 'sync-user-from-clerk',
    }, {
        event: 'clerk/user.created'
    },
    async (event) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        
        await dbConnect()

        const user = await User.findOne({ id })

        if (!user) {
            await User.create({
                _id: id,
                name: `${first_name} ${last_name}`,
                email: email_addresses[0].email_address,
                image: image_url
            });
        }
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
            name: `${first_name} ${last_name}`,
            email: email_addresses[0].email_address,
            image: image_url
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