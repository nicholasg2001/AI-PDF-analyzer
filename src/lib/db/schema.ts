import { 
    pgTable, 
    serial, 
    text, 
    timestamp, 
    varchar, 
    integer, 
    pgEnum 
} from 'drizzle-orm/pg-core';

//enum type to determine whether message is coming from GPT (system) or user.
export const userSystemEnum = pgEnum('user_system_enum', ['system', 'user'])

export const chats = pgTable('chats', {
    id: serial('id').primaryKey(),
    pdf_name: text('pdf_name').notNull(),
    pdf_url: text('pdf_url').notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    user_id: varchar('user_id', {length:256}).notNull(),
    file_key: text('file_key').notNull(),
})

// Create a usable type, DrizzleChat, which models the chats table structure
export type DrizzleChat = typeof chats.$inferSelect;

export const messages = pgTable('messages', {
    id: serial('id').primaryKey(),
    chat_id: integer('chat_id')
        .references(() => chats.id)
        .notNull(),
    content: text('content').notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    role: userSystemEnum('role').notNull(),
})