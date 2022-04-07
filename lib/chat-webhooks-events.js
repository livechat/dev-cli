export const CHAT_WEBHOOK_EVENTS = {
  // CHATS
  INCOMING_CHAT: {
    name: 'incoming_chat',
    info: 'Informs about a chat coming with a new thread.',
  },
  CHAT_DEACTIVATED: {
    name: 'chat_deactivated',
    info: 'Informs that a chat was deactivated by closing the currently open thread.',
  },
  // CHAT ACCESS
  CHAT_ACCESS_GRANTED: {
    name: 'chat_access_granted',
    info: 'Informs that new, single access to a chat was granted.',
  },
  CHAT_TRANSFERRED: {
    name: 'chat_transferred',
    info: 'Informs that a chat was transferred to a different group or to an agent.',
  },
  // CHAT USERS
  USER_ADDED_TO_CHAT: {
    name: 'user_added_to_chat',
    info: 'Informs that a user (Customer or Agent) was added to a chat.',
  },
  USER_REMOVED_FROM_CHAT: {
    name: 'user_removed_from_chat',
    info: 'Informs that a user (Customer or Agent) was removed from a chat.',
  },
  // CHAT_EVENTS
  INCOMING_EVENT: {
    name: 'incoming_event',
    info: 'Informs about an incoming event sent to a chat.',
  },
  EVENT_UPDATED: {
    name: 'event_updated',
    info: 'Informs that an event was updated.',
  },
  INCOMING_RICH_MESSAGE_POSTBACK: {
    name: 'incoming_rich_message_postback',
    info: 'Informs about an incoming rich message postback.',
  },
  // PROPERTIES
  CHAT_PROPERTIES_UPDATED: {
    name: 'chat_properties_updated',
    info: 'Informs about those chat properties that were updated.',
  },
  CHAT_PROPERTIES_DELETED: {
    name: 'chat_properties_deleted',
    info: 'Informs about those chat properties that were deleted.',
  },
  THREAD_PROPERTIES_UPDATED: {
    name: 'thread_properties_updated',
    info: 'Informs about those thread properties that were updated.',
  },
  THREAD_PROPERTIES_DELETED: {
    name: 'thread_properties_deleted',
    info: 'Informs about those thread properties that were deleted.',
  },
  EVENT_PROPERTIES_UPDATED: {
    name: 'event_properties_updated',
    info: 'Informs about those event properties that were updated.',
  },
  EVENT_PROPERTIES_DELETED: {
    name: 'event_properties_deleted',
    info: 'Informs about those event properties that were deleted.',
  },
  // THREAD TAGS
  THREAD_TAGGED: {
    name: 'thread_tagged',
    info: 'Informs that a thread was tagged.',
  },
  THREAD_UNTAGGED: {
    name: 'thread_untagged',
    info: 'Informs that a thread was untagged.',
  },
  // STATUS:
  ROUTING_STATUS_SET: {
    name: 'routing_status_set',
    info: "Informs that an Agent's or Bot's status has changed.",
  },
  AGENT_DELETED: {
    name: 'agent_deleted',
    info: "Informs that an Agent's account was deleted.",
  },
  // CUSTOMER:
  INCOMING_CUSTOMER: {
    name: 'incoming_customer',
    info: 'Informs that a new Customer registered.',
  },
  CUSTOMER_SESSION_FIELDS_UPDATED: {
    name: 'customer_session_fields_updated',
    info: `Informs that a chatting Customer's session fields were updated. The webhook will be sent for each active chat the Customer has.`,
  },
  // OTHER:
  EVENTS_MARKED_AS_SEEN: {
    name: 'events_marked_as_seen',
    info: 'Informs that a user has seen events up to a specific time.',
  },
}
